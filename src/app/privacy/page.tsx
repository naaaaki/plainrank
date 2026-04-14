import type { Metadata } from 'next';
import Link from 'next/link';
export const metadata: Metadata = {
  title: 'プライバシーポリシー | Plainrank',
  description: 'Plainrankのプライバシーポリシーです。収集する情報・利用目的・Cookieの取り扱いについて説明します。',
};

export default function PrivacyPage() {
  return (
    <div className="pr-page">
      <main style={{ background: 'var(--pr-bg)', minHeight: '100vh' }}>
        <div className="pr-container" style={{ paddingTop: '40px', paddingBottom: '80px', maxWidth: '760px' }}>

          {/* パンくず */}
          <nav style={{
            fontSize: '.78rem',
            color: 'var(--pr-text-ter)',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <Link href="/" className="pr-breadcrumb-link">ホーム</Link>
            <span>›</span>
            <span style={{ color: 'var(--pr-text-pri)' }}>プライバシーポリシー</span>
          </nav>

          <h1 style={{
            fontSize: '1.7rem',
            fontWeight: 700,
            color: 'var(--pr-text-pri)',
            letterSpacing: '-.03em',
            marginBottom: '8px',
          }}>
            プライバシーポリシー
          </h1>
          <p style={{ fontSize: '.85rem', color: 'var(--pr-text-ter)', marginBottom: '40px' }}>
            最終更新日：2026年4月13日
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>

            {/* 1. はじめに */}
            <section>
              <h2 style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                color: 'var(--pr-text-pri)',
                marginBottom: '12px',
                paddingBottom: '8px',
                borderBottom: '1px solid var(--pr-border)',
              }}>
                1. はじめに
              </h2>
              <p style={{ fontSize: '.9rem', color: 'var(--pr-text-sec)', lineHeight: 1.8 }}>
                Plainrank（以下「当サービス」）は、ユーザーのプライバシーを尊重し、個人情報の保護に努めます。
                本プライバシーポリシーは、当サービスが収集する情報の種類、利用目的、および管理方法について説明します。
              </p>
            </section>

            {/* 2. 収集する情報 */}
            <section>
              <h2 style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                color: 'var(--pr-text-pri)',
                marginBottom: '12px',
                paddingBottom: '8px',
                borderBottom: '1px solid var(--pr-border)',
              }}>
                2. 収集する情報
              </h2>
              <p style={{ fontSize: '.9rem', color: 'var(--pr-text-sec)', lineHeight: 1.8, marginBottom: '12px' }}>
                当サービスは以下の情報を収集する場合があります。
              </p>
              <ul style={{
                fontSize: '.9rem',
                color: 'var(--pr-text-sec)',
                lineHeight: 1.8,
                paddingLeft: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}>
                <li><strong>アカウント情報：</strong>ユーザー登録時に入力された氏名・メールアドレス</li>
                <li><strong>レビュー情報：</strong>投稿されたレビュー内容・評価スコア</li>
                <li><strong>アクセスログ：</strong>IPアドレス・ブラウザ種別・閲覧ページ・アクセス日時</li>
                <li><strong>Cookie情報：</strong>セッション管理・ユーザー設定の保持に使用するCookie</li>
              </ul>
            </section>

            {/* 3. 利用目的 */}
            <section>
              <h2 style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                color: 'var(--pr-text-pri)',
                marginBottom: '12px',
                paddingBottom: '8px',
                borderBottom: '1px solid var(--pr-border)',
              }}>
                3. 情報の利用目的
              </h2>
              <ul style={{
                fontSize: '.9rem',
                color: 'var(--pr-text-sec)',
                lineHeight: 1.8,
                paddingLeft: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}>
                <li>サービスの提供・運営・改善</li>
                <li>レビューの認証・品質管理</li>
                <li>不正利用・スパムの防止</li>
                <li>お問い合わせへの対応</li>
                <li>サービスに関する重要なお知らせの送付</li>
              </ul>
            </section>

            {/* 4. 第三者への提供 */}
            <section>
              <h2 style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                color: 'var(--pr-text-pri)',
                marginBottom: '12px',
                paddingBottom: '8px',
                borderBottom: '1px solid var(--pr-border)',
              }}>
                4. 第三者への情報提供
              </h2>
              <p style={{ fontSize: '.9rem', color: 'var(--pr-text-sec)', lineHeight: 1.8 }}>
                当サービスは、法令に基づく場合または本人の同意がある場合を除き、収集した個人情報を第三者に提供しません。
                当サービスは広告収入・スポンサー収入を得ておらず、ユーザーデータを広告目的で第三者と共有することはありません。
              </p>
            </section>

            {/* 5. Cookie */}
            <section>
              <h2 style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                color: 'var(--pr-text-pri)',
                marginBottom: '12px',
                paddingBottom: '8px',
                borderBottom: '1px solid var(--pr-border)',
              }}>
                5. Cookieについて
              </h2>
              <p style={{ fontSize: '.9rem', color: 'var(--pr-text-sec)', lineHeight: 1.8 }}>
                当サービスはセッション管理・ログイン状態の維持・ユーザー設定の保存のためにCookieを使用します。
                ブラウザの設定からCookieを無効にすることができますが、その場合一部の機能が利用できなくなる場合があります。
              </p>
            </section>

            {/* 6. お問い合わせ */}
            <section>
              <h2 style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                color: 'var(--pr-text-pri)',
                marginBottom: '12px',
                paddingBottom: '8px',
                borderBottom: '1px solid var(--pr-border)',
              }}>
                6. お問い合わせ
              </h2>
              <p style={{ fontSize: '.9rem', color: 'var(--pr-text-sec)', lineHeight: 1.8 }}>
                プライバシーに関するご質問・ご意見は、以下のメールアドレスまでお問い合わせください。
              </p>
              <p style={{ fontSize: '.9rem', color: 'var(--pr-accent)', marginTop: '8px' }}>
                contact@plainrank.io
              </p>
            </section>

          </div>
        </div>
      </main>

      {/* フッター */}
      <footer className="pr-footer">
        <div className="pr-container">
          <div className="pr-footer-grid">
            <div>
              <Link href="/" className="pr-footer-logo">
                <span className="pr-logo-icon">P</span>
                Plainrank
              </Link>
              <p className="pr-footer-tagline">
                忖度なしの、レビューサイト。
              </p>
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
