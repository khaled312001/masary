import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-server";
import { closest, normalizeText } from "@/lib/textMatching";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Schema = z.object({
  nameAr: z.string().min(1).max(120),
  nameEn: z.string().max(120).nullable().optional(),
  category: z.string().max(80).nullable().optional()
});

export async function GET() {
  try {
    // Newest first — user-submitted skills surface at the top as fresh references.
    const rows = await prisma.skill.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json(rows);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "تعذر جلب المهارات" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });

  try {
    const duplicate = await findMatchingSkill(parsed.data.nameAr, parsed.data.nameEn);
    if (duplicate) {
      return NextResponse.json(
        { error: `اسم المهارة موجود مسبقاً باسم: ${duplicate.nameAr}` },
        { status: 409 }
      );
    }
    const created = await prisma.skill.create({ data: parsed.data as any });
    return NextResponse.json(created);
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.code === "P2002" ? "اسم المهارة موجود مسبقاً" : "تعذر الحفظ" },
      { status: 400 }
    );
  }
}

async function findMatchingSkill(nameAr?: string, nameEn?: string | null, exceptId?: string) {
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
