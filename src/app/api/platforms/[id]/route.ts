import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Schema = z
  .object({
    nameAr: z.string().min(1).max(120),
    nameEn: z.string().max(120).nullable().optional(),
    website: z.string().url().nullable().optional().or(z.literal("")),
    logoUrl: z.string().url().nullable().optional().or(z.literal(""))
  })
  .partial();

function clean(d: any) {
  if (d.website === "") d.website = null;
  if (d.logoUrl === "") d.logoUrl = null;
  return d;
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });

  try {
    const updated = await prisma.platform.update({
      where: { id: params.id },
      data: clean(parsed.data) as any
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "تعذر التحديث" }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  try {
    await prisma.platform.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "تعذر الحذف" }, { status: 400 });
  }
}
