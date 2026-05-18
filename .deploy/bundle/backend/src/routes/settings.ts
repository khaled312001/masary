import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAdmin } from "../middleware/auth";

export const settingsRouter = Router();

const ALLOWED_KEYS = ["ANTHROPIC_API_KEY"] as const;
type AllowedKey = (typeof ALLOWED_KEYS)[number];

function isAllowed(k: string): k is AllowedKey {
  return (ALLOWED_KEYS as readonly string[]).includes(k);
}

function maskSecret(value: string) {
  if (value.length <= 8) return "•".repeat(value.length);
  return `${value.slice(0, 6)}…${value.slice(-4)}`;
}

// GET /api/settings — list all (masked)
settingsRouter.get("/", requireAdmin, async (_req, res) => {
  const rows = await prisma.setting.findMany();
  const map: Record<string, { configured: boolean; preview: string | null; updatedAt: string | null }> = {};
  for (const k of ALLOWED_KEYS) {
    const found = rows.find((r) => r.key === k);
    map[k] = found
      ? {
          configured: true,
          preview: maskSecret(found.value),
          updatedAt: found.updatedAt.toISOString()
        }
      : {
          configured: !!process.env[k],
          preview: process.env[k] ? maskSecret(process.env[k] as string) + " (env)" : null,
          updatedAt: null
        };
  }
  res.json(map);
});

// PUT /api/settings/:key — set a value
const PutSchema = z.object({ value: z.string().min(1).max(2000) });

settingsRouter.put("/:key", requireAdmin, async (req, res) => {
  const key = req.params.key as string;
  if (!isAllowed(key)) {
    res.status(400).json({ error: "مفتاح غير مدعوم" });
    return;
  }
  const parsed = PutSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "القيمة غير صالحة" });
    return;
  }

  const value = parsed.data.value.trim();
  await prisma.setting.upsert({
    where: { key },
    update: { value },
    create: { key, value }
  });
  res.json({ ok: true, key, preview: maskSecret(value) });
});

// DELETE /api/settings/:key — remove
settingsRouter.delete("/:key", requireAdmin, async (req, res) => {
  const key = req.params.key as string;
  if (!isAllowed(key)) {
    res.status(400).json({ error: "مفتاح غير مدعوم" });
    return;
  }
  try {
    await prisma.setting.delete({ where: { key } });
  } catch {
    /* ignore not-found */
  }
  res.json({ ok: true });
});

// Helper used by analyze: get setting (DB first, then env)
export async function getSettingValue(key: AllowedKey): Promise<string | null> {
  try {
    const found = await prisma.setting.findUnique({ where: { key } });
    if (found?.value) return found.value;
  } catch {
    /* ignore */
  }
  return process.env[key] || null;
}
