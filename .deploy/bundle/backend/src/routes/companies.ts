import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAdmin } from "../middleware/auth";

export const companiesRouter = Router();

const Schema = z.object({
  nameAr: z.string().min(1).max(150),
  nameEn: z.string().max(150).nullable().optional(),
  industry: z.string().max(80).nullable().optional(),
  website: z.string().url().nullable().optional().or(z.literal("")),
  logoUrl: z.string().url().nullable().optional().or(z.literal("")),
  description: z.string().max(2000).nullable().optional()
});

function clean(d: any) {
  if (d.website === "") d.website = null;
  if (d.logoUrl === "") d.logoUrl = null;
  return d;
}

companiesRouter.get("/", async (_req, res) => {
  const rows = await prisma.company.findMany({ orderBy: { nameAr: "asc" } });
  res.json(rows);
});

companiesRouter.post("/", requireAdmin, async (req, res) => {
  const parsed = Schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "بيانات غير صالحة" });
    return;
  }
  const created = await prisma.company.create({ data: clean(parsed.data) as any });
  res.json(created);
});

companiesRouter.patch("/:id", requireAdmin, async (req, res) => {
  const parsed = Schema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "بيانات غير صالحة" });
    return;
  }
  try {
    const updated = await prisma.company.update({
      where: { id: req.params.id },
      data: clean(parsed.data) as any
    });
    res.json(updated);
  } catch {
    res.status(400).json({ error: "تعذر التحديث" });
  }
});

companiesRouter.delete("/:id", requireAdmin, async (req, res) => {
  try {
    await prisma.company.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch {
    res.status(400).json({ error: "تعذر الحذف" });
  }
});
