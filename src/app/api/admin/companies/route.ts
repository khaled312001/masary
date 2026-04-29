import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminGuard";

export const runtime = "nodejs";

const Schema = z.object({
  nameAr: z.string().min(1).max(150),
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

export async function POST(req: Request) {
  const guard = await requireAdmin();
  if (guard) return guard;
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });
  const created = await prisma.company.create({ data: clean(parsed.data) });
  return NextResponse.json(created);
}
