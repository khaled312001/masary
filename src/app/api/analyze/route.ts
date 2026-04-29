import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { analyzeWithClaude, type AnalysisInput } from "@/lib/ai";
import { requireAdmin } from "@/lib/adminGuard";

export const runtime = "nodejs";
export const maxDuration = 60;

const Schema = z.object({
  fullName: z.string().min(2).max(100),
  jobTitle: z.string().min(2).max(150),
  employer: z.string().max(150).optional(),
  currentSkills: z.string().min(2).max(2000),
  currentCourses: z.string().max(2000).optional()
});

export async function POST(req: Request) {
  const guard = await requireAdmin();
  if (guard) return guard;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "البيانات المرسلة غير صالحة" }, { status: 400 });
  }

  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "الرجاء التحقق من الحقول المطلوبة" }, { status: 400 });
  }

  const data = parsed.data;

  try {
    const matchedJob = await findMatchingJob(data.jobTitle);

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

    const report = await analyzeWithClaude(aiInput);

    const saved = await prisma.report.create({
      data: {
        fullName: data.fullName,
        jobTitle: data.jobTitle,
        employer: data.employer || null,
        currentSkills: data.currentSkills,
        currentCourses: data.currentCourses || null,
        matchedJobId: matchedJob?.id ?? null,
        data: report as any
      },
      select: { id: true }
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

async function findMatchingJob(title: string) {
  const normalized = title.trim();

  const exact = await prisma.job
    .findFirst({
      where: { titleAr: normalized },
      include: { skills: { include: { skill: true } } }
    })
    .catch(() => null);
  if (exact) return exact;

  return await prisma.job
    .findFirst({
      where: {
        OR: [
          { titleAr: { contains: normalized } },
          { titleEn: { contains: normalized } }
        ]
      },
      include: { skills: { include: { skill: true } } }
    })
    .catch(() => null);
}
