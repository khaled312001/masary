import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Public: anyone with the link can view a report. Only expose the fields the
// public report / pay / certificate pages need — never the CV text, phone,
// or token/cost accounting fields (those stay admin-only).
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const report = await prisma.report.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      fullName: true,
      jobTitle: true,
      employer: true,
      email: true,
      isPaid: true,
      paidAt: true,
      createdAt: true,
      data: true
    }
  });
  if (!report) {
    return NextResponse.json({ error: "التقرير غير موجود" }, { status: 404 });
  }
  return NextResponse.json(report);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;
  try {
    await prisma.report.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "تعذر الحذف" }, { status: 400 });
  }
}
