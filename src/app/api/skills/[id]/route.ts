import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-server";
import { closest, normalizeText } from "@/lib/textMatching";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Schema = z
  .object({
    nameAr: z.string().min(1).max(120),
    nameEn: z.string().max(120).nullable().optional(),
    category: z.string().max(80).nullable().optional()
  })
  .partial();

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });

  try {
    if (parsed.data.nameAr || parsed.data.nameEn) {
      const duplicate = await findMatchingSkill(parsed.data.nameAr, parsed.data.nameEn, params.id);
      if (duplicate) {
        return NextResponse.json(
          { error: `اسم المهارة موجود مسبقاً باسم: ${duplicate.nameAr}` },
          { status: 409 }
        );
      }
    }
    const updated = await prisma.skill.update({
      where: { id: params.id },
      data: parsed.data as any
    });
    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.code === "P2002" ? "اسم المهارة موجود مسبقاً" : "تعذر التحديث" },
      { status: 400 }
    );
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    await prisma.skill.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "تعذر الحذف" }, { status: 400 });
  }
}

async function findMatchingSkill(nameAr?: string | null, nameEn?: string | null, exceptId?: string) {
  const names = [nameAr, nameEn].filter(Boolean).map(String);
  if (!names.length) return null;
  const rows = await prisma.skill.findMany({ where: exceptId ? { id: { not: exceptId } } : undefined });
  return (
    rows.find((row) =>
      names.some((name) =>
        [row.nameAr, row.nameEn]
          .filter(Boolean)
          .some((existing) => normalizeText(name) === normalizeText(String(existing)))
      )
    ) ??
    closest(rows, names[0], (row) => [row.nameAr, row.nameEn], 0.9)?.item ??
    null
  );
}
