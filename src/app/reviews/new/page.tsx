import type { Metadata } from "next";
import Link from "next/link";
import ReviewFormClient from "./ReviewFormClient";

export const metadata: Metadata = {
  title: "レビューを書く | Plainrank",
  description: "Plainrankにサービスのレビューを投稿する。",
};

export default function NewReviewPage() {
  return (
    <div className="pr-page">
      <main style={{ background: "var(--pr-bg)", minHeight: "100vh" }}>
        <div className="pr-container" style={{ paddingTop: "20px", paddingBottom: "60px", maxWidth: "640px" }}>

          {/* パンくず */}
          <nav style={{
            fontSize: ".78rem", color: "var(--pr-text-ter)",
            marginBottom: "16px", display: "flex", alignItems: "center", gap: "6px",
          }}>
            <Link href="/" className="pr-breadcrumb-link">ホーム</Link>
            <span>›</span>
            <span style={{ color: "var(--pr-text-pri)" }}>レビューを書く</span>
          </nav>

          {/* ページタイトル */}
          <div style={{ marginBottom: "20px" }}>
            <h1 style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--pr-text-pri)", letterSpacing: "-.02em", marginBottom: "6px" }}>
              レビューを書く
            </h1>
            <p style={{ fontSize: ".875rem", color: "var(--pr-text-sec)" }}>
              使った経験をもとに正直に評価してください。
            </p>
          </div>

          <ReviewFormClient />
        </div>
      </main>

      <footer className="pr-footer">
        <div className="pr-container">
          <div className="pr-footer-grid">
            <div>
              <Link href="/" className="pr-footer-logo">
                <span className="pr-logo-icon">P</span>
                Plainrank
              </Link>
              <p className="pr-footer-tagline">忖度なしの、レビューサイト。</p>
            </div>
            <div>
              <div className="pr-footer-col-title">サービス</div>
              <ul className="pr-footer-links">
                <li><Link href="/categories">カテゴリ一覧</Link></li>
                <li><Link href="/compare">ツール比較</Link></li>
                <li><Link href="/ranking">総合ランキング</Link></li>
              </ul>
            </div>
            <div>
              <div className="pr-footer-col-title">ポリシー</div>
              <ul className="pr-footer-links">
                <li><Link href="/transparency">透明性ポリシー</Link></li>
                <li><Link href="/guidelines">レビューガイドライン</Link></li>
                <li><Link href="/privacy">プライバシーポリシー</Link></li>
                <li><Link href="/terms">利用規約</Link></li>
              </ul>
            </div>
            <div>
              <div className="pr-footer-col-title">コミュニティ</div>
              <ul className="pr-footer-links">
                <li><Link href="/reviews/new">レビューを投稿</Link></li>
                <li><Link href="/about">運営チーム</Link></li>
                <li><Link href="/contact">お問い合わせ</Link></li>
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
