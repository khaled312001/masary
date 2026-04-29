import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminGuard";

export const runtime = "nodejs";

const Schema = z.object({
  nameAr: z.string().min(1).max(150).optional(),
  nameEn: z.string().max(150).nullable().optional(),
  industry: z.string().max(80).nullable().optional(),
  website: z.string().url().nullable().optional().or(z.literal("")),
  logoUrl: z.string().url().nullable().optional().or(z.literal("")),
  description: z.string().max(2000).nullable().optional()
});

function clean(d: any) {
  if (d.website === "") d.website = null;
  if (d.logoUrl === "") d.logoUrl = null;
  return d;
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const guard = await requireAdmin();
  if (guard) return guard;
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });
  try {
    const updated = await prisma.company.update({ where: { id: params.id }, data: clean(parsed.data) });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json({ error: "تعذر التحديث" }, { status: 400 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const guard = await requireAdmin();
  if (guard) return guard;
  try {
    await prisma.company.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "تعذر الحذف" }, { status: 400 });
  }
}
