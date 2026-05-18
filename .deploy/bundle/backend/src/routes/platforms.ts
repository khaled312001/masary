import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAdmin } from "../middleware/auth";

export const platformsRouter = Router();

const Schema = z.object({
  nameAr: z.string().min(1).max(120),
  nameEn: z.string().max(120).nullable().optional(),
  website: z.string().url().nullable().optional().or(z.literal("")),
  logoUrl: z.string().url().nullable().optional().or(z.literal(""))
});

function clean(d: any) {
  if (d.website === "") d.website = null;
  if (d.logoUrl === "") d.logoUrl = null;
  return d;
}

platformsRouter.get("/", async (_req, res) => {
  const rows = await prisma.platform.findMany({ orderBy: { nameAr: "asc" } });
  res.json(rows);
});

platformsRouter.post("/", requireAdmin, async (req, res) => {
  const parsed = Schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "بيانات غير صالحة" });
    return;
  }
  const created = await prisma.platform.create({ data: clean(parsed.data) as any });
  res.json(created);
});

platformsRouter.patch("/:id", requireAdmin, async (req, res) => {
  const parsed = Schema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "بيانات غير صالحة" });
    return;
  }
  try {
    const updated = await prisma.platform.update({
      where: { id: req.params.id },
      data: clean(parsed.data) as any
    });
    res.json(updated);
  } catch {
    res.status(400).json({ error: "تعذر التحديث" });
  }
});

platformsRouter.delete("/:id", requireAdmin, async (req, res) => {
  try {
    await prisma.platform.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch {
    res.status(400).json({ error: "تعذر الحذف" });
  }
});
