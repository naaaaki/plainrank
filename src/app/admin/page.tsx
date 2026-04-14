import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Header from "@/components/layout/Header";
import PendingServiceList from "@/components/service/PendingServiceList";

export const metadata: Metadata = {
  title: "管理画面 | Plainrank",
};

/**
 * 管理者メールアドレス。環境変数 ADMIN_EMAIL で管理する。
 */
function isAdmin(email: string | null | undefined): boolean {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail || !email) return false;
  return email === adminEmail;
}

/**
 * 管理画面トップ（サーバーコンポーネント）
 *
 * - 未ログイン → サインインページへリダイレクト
 * - 管理者以外 → 403ページ
 * - PENDING サービス一覧を表示
 */
export default async function AdminPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  if (!isAdmin(session.user.email)) {
    return (
      <div className="pr-page">
        <Header />
        <main style={{ background: "var(--pr-bg)", minHeight: "100vh" }}>
          <div
            className="pr-container"
            style={{ paddingTop: "60px", paddingBottom: "60px", textAlign: "center" }}
          >
            <h1
              style={{
                fontSize: "1.3rem",
                fontWeight: 700,
                color: "var(--pr-text-pri)",
                marginBottom: "12px",
              }}
            >
              アクセス権限がありません
            </h1>
            <p style={{ fontSize: ".875rem", color: "var(--pr-text-sec)" }}>
              このページは管理者のみアクセスできます。
            </p>
          </div>
        </main>
      </div>
    );
  }

  // PENDING サービスを投稿者情報付きで取得
  const pendingServices = await prisma.service.findMany({
    where: { status: "PENDING" },
    orderBy: { createdAt: "asc" },
    include: {
      category: { select: { name: true, slug: true } },
      submittedBy: { select: { id: true, name: true, email: true } },
    },
  });

  return (
    <div className="pr-page">
      <Header />
      <main style={{ background: "var(--pr-bg)", minHeight: "100vh" }}>
        <div
          className="pr-container"
          style={{ paddingTop: "20px", paddingBottom: "60px" }}
        >
          {/* ページヘッダー */}
          <div style={{ marginBottom: "24px" }}>
            <h1
              style={{
                fontSize: "1.3rem",
                fontWeight: 700,
                color: "var(--pr-text-pri)",
                letterSpacing: "-.02em",
                marginBottom: "6px",
              }}
            >
              管理画面
            </h1>
            <p style={{ fontSize: ".875rem", color: "var(--pr-text-sec)" }}>
              ユーザーから投稿されたサービスの審査・承認を行います。
            </p>
          </div>

          {/* 統計バー */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginBottom: "24px",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                background: "var(--pr-surface)",
                border: "1px solid var(--pr-border)",
                borderRadius: "10px",
                padding: "12px 20px",
                minWidth: "140px",
              }}
            >
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: pendingServices.length > 0 ? "#d97706" : "var(--pr-text-pri)",
                  lineHeight: 1,
                  marginBottom: "4px",
                }}
              >
                {pendingServices.length}
              </div>
              <div style={{ fontSize: ".75rem", color: "var(--pr-text-ter)" }}>
                審査待ちサービス
              </div>
            </div>
          </div>

          {/* PENDING サービス一覧 */}
          <section>
            <h2
              style={{
                fontSize: ".95rem",
                fontWeight: 600,
                color: "var(--pr-text-pri)",
                marginBottom: "12px",
              }}
            >
              審査待ちサービス
            </h2>

            {pendingServices.length === 0 ? (
              <div
                style={{
                  background: "var(--pr-surface)",
                  border: "1px solid var(--pr-border)",
                  borderRadius: "12px",
                  padding: "40px 20px",
                  textAlign: "center",
                  color: "var(--pr-text-ter)",
                }}
              >
                <p style={{ fontSize: ".9rem" }}>審査待ちのサービスはありません</p>
              </div>
            ) : (
              <PendingServiceList services={pendingServices} />
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
