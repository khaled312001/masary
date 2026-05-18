import { Router } from "express";
import { prisma } from "../lib/prisma";
import { requireAdmin } from "../middleware/auth";
import { sendMail, htmlShell, row } from "../lib/mailer";

export const reportsRouter = Router();

// Admin: list all reports
reportsRouter.get("/", requireAdmin, async (_req, res) => {
  const rows = await prisma.report.findMany({
    orderBy: { createdAt: "desc" },
    take: 200
  });
  res.json(rows);
});

// Admin: latest 5 reports for dashboard
reportsRouter.get("/latest", requireAdmin, async (_req, res) => {
  const rows = await prisma.report.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { id: true, fullName: true, jobTitle: true, createdAt: true }
  });
  res.json(rows);
});

// Public: get a single report by ID (so it can be shared as a link)
reportsRouter.get("/:id", async (req, res) => {
  const report = await prisma.report.findUnique({ where: { id: req.params.id } });
  if (!report) {
    res.status(404).json({ error: "التقرير غير موجود" });
    return;
  }
  res.json(report);
});

// Admin: delete a report
reportsRouter.delete("/:id", requireAdmin, async (req, res) => {
  try {
    await prisma.report.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch {
    res.status(400).json({ error: "تعذر الحذف" });
  }
});

// Admin: mark report as paid (manual confirmation after bank transfer)
reportsRouter.post("/:id/mark-paid", requireAdmin, async (req, res) => {
  try {
    const updated = await prisma.report.update({
      where: { id: req.params.id },
      data: { isPaid: true, paidAt: new Date() }
    });

    void notifyPaymentActivated(updated);

    res.json({ ok: true, isPaid: updated.isPaid, paidAt: updated.paidAt });
  } catch {
    res.status(400).json({ error: "تعذر التعديل" });
  }
});

// Admin: revoke paid status
reportsRouter.post("/:id/mark-unpaid", requireAdmin, async (req, res) => {
  try {
    const updated = await prisma.report.update({
      where: { id: req.params.id },
      data: { isPaid: false, paidAt: null }
    });
    res.json({ ok: true, isPaid: updated.isPaid });
  } catch {
    res.status(400).json({ error: "تعذر التعديل" });
  }
});

async function notifyPaymentActivated(report: { id: string; fullName: string; jobTitle: string; email: string | null }) {
  if (!report.email) return;
  const siteUrl = (process.env.SITE_URL || "https://masaary.com").replace(/\/$/, "");
  const reportUrl = `${siteUrl}/report/${report.id}`;
  const certificateUrl = `${siteUrl}/certificate/${report.id}`;
  await sendMail({
    to: report.email,
    subject: "تم تفعيل نسختك الكاملة على مساري",
    html: htmlShell(
      `مرحباً ${report.fullName}`,
      `<p>تم تفعيل النسخة الكاملة لتقريرك بنجاح.</p>
       <table>
         ${row("المسمى الوظيفي", report.jobTitle)}
         ${row("معرّف التقرير", report.id)}
       </table>
       <p style="margin-top:18px">
         <a class="btn" href="${reportUrl}">تنزيل التقرير PDF</a>
         &nbsp;
         <a class="btn" href="${certificateUrl}">شهادة التوصية</a>
       </p>`
    ),
    text: `تم تفعيل نسختك الكاملة. التقرير: ${reportUrl}`
  });
}
