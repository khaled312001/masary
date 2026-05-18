import { Router } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma";
import { requireAdmin } from "../middleware/auth";

export const coursesRouter = Router();

const Schema = z.object({
  titleAr: z.string().min(1).max(200),
  titleEn: z.string().max(200).nullable().optional(),
  description: z.string().max(3000).nullable().optional(),
  url: z.string().url().nullable().optional().or(z.literal("")),
  durationHrs: z.number().int().min(0).nullable().optional(),
  level: z.string().max(40).nullable().optional(),
  isFree: z.boolean().optional(),
  language: z.string().max(10).optional(),
  platformId: z.string().nullable().optional(),
  skillIds: z.array(z.string()).optional()
});

coursesRouter.get("/", async (_req, res) => {
  const rows = await prisma.course.findMany({
    orderBy: { titleAr: "asc" },
    include: {
      platform: { select: { id: true, nameAr: true } },
      skills: { include: { skill: { select: { id: true, nameAr: true } } } }
    }
  });
  res.json(
    rows.map((c) => ({
      id: c.id,
      titleAr: c.titleAr,
      titleEn: c.titleEn,
      description: c.description,
      url: c.url,
      durationHrs: c.durationHrs,
      level: c.level,
      isFree: c.isFree,
      language: c.language,
      platformId: c.platformId,
      platformName: c.platform?.nameAr ?? null,
      skillIds: c.skills.map((s) => s.skill.id),
      skillNames: c.skills.map((s) => s.skill.nameAr)
    }))
  );
});

coursesRouter.post("/", requireAdmin, async (req, res) => {
  const parsed = Schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "بيانات غير صالحة" });
    return;
  }
  const { skillIds, url, ...rest } = parsed.data;
  const created = await prisma.course.create({
    data: {
      ...rest,
      url: url === "" ? null : url,
      skills: skillIds?.length
        ? { create: skillIds.map((skillId) => ({ skillId })) }
        : undefined
    } as any
  });
  res.json(created);
});

coursesRouter.patch("/:id", requireAdmin, async (req, res) => {
  const parsed = Schema.partial().safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "بيانات غير صالحة" });
    return;
  }
  const { skillIds, url, ...rest } = parsed.data;
  try {
    const id = req.params.id;
    const updated = await prisma.$transaction(async (tx) => {
      const course = await tx.course.update({
        where: { id },
        data: { ...rest, url: url === "" ? null : url } as any
      });
      if (skillIds) {
        await tx.courseSkill.deleteMany({ where: { courseId: id } });
        if (skillIds.length) {
          await tx.courseSkill.createMany({
            data: skillIds.map((skillId) => ({ courseId: id, skillId }))
          });
        }
      }
      return course;
    });
    res.json(updated);
  } catch {
    res.status(400).json({ error: "تعذر التحديث" });
  }
});

coursesRouter.delete("/:id", requireAdmin, async (req, res) => {
  try {
    await prisma.course.delete({ where: { id: req.params.id } });
    res.json({ ok: true });
  } catch {
    res.status(400).json({ error: "تعذر الحذف" });
  }
});
