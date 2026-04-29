import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { apiServerSafe, getServerToken, TOKEN_COOKIE } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const allCookies = cookies().getAll().map((c) => ({ name: c.name, len: c.value.length }));
  const token = getServerToken();

  const stats = await apiServerSafe("/api/stats");
  const latest = await apiServerSafe("/api/reports/latest");

  return NextResponse.json({
    cookies: { all: allCookies, tokenCookieName: TOKEN_COOKIE, tokenLen: token?.length ?? null },
    stats: { ok: !stats.error, error: stats.error, dataKeys: stats.data ? Object.keys(stats.data as any) : null },
    latest: { ok: !latest.error, error: latest.error, count: Array.isArray(latest.data) ? latest.data.length : null }
  });
}
