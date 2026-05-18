import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAdmin } from "../middleware/auth";
import { closest, normalizeText } from "../lib/textMatching";

export const skillsRouter = Router();

const Schema = z.object({
  nameAr: z.string().min(1).max(120),
  nameEn: z.string().max(120).nullable().optional(),
  category: z.string().max(80).nullable().optional()
});

skillsRouter.get("/", async (_req, res) => {
  const rows = await prisma.skill.findMany({ orderBy: { nameAr: "asc" } });
  res.json(rows);
});

skillsRouter.post("/", requireAdmin, async (req, res) => {
  const parsed = Schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "بيانات غير صالحة" });
    return;
  }
  try {
    const duplicate = await findMatchingSkill(parsed.data.nameAr, parsed.data.nameEn);
    if (duplicate) {
      res.status(409).json({ error: `اسم المهارة موجود مسبقاً باسم: ${duplicate.nameAr}` });
      return;
    }
    const created = await prisma.skill.create({ data: parsed.data as any });
    res.json(created);
  } catch (e: any) {
    res.status(400).json({
      error: e?.code === "P2002" ? "اسم المهارة موجود مسبقاً" : "تعذر الحفظ"
    });
  }
});

skillsRouter.patch("/:id", requireAdmin, async (req, res) => {
  const parsed = Schema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "بيانات غير صالحة" });
    return;
  }
  try {
    if (parsed.data.nameAr || parsed.data.nameEn) {
      const duplicate = await findMatchingSkill(parsed.data.nameAr, parsed.data.nameEn, req.params.id);
      if (duplicate) {
        res.status(409).json({ error: `اسم المهارة موجود مسبقاً باسم: ${duplicate.nameAr}` });
        return;
      }
    }
    const updated = await prisma.skill.update({
      where: { id: req.params.id },
      data: parsed.data as any
    });
    res.json(updated);
  } catch (e: any) {
    res.status(400).json({
      error: e?.code === "P2002" ? "اسم المهارة موجود مسبقاً" : "تعذر التحديث"
    });
  }
});

async function findMatchingSkill(nameAr?: string, nameEn?: string | null, exceptId?: string) {
  const names = [nameAr, nameEn].filter(Boolean).map(String);
  if (!names.length) return null;

  const rows = await prisma.skill.findMany({
    where: exceptId ? { id: { not: exceptId } } : undefined
  });

  return rows.find((row) =>
    names.some((name) =>
      [row.nameAr, row.nameEn].filter(Boolean).some((existing) => normalizeText(name) === normalizeText(String(existing)))
    )
  ) ?? closest(rows, names[0], (row) => [row.nameAr, row.nameEn], 0.9)?.item ?? null;
}

skillsRouter.delete("/:id", requireAdmin, async (req, res) => {
  try {
    await prisma.skill.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch {
    res.status(400).json({ error: "تعذر الحذف" });
  }
});
