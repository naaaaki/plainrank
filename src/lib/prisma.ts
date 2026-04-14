import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

/**
 * Prisma クライアントのシングルトン（Prisma v7 + Neon アダプター）
 *
 * Prisma v7 では PrismaClient にアダプターを渡す方式に変更。
 * Vercel Postgres (Neon) に接続するため PrismaNeon アダプターを使用。
 *
 * Next.js の開発環境では HMR によりモジュールが再評価されるため、
 * グローバルオブジェクトにキャッシュして複数インスタンスの生成を防ぐ。
 */

function createPrismaClient() {
  const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL ?? "" });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });
}

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
