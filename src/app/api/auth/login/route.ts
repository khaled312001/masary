import { NextResponse } from "next/server";
import { adminLogin } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const result = await adminLogin(body);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }
  return NextResponse.json({ token: result.token, admin: { email: result.email, role: "admin" } });
}
