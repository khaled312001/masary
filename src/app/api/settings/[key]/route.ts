import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-server";
import { isAllowedSettingKey, maskSecret } from "@/lib/settings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PutSchema = z.object({ value: z.string().min(1).max(2000) });

export async function PUT(req: Request, { params }: { params: { key: string } }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  if (!isAllowedSettingKey(params.key)) {
    return NextResponse.json({ error: "مفتاح غير مدعوم" }, { status: 400 });
  }
  const body = await req.json().catch(() => null);
  const parsed = PutSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "القيمة غير صالحة" }, { status: 400 });

  const value = parsed.data.value.trim();
  await prisma.setting.upsert({
    where: { key: params.key },
    update: { value },
    create: { key: params.key, value }
  });
  return NextResponse.json({ ok: true, key: params.key, preview: maskSecret(value) });
}

export async function DELETE(_req: Request, { params }: { params: { key: string } }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  if (!isAllowedSettingKey(params.key)) {
    return NextResponse.json({ error: "مفتاح غير مدعوم" }, { status: 400 });
  }
  try {
    await prisma.setting.delete({ where: { key: params.key } });
  } catch {
    /* ignore not-found */
  }
  return NextResponse.json({ ok: true });
}
