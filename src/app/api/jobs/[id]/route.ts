import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-server";
import { closest, normalizeText } from "@/lib/textMatching";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Schema = z
  .object({
    titleAr: z.string().min(1).max(200),
    titleEn: z.string().max(200).nullable().optional(),
    descriptionAr: z.string().min(1).max(5000),
    category: z.string().max(80).nullable().optional(),
    level: z.string().max(40).nullable().optional(),
    skills: z
      .array(z.object({ skillId: z.string(), importance: z.number().int().min(1).max(5) }))
      .optional()
  })
  .partial();

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });

  const { skills, ...rest } = parsed.data;
  if (rest.titleAr || rest.titleEn) {
    const duplicate = await findMatchingJobTitle(rest.titleAr, rest.titleEn, params.id);
    if (duplicate) {
      return NextResponse.json(
        { error: `المسمى الوظيفي موجود مسبقاً باسم: ${duplicate.titleAr}` },
        { status: 409 }
      );
    }
  }
  try {
    const updated = await prisma.$transaction(async (tx) => {
      const job = await tx.job.update({ where: { id: params.id }, data: rest as any });
      if (skills) {
        await tx.jobSkill.deleteMany({ where: { jobId: params.id } });
        if (skills.length) {
          await tx.jobSkill.createMany({
            data: skills.map((s) => ({ jobId: params.id, skillId: s.skillId, importance: s.importance }))
          });
        }
      }
      return job;
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "تعذر التحديث" }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  try {
    await prisma.job.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "تعذر الحذف" }, { status: 400 });
  }
}

async function findMatchingJobTitle(titleAr?: string | null, titleEn?: string | null, exceptId?: string) {
  const names = [titleAr, titleEn].filter(Boolean).map(String);
  if (!names.length) return null;
  const rows = await prisma.job.findMany({ where: exceptId ? { id: { not: exceptId } } : undefined });
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
