import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { checkSecretPassword, signSecretSession, SECRET_COOKIE } from "@/lib/secret-auth";
import { rateLimit, clientIp } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Schema = z.object({ password: z.string().min(1).max(200) });

export async function POST(req: Request) {
  const rl = rateLimit(`secret-login:${clientIp(req)}`, 8, 10 * 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "محاولات كثيرة جداً. حاول بعد قليل." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec) } }
    );
  }

  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });
  }

  if (!process.env.SECRET_PAGE_PASSWORD) {
    return NextResponse.json({ error: "الصفحة غير مهيأة على الخادم" }, { status: 500 });
  }

  if (!checkSecretPassword(parsed.data.password)) {
    return NextResponse.json({ error: "كلمة المرور غير صحيحة" }, { status: 401 });
  }

  const token = await signSecretSession();
  cookies().set(SECRET_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  });
  return NextResponse.json({ ok: true });
}
