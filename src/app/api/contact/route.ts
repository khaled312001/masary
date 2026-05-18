import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { sendMail, htmlShell, infoTable, escapeHtml } from "@/lib/mailer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Schema = z.object({
  name: z.string().min(2).max(150),
  email: z.string().email().max(180).optional().or(z.literal("")),
  phone: z.string().max(40).optional().or(z.literal("")),
  message: z.string().min(2).max(4000),
  topic: z.enum(["contact", "payment-receipt"]).optional(),
  reportId: z.string().max(80).optional()
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "تأكد من تعبئة الحقول المطلوبة." }, { status: 400 });
  }
  const data = parsed.data;
  const adminTo = process.env.NOTIFY_EMAIL || process.env.SMTP_USER || "info@masaary.com";
  const siteUrl = (process.env.SITE_URL || "https://masaary.com").replace(/\/$/, "");

  const detailRows: [string, string][] = [["الاسم", data.name]];
  if (data.email) detailRows.push(["البريد الإلكتروني", data.email]);
  if (data.phone) detailRows.push(["الجوال", data.phone]);

  let reportContext = "";
  if (data.reportId) {
    const r = await prisma.report
      .findUnique({
        where: { id: data.reportId },
        select: { id: true, fullName: true, jobTitle: true, email: true, isPaid: true }
      })
      .catch(() => null);
    if (r) {
      const rows: [string, string][] = [
        ["معرّف التقرير", r.id],
        ["اسم العميل", r.fullName],
        ["الوظيفة", r.jobTitle],
        ["الحالة", r.isPaid ? "مدفوع" : "في انتظار التفعيل"]
      ];
      reportContext = `${infoTable(rows)}<p style="margin:8px 0"><a href="${siteUrl}/report/${r.id}">عرض التقرير</a></p>`;
    }
  }

  const subjectPrefix = data.topic === "payment-receipt" ? "إيصال دفع" : "رسالة من الموقع";
  const heading = data.topic === "payment-receipt" ? "إيصال دفع جديد" : "رسالة جديدة من الموقع";

  await sendMail({
    to: adminTo,
    subject: `${subjectPrefix} — ${data.name}`,
    html: htmlShell(
      heading,
      `${infoTable(detailRows)}
       ${reportContext}
       <p style="margin-top:18px"><strong>الرسالة:</strong></p>
       <p style="white-space:pre-wrap;background:#f7faf8;padding:14px;border-radius:10px;border:1px solid #e6efea;">${escapeHtml(data.message)}</p>`
    ),
    text: `${heading}\n\n${data.name} <${data.email || ""}> ${data.phone || ""}\n\n${data.message}`,
    replyTo: data.email || undefined
  });

  if (data.email) {
    await sendMail({
      to: data.email,
      subject: data.topic === "payment-receipt" ? "استلمنا إيصالك" : "استلمنا رسالتك",
      html: htmlShell(
        `أهلاً ${data.name}`,
        data.topic === "payment-receipt"
          ? `<p>استلمنا إيصال الدفع وسنفعّل تقريرك خلال 30 دقيقة في أيام العمل.</p>
             <p>عند التفعيل ستصلك رسالة تأكيد على نفس البريد.</p>`
          : `<p>استلمنا رسالتك وسنرد عليك في أقرب وقت ممكن.</p>`
      ),
      text:
        data.topic === "payment-receipt"
          ? "استلمنا إيصال الدفع وسنفعّل تقريرك قريباً."
          : "استلمنا رسالتك وسنرد عليك قريباً."
    });
  }

  return NextResponse.json({ ok: true });
}
