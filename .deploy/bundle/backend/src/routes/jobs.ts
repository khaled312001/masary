import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAdmin } from "../middleware/auth";
import { closest, normalizeText } from "../lib/textMatching";

export const jobsRouter = Router();

const Schema = z.object({
  titleAr: z.string().min(1).max(200),
  titleEn: z.string().max(200).nullable().optional(),
  descriptionAr: z.string().min(1).max(5000),
  category: z.string().max(80).nullable().optional(),
  level: z.string().max(40).nullable().optional(),
  skills: z
    .array(z.object({ skillId: z.string(), importance: z.number().int().min(1).max(5) }))
    .optional()
});

jobsRouter.get("/", async (_req, res) => {
  const rows = await prisma.job.findMany({
    orderBy: { titleAr: "asc" },
    include: { skills: { include: { skill: { select: { id: true, nameAr: true } } } } }
  });
  res.json(
    rows.map((j) => ({
      id: j.id,
      titleAr: j.titleAr,
      titleEn: j.titleEn,
      descriptionAr: j.descriptionAr,
      category: j.category,
      level: j.level,
      skills: j.skills.map((js) => ({
        skillId: js.skillId,
        nameAr: js.skill.nameAr,
        importance: js.importance
      }))
    }))
  );
});

jobsRouter.post("/", requireAdmin, async (req, res) => {
  const parsed = Schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "بيانات غير صالحة" });
    return;
  }
  const { skills, ...rest } = parsed.data;
  const duplicate = await findMatchingJobTitle(rest.titleAr, rest.titleEn);
  if (duplicate) {
    res.status(409).json({ error: `المسمى الوظيفي موجود مسبقاً باسم: ${duplicate.titleAr}` });
    return;
  }
  const created = await prisma.job.create({
    data: {
      ...rest,
      skills: skills?.length
        ? { create: skills.map((s) => ({ skillId: s.skillId, importance: s.importance })) }
        : undefined
    } as any
  });
  res.json(created);
});

jobsRouter.patch("/:id", requireAdmin, async (req, res) => {
  const parsed = Schema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "بيانات غير صالحة" });
    return;
  }
  const { skills, ...rest } = parsed.data;
  try {
    const id = req.params.id;
    if (rest.titleAr || rest.titleEn) {
      const duplicate = await findMatchingJobTitle(rest.titleAr, rest.titleEn, id);
      if (duplicate) {
        res.status(409).json({ error: `المسمى الوظيفي موجود مسبقاً باسم: ${duplicate.titleAr}` });
        return;
      }
    }
    const updated = await prisma.$transaction(async (tx) => {
      const job = await tx.job.update({ where: { id }, data: rest as any });
      if (skills) {
        await tx.jobSkill.deleteMany({ where: { jobId: id } });
        if (skills.length) {
          await tx.jobSkill.createMany({
            data: skills.map((s) => ({ jobId: id, skillId: s.skillId, importance: s.importance }))
          });
        }
      }
      return job;
    });
    res.json(updated);
  } catch {
    res.status(400).json({ error: "تعذر التحديث" });
  }
});

async function findMatchingJobTitle(titleAr?: string, titleEn?: string | null, exceptId?: string) {
  const names = [titleAr, titleEn].filter(Boolean).map(String);
  if (!names.length) return null;

  const rows = await prisma.job.findMany({
    where: exceptId ? { id: { not: exceptId } } : undefined
  });

  return rows.find((row) =>
    names.some((name) =>
      [row.titleAr, row.titleEn].filter(Boolean).some((existing) => normalizeText(name) === normalizeText(String(existing)))
    )
  ) ?? closest(rows, names[0], (row) => [row.titleAr, row.titleEn], 0.9)?.item ?? null;
}

jobsRouter.delete("/:id", requireAdmin, async (req, res) => {
  try {
    await prisma.job.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch {
    res.status(400).json({ error: "تعذر الحذف" });
  }
});
