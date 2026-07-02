import { createHash, timingSafeEqual } from "crypto";
import { z } from "zod";
import { signSession } from "./jwt";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

// Constant-time string comparison (hash first so lengths never leak and inputs
// of differing length still compare in constant time).
function safeEqual(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

// Lightweight in-memory brute-force throttle. Not perfect across process
// restarts / multiple workers, but meaningfully slows credential stuffing.
const MAX_ATTEMPTS = 8;
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const attempts = new Map<string, { count: number; first: number }>();

function checkThrottle(key: string): boolean {
  const now = Date.now();
  const rec = attempts.get(key);
  if (!rec || now - rec.first > WINDOW_MS) {
    attempts.set(key, { count: 1, first: now });
    return true;
  }
  rec.count += 1;
  return rec.count <= MAX_ATTEMPTS;
}

function clearThrottle(key: string) {
  attempts.delete(key);
}

export async function adminLogin(
  body: unknown,
  clientKey = "global"
): Promise<{ ok: true; token: string; email: string } | { ok: false; status: number; error: string }> {
  const parsed = LoginSchema.safeParse(body);
  if (!parsed.success) {
    return { ok: false, status: 400, error: "بيانات غير صالحة" };
  }

  if (!checkThrottle(clientKey)) {
    return { ok: false, status: 429, error: "محاولات كثيرة جداً. حاول بعد قليل." };
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) {
    return { ok: false, status: 500, error: "حساب المشرف غير مهيأ في الخادم" };
  }

  const { email, password } = parsed.data;
  const emailMatches = safeEqual(email.trim().toLowerCase(), adminEmail.trim().toLowerCase());
  const passwordMatches = safeEqual(password, adminPassword);

  if (!emailMatches || !passwordMatches) {
    return { ok: false, status: 401, error: "البريد أو كلمة المرور غير صحيحة" };
  }

  clearThrottle(clientKey);
  const token = await signSession(email);
  return { ok: true, token, email };
}
