import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const unauthorized = await requireAdmin();
  if (unauthorized) return unauthorized;

  const rows = await prisma.report.findMany({
    orderBy: { createdAt: "desc" },
    take: 200
  });
  return NextResponse.json(rows);
}
