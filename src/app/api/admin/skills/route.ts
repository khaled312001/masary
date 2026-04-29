import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminGuard";

export const runtime = "nodejs";

const Schema = z.object({
  nameAr: z.string().min(1).max(120),
  nameEn: z.string().max(120).nullable().optional(),
  category: z.string().max(80).nullable().optional()
});

export async function POST(req: Request) {
  const guard = await requireAdmin();
  if (guard) return guard;
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });
  try {
    const created = await prisma.skill.create({ data: parsed.data });
    return NextResponse.json(created);
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.code === "P2002" ? "اسم المهارة موجود مسبقاً" : "تعذر الحفظ" },
      { status: 400 }
    );
  }
}
