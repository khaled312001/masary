import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const rows = await prisma.report.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    // Only the columns the admin table renders — avoid shipping cvText /
    // currentSkills / currentCourses / the full data JSON to the list view.
    select: {
      id: true,
      fullName: true,
      jobTitle: true,
      employer: true,
      email: true,
      phone: true,
      inputTokens: true,
      outputTokens: true,
      totalTokens: true,
      claudeModel: true,
      isPaid: true,
      paidAt: true,
      createdAt: true
    }
  });
  return NextResponse.json(rows);
}
