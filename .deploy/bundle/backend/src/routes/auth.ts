import { Router } from "express";
import { z } from "zod";
import { signSession, verifySession } from "../lib/jwt";

export const authRouter = Router();

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

authRouter.post("/login", async (req, res) => {
  const parsed = LoginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "بيانات غير صالحة" });
    return;
  }

  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminEmail || !adminPassword) {
    res.status(500).json({ error: "حساب المشرف غير مهيأ في الخادم" });
    return;
  }

  const { email, password } = parsed.data;
  const ok =
    email.trim().toLowerCase() === adminEmail.trim().toLowerCase() &&
    password === adminPassword;

  if (!ok) {
    res.status(401).json({ error: "البريد أو كلمة المرور غير صحيحة" });
    return;
  }

  const token = await signSession(email);
  res.json({ token, admin: { email, role: "admin" } });
});

authRouter.get("/me", async (req, res) => {
  const auth = req.headers.authorization;
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : undefined;
  if (!token) {
    res.status(401).json({ error: "غير مصرّح" });
    return;
  }
  const session = await verifySession(token);
  if (!session) {
    res.status(401).json({ error: "جلسة غير صالحة" });
    return;
  }
  res.json({ admin: { email: session.email, role: session.role } });
});
