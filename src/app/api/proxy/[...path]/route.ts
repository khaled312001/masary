import { NextResponse } from "next/server";
import { apiFetch, getServerToken } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function proxy(req: Request, params: { path: string[] }, method: string) {
  const path = "/" + params.path.join("/");
  const url = new URL(req.url);
  const queryString = url.search;
  const token = getServerToken();
  const contentType = req.headers.get("content-type");

  let body: any = undefined;
  const headers: Record<string, string> = {};
  if (method !== "GET" && method !== "DELETE") {
    if (contentType?.includes("multipart/form-data")) {
      body = Buffer.from(await req.arrayBuffer());
      headers["Content-Type"] = contentType;
    } else {
      body = await req.text();
    }
  }

  try {
    const data = await apiFetch(path + queryString, {
      method,
      token,
      headers,
      ...(body !== undefined ? { body } : {})
    });
    return NextResponse.json(data);
  } catch (e: any) {
    const status = /HTTP (\d+)/.exec(e.message)?.[1];
    return NextResponse.json(
      { error: e.message },
      { status: status ? Number(status) : 500 }
    );
  }
}

export async function GET(req: Request, { params }: { params: { path: string[] } }) {
  return proxy(req, params, "GET");
}
export async function POST(req: Request, { params }: { params: { path: string[] } }) {
  return proxy(req, params, "POST");
}
export async function PATCH(req: Request, { params }: { params: { path: string[] } }) {
  return proxy(req, params, "PATCH");
}
export async function DELETE(req: Request, { params }: { params: { path: string[] } }) {
  return proxy(req, params, "DELETE");
}
