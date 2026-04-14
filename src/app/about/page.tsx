import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/Header';

export const metadata: Metadata = {
  title: 'Plainrankについて | Plainrank',
  description: 'Plainrankはアフィリエイト・スポンサーなしの独立SaaS/AIツールレビューサイトです。スコア計算式をコードごと公開し、透明性を担保しています。',
};

export default function AboutPage() {
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
            <span style={{ color: 'var(--pr-text-pri)' }}>Plainrankについて</span>
          </nav>

          <h1 style={{
            fontSize: '1.7rem',
            fontWeight: 700,
            color: 'var(--pr-text-pri)',
            letterSpacing: '-.03em',
            marginBottom: '8px',
          }}>
            Plainrankについて
          </h1>
          <p style={{ fontSize: '.9rem', color: 'var(--pr-text-sec)', lineHeight: 1.8, marginBottom: '40px' }}>
            アフィリエイトやスポンサーで歪んだレビューサイトをクリーンにしたい。それだけです。
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>

            {/* なぜ作ったか */}
            <section>
              <h2 style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                color: 'var(--pr-text-pri)',
                marginBottom: '12px',
                paddingBottom: '8px',
                borderBottom: '1px solid var(--pr-border)',
              }}>
                なぜ作ったか
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ fontSize: '.9rem', color: 'var(--pr-text-sec)', lineHeight: 1.8, margin: 0 }}>
                  ツールを探すとき、検索結果に出てくるレビューサイトのほとんどがアフィリエイト収入で成り立っています。
                  高評価をつけるほど収入が上がる仕組みなら、正直な評価は期待できません。
                </p>
                <p style={{ fontSize: '.9rem', color: 'var(--pr-text-sec)', lineHeight: 1.8, margin: 0 }}>
                  Plainrankはそれをやめました。スポンサー契約なし、アフィリエイトなし。
                  スコア計算式はコードごと公開して、だれでも検証できるようにしています。
                </p>
              </div>
            </section>

            {/* 3つの約束 */}
            <section>
              <h2 style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                color: 'var(--pr-text-pri)',
                marginBottom: '12px',
                paddingBottom: '8px',
                borderBottom: '1px solid var(--pr-border)',
              }}>
                3つの約束
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  {
                    number: '01',
                    title: 'スポンサーなし',
                    desc: '金銭的な関係がスコアやランキングに影響することは一切ありません。掲載料・広告費は受け取りません。',
                  },
                  {
                    number: '02',
                    title: '計算式を公開',
                    desc: 'スコアがどうやって決まるか、コードレベルで公開しています。ブラックボックスは一切ありません。',
                  },
                  {
                    number: '03',
                    title: '削除履歴も公開',
                    desc: 'レビューを削除・非表示にした場合、その記録を残します。都合の悪いレビューを消すことはしません。',
                  },
                ].map((item) => (
                  <div key={item.number} style={{
                    display: 'flex',
                    gap: '16px',
                    background: 'var(--pr-surface)',
                    border: '1px solid var(--pr-border)',
                    borderRadius: '10px',
                    padding: '16px 20px',
                    alignItems: 'flex-start',
                  }}>
                    <div style={{
                      fontSize: '1.4rem',
                      fontWeight: 800,
                      color: 'var(--pr-border-hv)',
                      flexShrink: 0,
                      lineHeight: 1,
                      marginTop: '2px',
                    }}>
                      {item.number}
                    </div>
                    <div>
                      <div style={{ fontSize: '.95rem', fontWeight: 700, color: 'var(--pr-text-pri)', marginBottom: '4px' }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: '.83rem', color: 'var(--pr-text-sec)', lineHeight: 1.7 }}>
                        {item.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* オープンソース */}
            <section>
              <h2 style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                color: 'var(--pr-text-pri)',
                marginBottom: '12px',
                paddingBottom: '8px',
                borderBottom: '1px solid var(--pr-border)',
              }}>
                オープンソースプロジェクト
              </h2>
              <p style={{ fontSize: '.9rem', color: 'var(--pr-text-sec)', lineHeight: 1.8, marginBottom: '16px' }}>
                Plainrankのコードはすべてオープンソース（MITライセンス）で公開しています。
                バグ報告・機能提案・プルリクエスト、何でも歓迎です。
              </p>
              <a
                href="https://github.com/naaaaki/plainrank"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '.88rem',
                  fontWeight: 600,
                  color: '#fff',
                  background: 'var(--pr-text-pri)',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  textDecoration: 'none',
                }}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" />
                </svg>
                GitHub / plainrank
              </a>
            </section>

            {/* 関連リンク */}
            <div style={{ paddingTop: '8px', borderTop: '1px solid var(--pr-border)' }}>
              <Link href="/transparency" style={{ fontSize: '.88rem', color: 'var(--pr-accent)', textDecoration: 'none' }}>
                透明性ポリシーを詳しく見る →
              </Link>
            </div>

          </div>
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
