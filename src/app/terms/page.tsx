import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/Header';

export const metadata: Metadata = {
  title: '利用規約 | Plainrank',
  description: 'Plainrankの利用規約です。サービスのご利用にあたってのルール・禁止事項・免責事項を定めています。',
};

export default function TermsPage() {
  return (
    <div className="pr-page">
      <Header />

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
            <span style={{ color: 'var(--pr-text-pri)' }}>利用規約</span>
          </nav>

          <h1 style={{
            fontSize: '1.7rem',
            fontWeight: 700,
            color: 'var(--pr-text-pri)',
            letterSpacing: '-.03em',
            marginBottom: '8px',
          }}>
            利用規約
          </h1>
          <p style={{ fontSize: '.85rem', color: 'var(--pr-text-ter)', marginBottom: '40px' }}>
            最終更新日：2026年4月13日
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>

            {/* 1. サービス概要 */}
            <section>
              <h2 style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                color: 'var(--pr-text-pri)',
                marginBottom: '12px',
                paddingBottom: '8px',
                borderBottom: '1px solid var(--pr-border)',
              }}>
                1. サービス概要
              </h2>
              <p style={{ fontSize: '.9rem', color: 'var(--pr-text-sec)', lineHeight: 1.8 }}>
                Plainrank（以下「当サービス」）は、SaaS・AIツールに関する正直なレビューを収集・公開する独立評価サービスです。
                当サービスは広告収入・スポンサー収入を受け取らず、中立的な立場でレビューを提供します。
                本利用規約（以下「本規約」）は、当サービスを利用するすべてのユーザーに適用されます。
              </p>
            </section>

            {/* 2. 利用条件 */}
            <section>
              <h2 style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                color: 'var(--pr-text-pri)',
                marginBottom: '12px',
                paddingBottom: '8px',
                borderBottom: '1px solid var(--pr-border)',
              }}>
                2. 利用条件
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
                <li>13歳以上であること</li>
                <li>本規約に同意した上でサービスを利用すること</li>
                <li>正確かつ誠実な情報を提供すること</li>
                <li>アカウントの管理責任はユーザー本人が負うこと</li>
              </ul>
            </section>

            {/* 3. 禁止事項 */}
            <section>
              <h2 style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                color: 'var(--pr-text-pri)',
                marginBottom: '12px',
                paddingBottom: '8px',
                borderBottom: '1px solid var(--pr-border)',
              }}>
                3. 禁止事項
              </h2>
              <p style={{ fontSize: '.9rem', color: 'var(--pr-text-sec)', lineHeight: 1.8, marginBottom: '12px' }}>
                以下の行為は禁止します。違反した場合、アカウントを停止または削除することがあります。
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
                <li><strong>虚偽レビューの投稿：</strong>実際に使用していないサービスへのレビュー、事実と異なる評価</li>
                <li><strong>スパム行為：</strong>同一内容の大量投稿、無関係なリンクの埋め込み</li>
                <li><strong>なりすまし：</strong>他人のアカウントを使用すること、または他人を装うこと</li>
                <li><strong>競合妨害：</strong>競合サービスへの組織的な低評価レビュー</li>
                <li><strong>誹謗中傷：</strong>特定の個人・企業への根拠のない中傷</li>
                <li><strong>不正アクセス：</strong>当サービスのシステムへの不正なアクセスや改ざん</li>
                <li><strong>法令違反：</strong>著作権侵害、個人情報の無断掲載など</li>
              </ul>
            </section>

            {/* 4. コンテンツの権利 */}
            <section>
              <h2 style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                color: 'var(--pr-text-pri)',
                marginBottom: '12px',
                paddingBottom: '8px',
                borderBottom: '1px solid var(--pr-border)',
              }}>
                4. 投稿コンテンツの権利
              </h2>
              <p style={{ fontSize: '.9rem', color: 'var(--pr-text-sec)', lineHeight: 1.8 }}>
                ユーザーが投稿したレビューの著作権はユーザーに帰属しますが、当サービスに対してサービスの運営・改善・プロモーションに必要な範囲で利用する非独占的なライセンスを付与するものとします。
                投稿したレビューは当サービスが品質基準に基づき非表示・削除する場合があります。
              </p>
            </section>

            {/* 5. 免責事項 */}
            <section>
              <h2 style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                color: 'var(--pr-text-pri)',
                marginBottom: '12px',
                paddingBottom: '8px',
                borderBottom: '1px solid var(--pr-border)',
              }}>
                5. 免責事項
              </h2>
              <p style={{ fontSize: '.9rem', color: 'var(--pr-text-sec)', lineHeight: 1.8 }}>
                当サービスに掲載されているレビュー・評価は、各ユーザーの個人的な意見です。
                当サービスはレビュー内容の正確性・完全性を保証するものではなく、掲載情報に基づく意思決定によって生じた損害について責任を負いません。
                当サービスは予告なくサービス内容を変更・停止することがあります。
              </p>
            </section>

            {/* 6. 規約の変更 */}
            <section>
              <h2 style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                color: 'var(--pr-text-pri)',
                marginBottom: '12px',
                paddingBottom: '8px',
                borderBottom: '1px solid var(--pr-border)',
              }}>
                6. 規約の変更
              </h2>
              <p style={{ fontSize: '.9rem', color: 'var(--pr-text-sec)', lineHeight: 1.8 }}>
                本規約は必要に応じて改定することがあります。重要な変更がある場合はサービス上で通知します。
                改定後もサービスを継続して利用した場合、改定後の規約に同意したものとみなします。
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
