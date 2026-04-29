import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminGuard";

export const runtime = "nodejs";

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

export async function POST(req: Request) {
  const guard = await requireAdmin();
  if (guard) return guard;
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });
  const { skills, ...rest } = parsed.data;
  const created = await prisma.job.create({
    data: {
      ...rest,
      skills: skills?.length
        ? { create: skills.map((s) => ({ skillId: s.skillId, importance: s.importance })) }
        : undefined
    }
  });
  return NextResponse.json(created);
}
