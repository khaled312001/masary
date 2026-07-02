import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const [jobs, skills, courses, platforms, companies, reports] = await Promise.all([
      prisma.job.count(),
      prisma.skill.count(),
      prisma.course.count(),
      prisma.platform.count(),
      prisma.company.count(),
      prisma.report.count()
    ]);
    return NextResponse.json({ jobs, skills, courses, platforms, companies, reports });
  } catch (e: any) {
    console.error("[api/stats] GET failed:", e);
    return NextResponse.json({ error: "تعذر جلب الإحصائيات" }, { status: 500 });
  }
}
