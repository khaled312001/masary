import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-server";
import { closest, normalizeText } from "@/lib/textMatching";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Schema = z.object({
  titleAr: z.string().min(1).max(200),
  titleEn: z.string().max(200).nullable().optional(),
  descriptionAr: z.string().min(1).max(5000),
  category: z.string().max(80).nullable().optional(),
  level: z.string().max(40).nullable().optional(),
  skills: z
    .array(z.object({ skillId: z.string(), importance: z.number().int().min(1).max(5) }))
    .optional()
});

export async function GET() {
  try {
    const rows = await prisma.job.findMany({
      orderBy: { titleAr: "asc" },
      include: { skills: { include: { skill: { select: { id: true, nameAr: true } } } } }
    });
    return NextResponse.json(
      rows.map((j) => ({
        id: j.id,
        titleAr: j.titleAr,
        titleEn: j.titleEn,
        descriptionAr: j.descriptionAr,
        category: j.category,
        level: j.level,
        skills: j.skills.map((js) => ({
          skillId: js.skillId,
          nameAr: js.skill.nameAr,
          importance: js.importance
        }))
      }))
    );
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "تعذر جلب البيانات" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });

  const { skills, ...rest } = parsed.data;
  const duplicate = await findMatchingJobTitle(rest.titleAr, rest.titleEn);
  if (duplicate) {
    return NextResponse.json(
      { error: `المسمى الوظيفي موجود مسبقاً باسم: ${duplicate.titleAr}` },
      { status: 409 }
    );
  }
  try {
    const created = await prisma.job.create({
      data: {
        ...rest,
        skills: skills?.length
          ? { create: skills.map((s) => ({ skillId: s.skillId, importance: s.importance })) }
          : undefined
      } as any
    });
    return NextResponse.json(created);
  } catch {
    return NextResponse.json({ error: "تعذر الحفظ" }, { status: 400 });
  }
}

async function findMatchingJobTitle(titleAr?: string, titleEn?: string | null, exceptId?: string) {
  const names = [titleAr, titleEn].filter(Boolean).map(String);
  if (!names.length) return null;
  const rows = await prisma.job.findMany({
    where: exceptId ? { id: { not: exceptId } } : undefined
  });
  return (
    rows.find((row) =>
      names.some((name) =>
        [row.titleAr, row.titleEn]
          .filter(Boolean)
          .some((existing) => normalizeText(name) === normalizeText(String(existing)))
      )
    ) ??
    closest(rows, names[0], (row) => [row.titleAr, row.titleEn], 0.9)?.item ??
    null
  );
}
