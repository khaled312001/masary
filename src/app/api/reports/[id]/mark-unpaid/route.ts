import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  try {
    const updated = await prisma.report.update({
      where: { id: params.id },
      data: { isPaid: false, paidAt: null }
    });
    return NextResponse.json({ ok: true, isPaid: updated.isPaid });
  } catch {
    return NextResponse.json({ error: "تعذر التعديل" }, { status: 400 });
  }
}
