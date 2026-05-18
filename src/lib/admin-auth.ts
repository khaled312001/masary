import { z } from "zod";
import { signSession } from "./jwt";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export async function adminLogin(
  body: unknown
): Promise<{ ok: true; token: string; email: string } | { ok: false; status: number; error: string }> {
  const parsed = LoginSchema.safeParse(body);
  if (!parsed.success) {
    return { ok: false, status: 400, error: "بيانات غير صالحة" };
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) {
    return { ok: false, status: 500, error: "حساب المشرف غير مهيأ في الخادم" };
  }

  const { email, password } = parsed.data;
  const matches =
    email.trim().toLowerCase() === adminEmail.trim().toLowerCase() &&
    password === adminPassword;

  if (!matches) {
    return { ok: false, status: 401, error: "البريد أو كلمة المرور غير صحيحة" };
  }

  const token = await signSession(email);
  return { ok: true, token, email };
}
