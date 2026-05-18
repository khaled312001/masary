import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import { prisma } from "./lib/prisma";
import { authRouter } from "./routes/auth";
import { skillsRouter } from "./routes/skills";
import { companiesRouter } from "./routes/companies";
import { platformsRouter } from "./routes/platforms";
import { jobsRouter } from "./routes/jobs";
import { coursesRouter } from "./routes/courses";
import { reportsRouter } from "./routes/reports";
import { analyzeRouter } from "./routes/analyze";
import { statsRouter } from "./routes/stats";
import { settingsRouter } from "./routes/settings";
import { contactRouter } from "./routes/contact";

export function createApp() {
  const app = express();

  const origins = (process.env.CORS_ORIGINS || "*")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
  app.use(
    cors({
      origin: origins.includes("*") ? true : origins,
      credentials: false
    })
  );
  app.use(compression());
  app.use(express.json({ limit: "1mb" }));
  if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));

  app.get("/api/healthz", async (_req, res) => {
    const env = {
      DATABASE_URL: process.env.DATABASE_URL ? "set" : "MISSING",
      ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY ? "set" : "MISSING",
      ADMIN_EMAIL: process.env.ADMIN_EMAIL ? "set" : "MISSING",
      ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ? "set" : "MISSING",
      AUTH_SECRET: process.env.AUTH_SECRET ? `set (${process.env.AUTH_SECRET.length} chars)` : "MISSING"
    };
    let db: any = { ok: false };
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
    res.json({ env, db, time: new Date().toISOString() });
  });

  app.use("/api/auth", authRouter);
  app.use("/api/skills", skillsRouter);
  app.use("/api/companies", companiesRouter);
  app.use("/api/platforms", platformsRouter);
  app.use("/api/jobs", jobsRouter);
  app.use("/api/courses", coursesRouter);
  app.use("/api/reports", reportsRouter);
  app.use("/api/analyze", analyzeRouter);
  app.use("/api/stats", statsRouter);
  app.use("/api/settings", settingsRouter);
  app.use("/api/contact", contactRouter);

  // Note: no root route or catch-all 404 — when embedded behind Next.js the
  // unmatched requests must fall through to the Next.js handler. The standalone
  // backend entry (src/index.ts) wraps this with its own 404 handler instead.

  return app;
}

const app = createApp();
export default app;
