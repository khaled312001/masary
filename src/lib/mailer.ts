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

// --- branded HTML templates ---

const SITE_URL = (process.env.SITE_URL || "https://masaary.com").replace(/\/$/, "");

const LOGO_SVG_DATA_URI =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 64 64" fill="none">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#2fa172"/>
      <stop offset="100%" stop-color="#1a674b"/>
    </linearGradient>
  </defs>
  <rect x="2" y="2" width="60" height="60" rx="14" fill="url(#g)"/>
  <path d="M14 44 L14 26 L24 36 L32 18 L40 36 L50 26 L50 44"
        stroke="#ffffff" stroke-width="4" stroke-linecap="round"
        stroke-linejoin="round" fill="none"/>
  <circle cx="50" cy="26" r="4" fill="#ffffff"/>
</svg>
`);

export function htmlShell(title: string, body: string, opts?: { footer?: string }) {
  const footer =
    opts?.footer ??
    `هذه الرسالة أُرسلت من <a href="${SITE_URL}" style="color:#1a674b;text-decoration:none;font-weight:600">${stripScheme(SITE_URL)}</a>. للتواصل: <a href="mailto:info@masaary.com" style="color:#1a674b;text-decoration:none">info@masaary.com</a>`;

  return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:#f0f4f1;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Tahoma','Helvetica Neue',Arial,sans-serif;color:#17533d;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f0f4f1;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;width:100%;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(20,84,60,0.08);">
        <tr>
          <td style="background:linear-gradient(135deg,#1a674b 0%,#134434 100%);padding:28px 32px;color:#ffffff;text-align:right;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
              <tr>
                <td style="vertical-align:middle;">
                  <div style="display:inline-block;vertical-align:middle;">
                    <img src="${LOGO_SVG_DATA_URI}" alt="مساري" width="48" height="48" style="display:block;border-radius:12px;"/>
                  </div>
                  <div style="display:inline-block;vertical-align:middle;margin-right:12px;">
                    <div style="font-size:22px;font-weight:800;letter-spacing:-0.5px;">مساري</div>
                    <div style="font-size:11px;opacity:0.8;margin-top:2px;letter-spacing:1px;">MASAARY · مسارك المهني</div>
                  </div>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:32px;">
            <h1 style="font-size:20px;font-weight:800;color:#134434;margin:0 0 16px;">${escapeHtml(title)}</h1>
            <div style="color:#1a3a2c;font-size:15px;line-height:1.75;">
              ${body}
            </div>
          </td>
        </tr>
        <tr>
          <td style="background:#f7faf8;padding:20px 32px;border-top:1px solid #e6efea;color:#6b7c75;font-size:12px;text-align:center;line-height:1.6;">
            ${footer}
          </td>
        </tr>
      </table>
      <div style="margin-top:16px;color:#a3afa9;font-size:11px;">
        © ${new Date().getFullYear()} مساري — جميع الحقوق محفوظة
      </div>
    </td></tr>
  </table>
</body>
</html>`;
}

export function btn(href: string, label: string, opts?: { variant?: "primary" | "gold" }) {
  const palette =
    opts?.variant === "gold"
      ? { from: "#d99c20", to: "#955718" }
      : { from: "#1f815c", to: "#1a674b" };
  return `<a href="${href}" style="display:inline-block;background:linear-gradient(to left,${palette.from},${palette.to});color:#ffffff;text-decoration:none;font-weight:700;padding:12px 22px;border-radius:12px;font-size:14px;margin:4px 4px 4px 0;">${escapeHtml(label)}</a>`;
}

export function infoTable(rows: [string, string][]) {
  const body = rows
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:10px 0;border-bottom:1px solid #f0f4f1;color:#6b7c75;font-size:13px;width:35%;">${escapeHtml(label)}</td>
        <td style="padding:10px 0;border-bottom:1px solid #f0f4f1;color:#134434;font-weight:600;font-size:14px;text-align:left;">${escapeHtml(value)}</td>
      </tr>`
    )
    .join("");
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="border-collapse:collapse;margin:8px 0;">${body}</table>`;
}

export function escapeHtml(s: string) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function stripScheme(url: string) {
  return url.replace(/^https?:\/\//, "");
}
