import { PrismaClient } from "@prisma/client";

/**
 * Prisma クライアントのシングルトン
 *
 * Next.js の開発環境では HMR によりモジュールが再評価されるため、
 * グローバルオブジェクトにキャッシュして複数インスタンスの生成を防ぐ。
 *
 * 使用前に .env.local に DATABASE_URL を設定してください。
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
