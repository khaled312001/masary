import { Router, type RequestHandler } from "express";
import multer from "multer";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { analyzeWithClaude, type AnalysisInput } from "../lib/ai";
import { cvUpload, extractCvText } from "../lib/cvExtract";
import { closest, normalizeText, splitList } from "../lib/textMatching";
import { sendMail, htmlShell, row } from "../lib/mailer";

export const analyzeRouter = Router();

// Wrap multer so failures are returned as friendly JSON instead of crashing the request.
const uploadCv: RequestHandler = (req, res, next) => {
  cvUpload.single("cv")(req, res, (err) => {
    if (!err) return next();
    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({ error: "حجم الملف يتجاوز الحد الأقصى (12 ميجابايت)." });
      }
      return res.status(400).json({ error: "تعذر رفع الملف. حاول مرة أخرى." });
    }
    return res.status(400).json({ error: err?.message || "تعذر قراءة الملف." });
  });
};

const Schema = z.object({
  fullName: z.string().min(2).max(100),
  email: z.string().email().max(180).optional().or(z.literal("")),
  phone: z.string().max(40).optional().or(z.literal("")),
  jobTitle: z.string().min(2).max(150),
  employer: z.string().max(150).optional(),
  currentSkills: z.string().max(2000).optional(),
  currentCourses: z.string().max(2000).optional()
});

analyzeRouter.post("/", uploadCv, async (req, res) => {
  const parsed = Schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "الرجاء التحقق من الحقول المطلوبة" });
    return;
  }

  try {
    const cvText = await extractCvText(req.file);
    const data = {
      ...parsed.data,
      email: (parsed.data.email || "").trim() || null,
      phone: (parsed.data.phone || "").trim() || null,
      currentSkills: (parsed.data.currentSkills || "").trim(),
      currentCourses: (parsed.data.currentCourses || "").trim()
    };

    // Accept if either skills text is given OR a CV file is uploaded — Claude can
    // still read the file via vision even when local text extraction fails.
    if (!data.currentSkills && !req.file) {
      res.status(400).json({ error: "أدخل المهارات الحالية أو ارفع سيرة ذاتية لاستخراجها." });
      return;
    }

    const currentSkillNames = splitList(data.currentSkills);
    const skills = await upsertUserSkills(currentSkillNames);
    const matchedJob = await findOrCreateMatchingJob(data.jobTitle, skills.map((s) => s.id));
    const normalizedJobTitle = matchedJob.titleAr;
    const normalizedSkillNames = skills.map((s) => s.nameAr);

    const catalogCourses = await prisma.course
      .findMany({
        take: 60,
        include: {
          platform: { select: { nameAr: true } },
          skills: { include: { skill: { select: { nameAr: true } } } }
        },
        orderBy: { createdAt: "desc" }
      })
      .then((rows) =>
        rows.map((c) => ({
          titleAr: c.titleAr,
          url: c.url,
          platformAr: c.platform?.nameAr ?? null,
          isFree: c.isFree,
          durationHrs: c.durationHrs,
          level: c.level,
          skills: c.skills.map((s) => s.skill.nameAr)
        }))
      )
      .catch(() => []);

    const catalogCompanies = await prisma.company
      .findMany({ take: 30, select: { nameAr: true, industry: true } })
      .catch(() => []);

    const aiInput: AnalysisInput = {
      fullName: data.fullName,
      jobTitle: data.jobTitle,
      employer: data.employer,
      currentSkills: data.currentSkills,
      currentCourses: data.currentCourses,
      cvText,
      cvFile: req.file && (req.file.mimetype === "application/pdf" || req.file.mimetype.startsWith("image/"))
        ? { mediaType: req.file.mimetype, dataBase64: req.file.buffer.toString("base64") }
        : undefined,
      normalizedJobTitle,
      normalizedSkills: normalizedSkillNames,
      matchedJob: matchedJob
        ? {
            titleAr: matchedJob.titleAr,
            descriptionAr: matchedJob.descriptionAr,
            requiredSkills: matchedJob.skills.map((js) => ({
              nameAr: js.skill.nameAr,
              importance: js.importance
            }))
          }
        : null,
      catalogCourses,
      catalogCompanies
    };

    const { report, usage } = await analyzeWithClaude(aiInput);
    await persistReportSkills(report, matchedJob.id, matchedJob.category === "مضافة من المستخدم");

    const saved = await prisma.report.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        jobTitle: normalizedJobTitle,
        employer: data.employer || null,
        currentSkills: data.currentSkills,
        currentCourses: data.currentCourses || null,
        cvText: cvText || null,
        inputTokens: usage.inputTokens,
        outputTokens: usage.outputTokens,
        totalTokens: usage.totalTokens,
        claudeModel: usage.model,
        matchedJobId: matchedJob?.id ?? null,
        data: report as any
      } as any,
      select: { id: true }
    });

    // Fire-and-forget notifications (do not block the response on email delivery).
    void sendNewReportEmails({
      reportId: saved.id,
      fullName: data.fullName,
      jobTitle: normalizedJobTitle,
      employer: data.employer || null,
      userEmail: data.email,
      phone: data.phone,
      matchScore: report.matchScore
    });

    res.json({ id: saved.id });
  } catch (err: any) {
    console.error("[analyze] failed:", err);
    res.status(500).json({ error: err?.message || "تعذر إنشاء التقرير، حاول مرة أخرى." });
  }
});

