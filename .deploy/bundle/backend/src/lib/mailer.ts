import nodemailer, { type Transporter } from "nodemailer";

let cached: Transporter | null = null;

function buildTransport(): Transporter | null {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || "465");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  if (!host || !user || !pass) {
    console.warn("[mailer] SMTP not fully configured — emails disabled");
    return null;
  }
  return nodemailer.createTransport({
    host,
    port,
    secure: process.env.SMTP_SECURE !== "false" && port === 465,
    auth: { user, pass },
    pool: true,
    maxConnections: 2,
    maxMessages: 50
  });
}

export function getTransport(): Transporter | null {
  if (!cached) cached = buildTransport();
  return cached;
}

export type MailInput = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
};

export async function sendMail(input: MailInput): Promise<void> {
  const t = getTransport();
  if (!t) return;
  const from = process.env.SMTP_FROM || `مساري <${process.env.SMTP_USER}>`;
  try {
    await t.sendMail({
      from,
      to: input.to,
      subject: input.subject,
      html: input.html,
      text: input.text,
      replyTo: input.replyTo
    });
  } catch (err) {
    console.error("[mailer] send failed:", err instanceof Error ? err.message : err);
  }
}

export function htmlShell(title: string, body: string) {
  return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<title>${escapeHtml(title)}</title>
<style>
  body { font-family: -apple-system, "Segoe UI", Tahoma, Arial, sans-serif; background: #f7faf8; color: #1a1a1a; margin: 0; padding: 24px; }
  .card { max-width: 560px; margin: 0 auto; background: #fff; border-radius: 16px; padding: 28px; box-shadow: 0 2px 12px rgba(0,0,0,0.06); }
  h1 { color: #1a674b; font-size: 20px; margin: 0 0 12px; }
  .btn { display: inline-block; background: linear-gradient(to left, #1f815c, #1a674b); color: #fff !important; text-decoration: none; padding: 10px 18px; border-radius: 10px; font-weight: 600; }
  .muted { color: #6b7280; font-size: 12px; margin-top: 16px; }
  table { width: 100%; border-collapse: collapse; }
  td { padding: 8px 0; border-bottom: 1px solid #f1f5f4; font-size: 14px; }
  td.label { color: #6b7280; }
  td.value { text-align: left; font-weight: 600; }
</style>
</head>
<body>
  <div class="card">
    <h1>${escapeHtml(title)}</h1>
    ${body}
    <p class="muted">— مساري · مسارك المهني يبدأ من هنا</p>
  </div>
</body>
</html>`;
}

export function escapeHtml(s: string) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function row(label: string, value: string) {
  return `<tr><td class="label">${escapeHtml(label)}</td><td class="value">${escapeHtml(value)}</td></tr>`;
}
