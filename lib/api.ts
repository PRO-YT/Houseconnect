import type { NextRequest } from "next/server";

export function getRequestKey(request: NextRequest, suffix: string) {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded?.split(",")[0]?.trim() || "local";
  return `${suffix}:${ip}`;
}

export async function readJson<T>(request: NextRequest) {
  return (await request.json()) as T;
}
