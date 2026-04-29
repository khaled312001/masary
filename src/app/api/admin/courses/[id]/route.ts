import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminGuard";

export const runtime = "nodejs";

const Schema = z.object({
  titleAr: z.string().min(1).max(200).optional(),
  titleEn: z.string().max(200).nullable().optional(),
  description: z.string().max(3000).nullable().optional(),
  url: z.string().url().nullable().optional().or(z.literal("")),
  durationHrs: z.number().int().min(0).nullable().optional(),
  level: z.string().max(40).nullable().optional(),
  isFree: z.boolean().optional(),
  language: z.string().max(10).optional(),
  platformId: z.string().nullable().optional(),
  skillIds: z.array(z.string()).optional()
});

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const guard = await requireAdmin();
  if (guard) return guard;
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });
  const { skillIds, url, ...rest } = parsed.data;

  try {
    const updated = await prisma.$transaction(async (tx) => {
      const course = await tx.course.update({
        where: { id: params.id },
        data: { ...rest, url: url === "" ? null : url }
      });
      if (skillIds) {
        await tx.courseSkill.deleteMany({ where: { courseId: params.id } });
        if (skillIds.length) {
          await tx.courseSkill.createMany({
            data: skillIds.map((skillId) => ({ courseId: params.id, skillId }))
          });
        }
      }
      return course;
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
    await prisma.course.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "تعذر الحذف" }, { status: 400 });
  }
}
