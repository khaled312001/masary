import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";

export async function requireAdmin() {
  const session = await getCurrentAdmin();
  if (!session) {
    return NextResponse.json({ error: "غير مصرّح" }, { status: 401 });
  }
  return null;
}
