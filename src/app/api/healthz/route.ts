import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const env = {
    DATABASE_URL: process.env.DATABASE_URL ? "set" : "MISSING",
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY ? "set" : "MISSING",
    ADMIN_EMAIL: process.env.ADMIN_EMAIL ? "set" : "MISSING",
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ? "set" : "MISSING",
    AUTH_SECRET: process.env.AUTH_SECRET ? `set (${process.env.AUTH_SECRET.length} chars)` : "MISSING"
  };

  let db: { ok: boolean; error?: string; counts?: Record<string, number> } = { ok: false };
  try {
    const [skills, jobs, courses, reports] = await Promise.all([
      prisma.skill.count(),
      prisma.job.count(),
      prisma.course.count(),
      prisma.report.count()
    ]);
    db = { ok: true, counts: { skills, jobs, courses, reports } };
  } catch (e: any) {
    db = { ok: false, error: e?.message ?? String(e) };
  }

  return NextResponse.json({ env, db, time: new Date().toISOString() });
}
