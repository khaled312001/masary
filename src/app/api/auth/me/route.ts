import { NextResponse } from "next/server";
import { verifySession } from "@/lib/jwt";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : undefined;
  if (!token) {
    return NextResponse.json({ error: "غير مصرّح" }, { status: 401 });
  }
  const session = await verifySession(token);
  if (!session) {
    return NextResponse.json({ error: "جلسة غير صالحة" }, { status: 401 });
  }
  return NextResponse.json({ admin: { email: session.email, role: session.role } });
}
