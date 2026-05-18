import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { sendMail, htmlShell, row } from "../lib/mailer";

export const contactRouter = Router();

// Generic contact form / payment confirmation submission from the public site.
// Stores nothing — just emails the admin and (optionally) acknowledges the sender.
const Schema = z.object({
  name: z.string().min(2).max(150),
  email: z.string().email().max(180).optional().or(z.literal("")),
  phone: z.string().max(40).optional().or(z.literal("")),
  message: z.string().min(2).max(4000),
  topic: z.enum(["contact", "payment-receipt"]).optional(),
  reportId: z.string().max(80).optional()
});

contactRouter.post("/", async (req, res) => {
  const parsed = Schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "تأكد من تعبئة الحقول المطلوبة." });
  }
  const data = parsed.data;
  const adminTo = process.env.NOTIFY_EMAIL || process.env.SMTP_USER || "info@masaary.com";
  const siteUrl = (process.env.SITE_URL || "https://masaary.com").replace(/\/$/, "");

  let reportContext = "";
  if (data.reportId) {
    const r = await prisma.report.findUnique({
      where: { id: data.reportId },
      select: { id: true, fullName: true, jobTitle: true, email: true, isPaid: true }
    }).catch(() => null);
    if (r) {
      reportContext = `<table>
        ${row("معرّف التقرير", r.id)}
        ${row("اسم العميل", r.fullName)}
        ${row("الوظيفة", r.jobTitle)}
        ${row("الحالة", r.isPaid ? "مدفوع" : "في انتظار التفعيل")}
      </table><p style="margin:8px 0"><a href="${siteUrl}/report/${r.id}">عرض التقرير</a></p>`;
    }
  }

  const subjectPrefix = data.topic === "payment-receipt" ? "إيصال دفع" : "رسالة من الموقع";
  const heading = data.topic === "payment-receipt" ? "إيصال دفع جديد" : "رسالة جديدة من الموقع";

  await sendMail({
    to: adminTo,
    subject: `${subjectPrefix} — ${data.name}`,
    html: htmlShell(
      heading,
      `<table>
         ${row("الاسم", data.name)}
         ${data.email ? row("البريد الإلكتروني", data.email) : ""}
         ${data.phone ? row("الجوال", data.phone) : ""}
       </table>
       ${reportContext}
       <p style="margin-top:12px"><strong>الرسالة:</strong></p>
       <p style="white-space:pre-wrap;background:#f7faf8;padding:12px;border-radius:10px">${escape(data.message)}</p>`
    ),
    text: `${heading}\n\n${data.name} <${data.email || ""}> ${data.phone || ""}\n\n${data.message}`,
    replyTo: data.email || undefined
  });

  // Acknowledge the sender if they gave an email.
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
      text: data.topic === "payment-receipt"
        ? "استلمنا إيصال الدفع وسنفعّل تقريرك قريباً."
        : "استلمنا رسالتك وسنرد عليك قريباً."
    });
  }

  res.json({ ok: true });
});

function escape(s: string) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
