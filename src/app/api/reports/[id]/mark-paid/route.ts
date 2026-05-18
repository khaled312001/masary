import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-server";
import { sendMail, htmlShell, btn, infoTable } from "@/lib/mailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  try {
    const updated = await prisma.report.update({
      where: { id: params.id },
      data: { isPaid: true, paidAt: new Date() }
    });

    void notifyPaymentActivated(updated);
    return NextResponse.json({ ok: true, isPaid: updated.isPaid, paidAt: updated.paidAt });
  } catch {
    return NextResponse.json({ error: "تعذر التعديل" }, { status: 400 });
  }
}

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
      `<p>تم تفعيل النسخة الكاملة لتقريرك بنجاح. يمكنك الآن:</p>
       ${infoTable([
         ["المسمى الوظيفي", report.jobTitle],
         ["معرّف التقرير", report.id]
       ])}
       <p style="margin:24px 0 0;">
         ${btn(reportUrl, "تنزيل التقرير PDF")}
         ${btn(certificateUrl, "شهادة التوصية", { variant: "gold" })}
       </p>`
    ),
    text: `تم تفعيل نسختك الكاملة. التقرير: ${reportUrl}`
  });
}
