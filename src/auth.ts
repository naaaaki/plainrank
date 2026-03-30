import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

/**
 * Auth.js (NextAuth v5) の設定
 * GitHub / Google OAuth を使ったソーシャルログインを提供する。
 * セッション戦略は "database" を使用し、Prisma経由でVercel Postgresに保存する。
 */
export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    /**
     * セッションオブジェクトにユーザーIDを付与する。
     * クライアント側で session.user.id が参照できるようになる。
     */
    session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
  },
});
