import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const [aggregate, reports, untrackedReports] = await Promise.all([
      prisma.report.aggregate({
        _sum: { inputTokens: true, outputTokens: true, totalTokens: true },
        _avg: { inputTokens: true, outputTokens: true, totalTokens: true },
        _count: { id: true },
        where: { totalTokens: { gt: 0 } }
      }),
      prisma.report.findMany({
        orderBy: { createdAt: "desc" },
        take: 300,
        select: {
          id: true,
          fullName: true,
          jobTitle: true,
          employer: true,
          inputTokens: true,
          outputTokens: true,
          totalTokens: true,
          claudeModel: true,
          createdAt: true
        }
      }),
      prisma.report.count({ where: { totalTokens: 0 } })
    ]);

    const totalReports = reports.length;
    const trackedReports = aggregate._count.id;

    return NextResponse.json({
      summary: {
        totalReports,
        trackedReports,
        untrackedReports,
        inputTokens: aggregate._sum.inputTokens ?? 0,
        outputTokens: aggregate._sum.outputTokens ?? 0,
        totalTokens: aggregate._sum.totalTokens ?? 0,
        averageInputTokens: Math.round(aggregate._avg.inputTokens ?? 0),
        averageOutputTokens: Math.round(aggregate._avg.outputTokens ?? 0),
        averageTotalTokens: Math.round(aggregate._avg.totalTokens ?? 0)
      },
      reports
    });
  } catch (e: any) {
    console.error("[api/stats/claude] GET failed:", e);
    return NextResponse.json({ error: "تعذر جلب تقارير Claude" }, { status: 500 });
  }
}