async function upsertUserSkills(names: string[]) {
  if (!names.length) return [];

  const existing = await prisma.skill.findMany();
  const output: { id: string; nameAr: string }[] = [];

  for (const name of names) {
    const match = closest(existing, name, (s) => [s.nameAr, s.nameEn], 0.82);
    if (match) {
      output.push({ id: match.item.id, nameAr: match.item.nameAr });
      continue;
    }

    const created = await prisma.skill.upsert({
      where: { nameAr: name },
      update: {},
      create: { nameAr: name, category: "مضافة من المستخدم" }
    });
    existing.push(created);
    output.push({ id: created.id, nameAr: created.nameAr });
  }

  return output;
}

async function findOrCreateMatchingJob(title: string, skillIds: string[]) {
  const jobs = await prisma.job.findMany({
    include: { skills: { include: { skill: true } } }
  });

  const normalizedTitle = normalizeText(title);
  const match = jobs.find(
    (j) =>
      normalizeText(j.titleAr) === normalizedTitle ||
      (j.titleEn && normalizeText(j.titleEn) === normalizedTitle)
  );

  if (match) return match;

  const created = await prisma.job.create({
    data: {
      titleAr: title.trim(),
      descriptionAr: `وظيفة أضافها مستخدم أثناء إنشاء تقرير. تحتاج مراجعة وتفصيلاً من الإدارة: ${title.trim()}`,
      category: "مضافة من المستخدم",
      skills: skillIds.length
        ? { create: skillIds.slice(0, 20).map((skillId) => ({ skillId, importance: 3 })) }
        : undefined
    },
    include: { skills: { include: { skill: true } } }
  });

  return created;
}

async function persistReportSkills(
  report: Awaited<ReturnType<typeof analyzeWithClaude>>["report"],
  jobId: string,
  attachToJob: boolean
) {
  const names = [
    ...report.presentSkills.map((s) => s.name),
    ...report.partialSkills.map((s) => s.name),
    ...report.missingSkills.map((s) => s.name)
  ].filter(Boolean);

  const skills = await upsertUserSkills(names);
  if (!attachToJob || !skills.length) return;

  await prisma.jobSkill.createMany({
    data: skills.map((skill) => ({ jobId, skillId: skill.id, importance: 3 })),
    skipDuplicates: true
  });
}

type NewReportNotice = {
  reportId: string;
  fullName: string;
  jobTitle: string;
  employer: string | null;
  userEmail: string | null;
  phone: string | null;
  matchScore: number;
};

async function sendNewReportEmails(n: NewReportNotice) {
  const siteUrl = (process.env.SITE_URL || "https://masaary.com").replace(/\/$/, "");
  const reportUrl = `${siteUrl}/report/${n.reportId}`;
  const payUrl = `${siteUrl}/pay/${n.reportId}`;
  const adminTo = process.env.NOTIFY_EMAIL || process.env.SMTP_USER || "info@masaary.com";

  // 1) Admin notification
  await sendMail({
    to: adminTo,
    subject: `تقرير جديد — ${n.fullName} (${n.jobTitle})`,
    html: htmlShell(
      "تقرير جديد على منصة مساري",
      `<p>تم إنشاء تقرير جديد عبر الموقع.</p>
       <table>
         ${row("الاسم", n.fullName)}
         ${row("المسمى الوظيفي", n.jobTitle)}
         ${n.employer ? row("جهة العمل", n.employer) : ""}
         ${n.userEmail ? row("البريد الإلكتروني", n.userEmail) : ""}
         ${n.phone ? row("الجوال", n.phone) : ""}
         ${row("نسبة التطابق", `${n.matchScore}%`)}
         ${row("معرّف التقرير", n.reportId)}
       </table>
       <p style="margin-top:18px"><a class="btn" href="${reportUrl}">عرض التقرير</a></p>`
    ),
    text: `تقرير جديد لـ ${n.fullName} - ${n.jobTitle}. الرابط: ${reportUrl}`,
    replyTo: n.userEmail || undefined
  });

  // 2) User confirmation (only if email provided)
  if (n.userEmail) {
    await sendMail({
      to: n.userEmail,
      subject: "تقريرك جاهز على منصة مساري",
      html: htmlShell(
        `أهلاً ${n.fullName}`,
        `<p>تم إنشاء تقريرك المهني بنجاح على منصة مساري.</p>
         <table>
           ${row("المسمى الوظيفي", n.jobTitle)}
           ${row("نسبة التطابق", `${n.matchScore}%`)}
         </table>
         <p style="margin-top:18px"><a class="btn" href="${reportUrl}">افتح التقرير الآن</a></p>
         <p style="margin-top:18px">للحصول على نسخة PDF قابلة للتنزيل وشهادة توصية، يمكنك تفعيل النسخة الكاملة:</p>
         <p><a class="btn" href="${payUrl}">تفعيل النسخة الكاملة</a></p>`
      ),
      text: `أهلاً ${n.fullName}، تقريرك جاهز: ${reportUrl}`
    });
  }
}
