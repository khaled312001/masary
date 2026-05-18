import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

export async function GET() {
  try {
    const rows = await prisma.course.findMany({
      orderBy: { titleAr: "asc" },
      include: {
        platform: { select: { id: true, nameAr: true } },
        skills: { include: { skill: { select: { id: true, nameAr: true } } } }
      }
    });
    return NextResponse.json(
      rows.map((c) => ({
        id: c.id,
        titleAr: c.titleAr,
        titleEn: c.titleEn,
        description: c.description,
        url: c.url,
        durationHrs: c.durationHrs,
        level: c.level,
        isFree: c.isFree,
        language: c.language,
        platformId: c.platformId,
        platformName: c.platform?.nameAr ?? null,
        skillIds: c.skills.map((s) => s.skill.id),
        skillNames: c.skills.map((s) => s.skill.nameAr)
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

  const { skillIds, url, ...rest } = parsed.data;
  try {
    const created = await prisma.course.create({
      data: {
        ...rest,
        url: url === "" ? null : url,
        skills: skillIds?.length
          ? { create: skillIds.map((skillId) => ({ skillId })) }
          : undefined
      } as any
    });
    return NextResponse.json(created);
  } catch {
    return NextResponse.json({ error: "تعذر الحفظ" }, { status: 400 });
  }
}
