import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminGuard";

export const runtime = "nodejs";

const Schema = z.object({
  titleAr: z.string().min(1).max(200),
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

export async function POST(req: Request) {
  const guard = await requireAdmin();
  if (guard) return guard;
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });
  const { skillIds, url, ...rest } = parsed.data;
  const created = await prisma.course.create({
    data: {
      ...rest,
      url: url === "" ? null : url,
      skills: skillIds?.length
        ? { create: skillIds.map((skillId) => ({ skillId })) }
        : undefined
    }
  });
  return NextResponse.json(created);
}
