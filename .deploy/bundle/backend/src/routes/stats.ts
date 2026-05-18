import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAdmin } from "../middleware/auth";

export const statsRouter = Router();

statsRouter.get("/", requireAdmin, async (_req, res) => {
  try {
    const [jobs, skills, courses, platforms, companies, reports] = await Promise.all([
      prisma.job.count(),
      prisma.skill.count(),
      prisma.course.count(),
      prisma.platform.count(),
      prisma.company.count(),
      prisma.report.count()
    ]);
    res.json({ jobs, skills, courses, platforms, companies, reports });
  } catch (e: any) {
    res.status(500).json({ error: e?.message ?? "تعذر جلب الإحصائيات" });
  }
});

statsRouter.get("/claude", requireAdmin, async (_req, res) => {
  try {
    const [aggregate, reports, untrackedReports] = await Promise.all([
      prisma.report.aggregate({
        _sum: {
          inputTokens: true,
          outputTokens: true,
          totalTokens: true
        },
        _avg: {
          inputTokens: true,
          outputTokens: true,
          totalTokens: true
        },
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

    res.json({
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
    res.status(500).json({ error: e?.message ?? "تعذر جلب تقارير Claude" });
  }
});
