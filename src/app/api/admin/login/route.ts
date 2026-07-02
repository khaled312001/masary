import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { adminLogin } from "@/lib/admin-auth";
import { TOKEN_COOKIE } from "@/lib/auth-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const clientKey =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  const result = await adminLogin(body, clientKey);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  cookies().set(TOKEN_COOKIE, result.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });
  // Clean up legacy cookie from older deployments
  cookies().delete("masary_admin");

  return NextResponse.json({ ok: true });
}
