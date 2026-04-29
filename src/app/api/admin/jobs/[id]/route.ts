import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminGuard";

export const runtime = "nodejs";

const Schema = z.object({
  titleAr: z.string().min(1).max(200).optional(),
  titleEn: z.string().max(200).nullable().optional(),
  descriptionAr: z.string().min(1).max(5000).optional(),
  category: z.string().max(80).nullable().optional(),
  level: z.string().max(40).nullable().optional(),
  skills: z
    .array(z.object({ skillId: z.string(), importance: z.number().int().min(1).max(5) }))
    .optional()
});

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const guard = await requireAdmin();
  if (guard) return guard;
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });
  const { skills, ...rest } = parsed.data;
  try {
    const updated = await prisma.$transaction(async (tx) => {
      const job = await tx.job.update({ where: { id: params.id }, data: rest });
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
  const guard = await requireAdmin();
  if (guard) return guard;
  try {
    await prisma.job.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "تعذر الحذف" }, { status: 400 });
  }
}
