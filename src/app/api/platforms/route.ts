import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Schema = z.object({
  nameAr: z.string().min(1).max(120),
  nameEn: z.string().max(120).nullable().optional(),
  website: z.string().url().nullable().optional().or(z.literal("")),
  logoUrl: z.string().url().nullable().optional().or(z.literal(""))
});

function clean(d: any) {
  if (d.website === "") d.website = null;
  if (d.logoUrl === "") d.logoUrl = null;
  return d;
}

export async function GET() {
  try {
    const rows = await prisma.platform.findMany({ orderBy: { nameAr: "asc" } });
    return NextResponse.json(rows);
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

  try {
    const created = await prisma.platform.create({ data: clean(parsed.data) as any });
    return NextResponse.json(created);
  } catch {
    return NextResponse.json({ error: "تعذر الحفظ" }, { status: 400 });
  }
}
