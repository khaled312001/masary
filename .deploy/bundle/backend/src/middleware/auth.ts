import type { Request, Response, NextFunction } from "express";
import { verifySession } from "../lib/jwt";

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
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
  (req as any).admin = session;
  next();
}
