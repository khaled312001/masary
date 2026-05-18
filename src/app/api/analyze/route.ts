import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { analyzeWithClaude, type AnalysisInput } from "@/lib/ai";
import { ACCEPTED_CV_MIME, MAX_CV_BYTES, extractCvText } from "@/lib/cvExtract";
import { closest, normalizeText, splitList } from "@/lib/textMatching";
import { sendMail, htmlShell, btn, infoTable } from "@/lib/mailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const Schema = z.object({
  fullName: z.string().min(2).max(100),
  email: z.string().email().max(180).optional().or(z.literal("")),
  phone: z.string().max(40).optional().or(z.literal("")),
  jobTitle: z.string().min(2).max(150),
  employer: z.string().max(150).optional(),
  currentSkills: z.string().max(2000).optional(),
  currentCourses: z.string().max(2000).optional()
});

export async function POST(req: Request) {
  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "تعذر قراءة النموذج." }, { status: 400 });
  }

  const cvEntry = form.get("cv");
  const cvFile = cvEntry instanceof File && cvEntry.size > 0 ? cvEntry : null;

  if (cvFile) {
    if (!ACCEPTED_CV_MIME.includes(cvFile.type)) {
      return NextResponse.json(
        { error: "نوع الملف غير مدعوم. ارفع PDF أو Word أو صورة." },
        { status: 400 }
      );
    }
    if (cvFile.size > MAX_CV_BYTES) {
      return NextResponse.json(
        { error: "حجم الملف يتجاوز الحد الأقصى (12 ميجابايت)." },
        { status: 413 }
      );
    }
  }

  const fields: Record<string, string> = {};
  for (const [k, v] of form.entries()) {
    if (k === "cv") continue;
    if (typeof v === "string") fields[k] = v;
  }

  const parsed = Schema.safeParse(fields);
  if (!parsed.success) {
    return NextResponse.json({ error: "الرجاء التحقق من الحقول المطلوبة" }, { status: 400 });
  }

  try {
    const cvText = await extractCvText(cvFile);
    const data = {
      ...parsed.data,
      email: (parsed.data.email || "").trim() || null,
      phone: (parsed.data.phone || "").trim() || null,
      currentSkills: (parsed.data.currentSkills || "").trim(),
      currentCourses: (parsed.data.currentCourses || "").trim()
    };

    if (!data.currentSkills && !cvFile) {
      return NextResponse.json(
        { error: "أدخل المهارات الحالية أو ارفع سيرة ذاتية لاستخراجها." },
        { status: 400 }
      );
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

    const cvBase64 =
      cvFile && (cvFile.type === "application/pdf" || cvFile.type.startsWith("image/"))
        ? Buffer.from(await cvFile.arrayBuffer()).toString("base64")
        : null;

    const aiInput: AnalysisInput = {
      fullName: data.fullName,
      jobTitle: data.jobTitle,
      employer: data.employer,
      currentSkills: data.currentSkills,
      currentCourses: data.currentCourses,
      cvText,
      cvFile: cvBase64 ? { mediaType: cvFile!.type, dataBase64: cvBase64 } : undefined,
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

    void sendNewReportEmails({
      reportId: saved.id,
      fullName: data.fullName,
      jobTitle: normalizedJobTitle,
      employer: data.employer || null,
      userEmail: data.email,
      phone: data.phone,
      matchScore: report.matchScore
    });

    return NextResponse.json({ id: saved.id });
  } catch (err: any) {
    console.error("[analyze] failed:", err);
    return NextResponse.json(
      { error: err?.message || "تعذر إنشاء التقرير، حاول مرة أخرى." },
      { status: 500 }
    );
  }
}

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

  const adminRows: [string, string][] = [
    ["الاسم", n.fullName],
    ["المسمى الوظيفي", n.jobTitle]
  ];
  if (n.employer) adminRows.push(["جهة العمل", n.employer]);
  if (n.userEmail) adminRows.push(["البريد الإلكتروني", n.userEmail]);
  if (n.phone) adminRows.push(["الجوال", n.phone]);
  adminRows.push(["نسبة التطابق", `${n.matchScore}%`]);
  adminRows.push(["معرّف التقرير", n.reportId]);

  await sendMail({
    to: adminTo,
    subject: `تقرير جديد — ${n.fullName} · ${n.jobTitle}`,
    html: htmlShell(
      "تقرير جديد على منصة مساري",
      `<p style="margin:0 0 16px;">تم إنشاء تقرير جديد على الموقع. التفاصيل:</p>
       ${infoTable(adminRows)}
       <p style="margin:24px 0 0;">${btn(reportUrl, "عرض التقرير")}</p>`
    ),
    text: `تقرير جديد: ${n.fullName} - ${n.jobTitle} (${n.matchScore}%). الرابط: ${reportUrl}`,
    replyTo: n.userEmail || undefined
  });

  if (n.userEmail) {
    await sendMail({
      to: n.userEmail,
      subject: "تقريرك المهني جاهز على مساري",
      html: htmlShell(
        `مرحباً ${n.fullName} 👋`,
        `<p style="margin:0 0 12px;font-size:16px;">تم إنشاء تقريرك المهني بنجاح. ها هو ملخّص سريع:</p>
         ${infoTable([
           ["المسمى الوظيفي", n.jobTitle],
           ["نسبة التطابق مع متطلبات الوظيفة", `${n.matchScore}%`]
         ])}
         <p style="margin:24px 0 8px;">افتح التقرير الكامل واطّلع على مسار التعلّم المخصّص لك:</p>
         <p style="margin:0 0 20px;">${btn(reportUrl, "افتح تقريري")}</p>
         <div style="background:#fdf9ed;border:1px solid #faf0cc;border-radius:12px;padding:18px;margin:16px 0;">
           <strong style="color:#955718;display:block;margin-bottom:8px;">✨ النسخة الكاملة</strong>
           <p style="margin:0 0 12px;font-size:14px;color:#67381b;">احصل على تقرير PDF قابل للطباعة + شهادة توصية معتمدة بـ ٥٠ ريال فقط (دفعة واحدة).</p>
           ${btn(payUrl, "فعّل النسخة الكاملة", { variant: "gold" })}
         </div>`
      ),
      text: `أهلاً ${n.fullName}، تقريرك جاهز: ${reportUrl}\nلتفعيل النسخة الكاملة: ${payUrl}`
    });
  }
}
