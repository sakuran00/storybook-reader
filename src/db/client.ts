/**
 * Prisma Client インスタンス
 *
 * このファイルの目的：
 * - データベース接続を1つだけ作成し、アプリ全体で共有する
 * - 開発中のHot Reloadで接続が増えないようにする
 *
 * 使い方：
 * import { prisma } from "@/db/client"
 * const users = await prisma.user.findMany()
 */

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// グローバル領域にprismaインスタンスを保存する場所を確保
// 変数作成：「globalForPrisma」　これはアプリ全体で共有できる場所（globalThis）で、その中には prisma という名前で、PrismaClientインスタンスか、またはまだ何もない（undefined）状態のものが入る
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

// デバッグ用
console.log(
  "DEBUG: DATABASE_URL is",
  process.env.DATABASE_URL ? "defined" : "undefined",
);

// 既存のインスタンスがあれば再利用、なければ新規作成
export const prisma = globalForPrisma.prisma || new PrismaClient({ adapter });

// 開発環境のみグローバルに保存（Hot Reload対策）
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
