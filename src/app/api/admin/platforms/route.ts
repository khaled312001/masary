import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminGuard";

export const runtime = "nodejs";

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

export async function POST(req: Request) {
  const guard = await requireAdmin();
  if (guard) return guard;
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });
  const created = await prisma.platform.create({ data: clean(parsed.data) });
  return NextResponse.json(created);
}
