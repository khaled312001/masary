import { NextResponse } from "next/server";
import { z } from "zod";
import { setSessionCookie, signSession } from "@/lib/auth";

export const runtime = "nodejs";

const Schema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = Schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "بيانات غير صالحة" }, { status: 400 });
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) {
    return NextResponse.json(
      { error: "حساب المشرف غير مهيأ في الخادم" },
      { status: 500 }
    );
  }

  const { email, password } = parsed.data;
  const ok =
    email.trim().toLowerCase() === adminEmail.trim().toLowerCase() &&
    password === adminPassword;
  if (!ok) {
    return NextResponse.json({ error: "البريد أو كلمة المرور غير صحيحة" }, { status: 401 });
  }

  const token = await signSession(email);
  await setSessionCookie(token);
  return NextResponse.json({ ok: true });
}
