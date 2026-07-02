import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Public health check — intentionally minimal. Do NOT disclose which secrets
// are configured, secret lengths, or data volumes here.
export async function GET() {
  let dbOk = false;
  try {
    await prisma.$queryRaw`SELECT 1`;
    dbOk = true;
  } catch (e) {
    console.error("[healthz] db check failed:", e);
  }
  return NextResponse.json(
    { ok: dbOk, db: dbOk ? "up" : "down", time: new Date().toISOString() },
    { status: dbOk ? 200 : 503 }
  );
}
