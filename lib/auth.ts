import "server-only";

import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

import { demoUsers } from "@/lib/data/demo";
import { getUserByEmail } from "@/lib/repository";
import type { DemoSession, Role } from "@/lib/types";

const SESSION_COOKIE = "houseconnect_session";
const DEMO_PASSWORD = "SecurePass123!";

function getSecret() {
  return process.env.SESSION_SECRET || "houseconnect-local-secret";
}

function encode(value: object) {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function decode<T>(value: string) {
  return JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as T;
}

function sign(value: string) {
  return createHmac("sha256", getSecret()).update(value).digest("base64url");
}

export function createSessionToken(session: DemoSession) {
  const payload = encode(session);
  return `${payload}.${sign(payload)}`;
}

export function readSessionToken(token: string): DemoSession | null {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) {
    return null;
  }

  const expected = sign(payload);
  const actual = Buffer.from(signature);
  const compare = Buffer.from(expected);

  if (actual.length !== compare.length || !timingSafeEqual(actual, compare)) {
    return null;
  }

  try {
    return decode<DemoSession>(payload);
  } catch {
    return null;
  }
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, storedPassword: string) {
  const [salt, savedHash] = storedPassword.split(":");
  if (!salt || !savedHash) {
    return false;
  }

  const computed = scryptSync(password, salt, 64);
  const saved = Buffer.from(savedHash, "hex");
  return saved.length === computed.length && timingSafeEqual(saved, computed);
}

const demoCredentialHashes = new Map(
  demoUsers.map((user) => [user.email.toLowerCase(), hashPassword(DEMO_PASSWORD)]),
);

export function authenticateDemoUser(email: string, password: string) {
  const user = getUserByEmail(email);
  if (!user) {
    return null;
  }

  const storedPassword = demoCredentialHashes.get(email.toLowerCase());
  if (!storedPassword || !verifyPassword(password, storedPassword)) {
    return null;
  }

  return {
    userId: user.id,
    role: user.role as Exclude<Role, "guest">,
    email: user.email,
    fullName: user.fullName,
    issuedAt: Date.now(),
  } satisfies DemoSession;
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  return token ? readSessionToken(token) : null;
}

export async function requireSession() {
  const session = await getSession();
  if (!session) {
    redirect("/auth/sign-in?next=/dashboard");
  }

  return session;
}

export async function requireRole(roles: Array<Exclude<Role, "guest">>) {
  const session = await requireSession();
  if (!roles.includes(session.role)) {
    redirect("/dashboard");
  }

  return session;
}

export function sessionResponse(
  session: DemoSession,
  body: Record<string, unknown>,
  init?: ResponseInit,
) {
  const response = NextResponse.json(body, init);
  response.cookies.set({
    name: SESSION_COOKIE,
    value: createSessionToken(session),
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
  });
  return response;
}

export function clearSessionResponse() {
  const response = NextResponse.json({ success: true });
  response.cookies.set({
    name: SESSION_COOKIE,
    value: "",
    path: "/",
    maxAge: 0,
  });
  return response;
}
