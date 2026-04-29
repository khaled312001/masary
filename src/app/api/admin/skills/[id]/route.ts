import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminGuard";

export const runtime = "nodejs";

const Schema = z.object({
  nameAr: z.string().min(1).max(120).optional(),
  nameEn: z.string().max(120).nullable().optional(),
  category: z.string().max(80).nullable().optional()
});

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const guard = await requireAdmin();
  if (guard) return guard;
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });
  try {
    const updated = await prisma.skill.update({ where: { id: params.id }, data: parsed.data });
    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.code === "P2002" ? "اسم المهارة موجود مسبقاً" : "تعذر التحديث" },
      { status: 400 }
    );
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const guard = await requireAdmin();
  if (guard) return guard;
  try {
    await prisma.skill.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "تعذر الحذف" }, { status: 400 });
  }
}
