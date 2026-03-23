import { PrismaClient } from "@prisma/client";

declare global {
  var __houseconnectPrisma__: PrismaClient | undefined;
}

export const prisma =
  global.__houseconnectPrisma__ ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.__houseconnectPrisma__ = prisma;
}

export function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL);
}
