import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import Header from "@/components/layout/Header";
import ServiceSubmitForm from "@/components/service/ServiceSubmitForm";

export const metadata: Metadata = {
  title: "サービスを登録する | Plainrank",
  description:
    "Plainrankに新しいSaaS・AIツールを登録する。登録したサービスは審査後に公開されます。",
};

/**
 * サービス投稿ページ（サーバーコンポーネント）
 *
 * - 未ログインの場合はサインインページへリダイレクト
 * - カテゴリ一覧をサーバー側で取得し、フォームに渡す
 */
export default async function SubmitPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true },
  });

  return (
    <div className="pr-page">
      <Header />
      <main style={{ background: "var(--pr-bg)", minHeight: "100vh" }}>
        <div
          className="pr-container"
          style={{ paddingTop: "20px", paddingBottom: "60px", maxWidth: "640px" }}
        >
          {/* パンくず */}
          <nav
            style={{
              fontSize: ".78rem",
              color: "var(--pr-text-ter)",
              marginBottom: "16px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <a href="/" className="pr-breadcrumb-link">
              ホーム
            </a>
            <span>›</span>
            <span style={{ color: "var(--pr-text-pri)" }}>サービスを登録する</span>
          </nav>

          {/* ページタイトル */}
          <div style={{ marginBottom: "20px" }}>
            <h1
              style={{
                fontSize: "1.3rem",
                fontWeight: 700,
                color: "var(--pr-text-pri)",
                letterSpacing: "-.02em",
                marginBottom: "6px",
              }}
            >
              サービスを登録する
            </h1>
            <p style={{ fontSize: ".875rem", color: "var(--pr-text-sec)", lineHeight: 1.6 }}>
              まだPlainrankに掲載されていないサービスを登録できます。
              登録後は審査が入り、承認されると公開されます。
            </p>
          </div>

          <ServiceSubmitForm categories={categories} />
        </div>
      </main>

      <footer className="pr-footer">
        <div className="pr-container">
          <div className="pr-footer-grid">
            <div>
              <a href="/" className="pr-footer-logo">
                <span className="pr-logo-icon">P</span>
                Plainrank
              </a>
              <p className="pr-footer-tagline">忖度なしの、レビューサイト。</p>
            </div>
            <div>
              <div className="pr-footer-col-title">サービス</div>
              <ul className="pr-footer-links">
                <li><a href="/categories">カテゴリ一覧</a></li>
                <li><a href="/compare">ツール比較</a></li>
                <li><a href="/ranking">総合ランキング</a></li>
              </ul>
            </div>
            <div>
              <div className="pr-footer-col-title">ポリシー</div>
              <ul className="pr-footer-links">
                <li><a href="/transparency">透明性ポリシー</a></li>
                <li><a href="/guidelines">レビューガイドライン</a></li>
                <li><a href="/privacy">プライバシーポリシー</a></li>
                <li><a href="/terms">利用規約</a></li>
              </ul>
            </div>
            <div>
              <div className="pr-footer-col-title">コミュニティ</div>
              <ul className="pr-footer-links">
                <li><a href="/reviews/new">レビューを投稿</a></li>
                <li><a href="/about">運営チーム</a></li>
                <li><a href="/contact">お問い合わせ</a></li>
              </ul>
            </div>
          </div>
          <div className="pr-footer-bottom">
            <span className="pr-footer-copy">© 2026 Plainrank</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
