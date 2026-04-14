import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/Header';

export const metadata: Metadata = {
  title: 'レビューガイドライン | Plainrank',
  description: 'Plainrankのレビューガイドラインです。良いレビューの書き方・禁止事項・審査方針を説明します。',
};

export default function GuidelinesPage() {
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
            <span style={{ color: 'var(--pr-text-pri)' }}>レビューガイドライン</span>
          </nav>

          <h1 style={{
            fontSize: '1.7rem',
            fontWeight: 700,
            color: 'var(--pr-text-pri)',
            letterSpacing: '-.03em',
            marginBottom: '8px',
          }}>
            レビューガイドライン
          </h1>
          <p style={{ fontSize: '.85rem', color: 'var(--pr-text-ter)', marginBottom: '40px' }}>
            最終更新日：2026年4月13日
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>

            {/* ガイドラインの目的 */}
            <section style={{
              background: 'var(--pr-accent-dim)',
              border: '1px solid var(--pr-accent)',
              borderRadius: '12px',
              padding: '20px 24px',
            }}>
              <p style={{ fontSize: '.9rem', color: 'var(--pr-text-sec)', lineHeight: 1.8, margin: 0 }}>
                Plainrankは「本音のレビューだけが集まる場所」を目指しています。
                このガイドラインは、すべてのユーザーが信頼できるレビューを書き・読めるよう、
                コミュニティの品質を守るためのルールです。
              </p>
            </section>

            {/* 1. 良いレビューとは */}
            <section>
              <h2 style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                color: 'var(--pr-text-pri)',
                marginBottom: '12px',
                paddingBottom: '8px',
                borderBottom: '1px solid var(--pr-border)',
              }}>
                1. 良いレビューの書き方
              </h2>
              <p style={{ fontSize: '.9rem', color: 'var(--pr-text-sec)', lineHeight: 1.8, marginBottom: '12px' }}>
                質の高いレビューには以下の要素が含まれています。
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { icon: '✓', title: '実際の使用経験に基づく', desc: '実際にツールを使った上での具体的な体験を書いてください。' },
                  { icon: '✓', title: '具体的な内容', desc: '「良かった」だけでなく、どの機能が・どんな場面で・どのように役立ったかを具体的に記述してください。' },
                  { icon: '✓', title: '長所と短所の両方', desc: 'どんなツールにも長所・短所があります。バランスのとれた評価が次のユーザーの参考になります。' },
                  { icon: '✓', title: '誰が・どんな用途で使ったか', desc: '個人/チーム、業種、使用期間など、文脈を添えると読み手の参考になります。' },
                ].map((item, i) => (
                  <div key={i} style={{
                    display: 'flex',
                    gap: '12px',
                    background: 'var(--pr-surface)',
                    border: '1px solid var(--pr-border)',
                    borderRadius: '8px',
                    padding: '14px 16px',
                  }}>
                    <span style={{ color: 'var(--pr-accent)', fontWeight: 700, flexShrink: 0 }}>{item.icon}</span>
                    <div>
                      <div style={{ fontSize: '.88rem', fontWeight: 600, color: 'var(--pr-text-pri)', marginBottom: '4px' }}>{item.title}</div>
                      <div style={{ fontSize: '.83rem', color: 'var(--pr-text-sec)', lineHeight: 1.7 }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* 2. 禁止事項 */}
            <section>
              <h2 style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                color: 'var(--pr-text-pri)',
                marginBottom: '12px',
                paddingBottom: '8px',
                borderBottom: '1px solid var(--pr-border)',
              }}>
                2. 禁止事項
              </h2>
              <p style={{ fontSize: '.9rem', color: 'var(--pr-text-sec)', lineHeight: 1.8, marginBottom: '12px' }}>
                以下のレビューは審査で削除・非表示となります。
              </p>
              <ul style={{
                fontSize: '.9rem',
                color: 'var(--pr-text-sec)',
                lineHeight: 1.8,
                paddingLeft: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}>
                <li><strong>虚偽レビュー：</strong>実際に使用していないサービスへのレビュー</li>
                <li><strong>サクラレビュー：</strong>報酬・依頼・強制を伴う評価</li>
                <li><strong>競合妨害：</strong>競合サービスへの組織的な低評価</li>
                <li><strong>スパム・宣伝：</strong>製品・サービスの宣伝を目的とした投稿</li>
                <li><strong>誹謗中傷：</strong>特定の個人・企業への根拠のない中傷</li>
                <li><strong>個人情報の掲載：</strong>他者の氏名・連絡先などの無断掲載</li>
                <li><strong>著作権侵害：</strong>他者のコンテンツの無断転載</li>
              </ul>
            </section>

            {/* 3. 審査方針 */}
            <section>
              <h2 style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                color: 'var(--pr-text-pri)',
                marginBottom: '12px',
                paddingBottom: '8px',
                borderBottom: '1px solid var(--pr-border)',
              }}>
                3. 審査方針
              </h2>
              <p style={{ fontSize: '.9rem', color: 'var(--pr-text-sec)', lineHeight: 1.8, marginBottom: '16px' }}>
                投稿されたレビューは以下のプロセスで審査されます。
              </p>
              <ol style={{
                fontSize: '.9rem',
                color: 'var(--pr-text-sec)',
                lineHeight: 1.8,
                paddingLeft: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}>
                <li>投稿後、自動システムによる初回チェック（スパム・重複検出）</li>
                <li>運営チームによる内容審査（通常1〜3営業日以内）</li>
                <li>基準を満たさないレビューは削除または修正依頼</li>
                <li>繰り返し違反したアカウントは利用停止</li>
              </ol>
              <p style={{ fontSize: '.85rem', color: 'var(--pr-text-ter)', lineHeight: 1.8, marginTop: '16px' }}>
                審査基準やその判断に異議がある場合は <Link href="/contact" style={{ color: 'var(--pr-accent)' }}>お問い合わせ</Link> からご連絡ください。
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
