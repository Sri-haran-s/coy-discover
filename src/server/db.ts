import { PrismaClient } from "@prisma/client";

// Single PrismaClient instance. In dev, Next.js hot-reloads modules, so we
// stash the client on globalThis to avoid opening a new connection per reload.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
