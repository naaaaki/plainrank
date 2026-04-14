import type { Metadata } from 'next';
import Link from 'next/link';
import Header from '@/components/layout/Header';

export const metadata: Metadata = {
  title: '透明性ポリシー | Plainrank',
  description: 'Plainrankのスコア計算方法・不正レビュー対策・オープンソースポリシーを公開しています。ベイズ平均補正の計算式もGitHubで確認できます。',
};

export default function TransparencyPage() {
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
            <span style={{ color: 'var(--pr-text-pri)' }}>透明性ポリシー</span>
          </nav>

          <h1 style={{
            fontSize: '1.7rem',
            fontWeight: 700,
            color: 'var(--pr-text-pri)',
            letterSpacing: '-.03em',
            marginBottom: '8px',
          }}>
            透明性ポリシー
          </h1>
          <p style={{ fontSize: '.9rem', color: 'var(--pr-text-sec)', lineHeight: 1.8, marginBottom: '40px' }}>
            Plainrankはクリーンな評価サイトを作りたいという思いから生まれました。
            「クリーンと謳いたい」のではなく、実態としてクリーンにする。すべての仕組みをここに公開します。
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '36px' }}>

            {/* スコア計算式 */}
            <section>
              <h2 style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                color: 'var(--pr-text-pri)',
                marginBottom: '12px',
                paddingBottom: '8px',
                borderBottom: '1px solid var(--pr-border)',
              }}>
                スコアの計算方法
              </h2>
              <p style={{ fontSize: '.9rem', color: 'var(--pr-text-sec)', lineHeight: 1.8, marginBottom: '16px' }}>
                スコアは4つの軸の重み付き平均をベースに、レビュー数が少ない場合のノイズを抑えるベイズ平均で補正しています。
                計算式はコードとともにGitHubで公開しています。
              </p>

              {/* 重み付き平均 */}
              <div style={{
                background: 'var(--pr-surface)',
                border: '1px solid var(--pr-border)',
                borderRadius: '12px',
                padding: '20px 24px',
                marginBottom: '12px',
              }}>
                <div style={{
                  fontSize: '.72rem',
                  fontWeight: 700,
                  color: 'var(--pr-text-ter)',
                  textTransform: 'uppercase',
                  letterSpacing: '.06em',
                  marginBottom: '14px',
                }}>
                  重み付き平均
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  {[
                    { label: '総合評価 (overall)', weight: '50%' },
                    { label: '使いやすさ (usability)', weight: '20%' },
                    { label: 'コスパ (value)', weight: '20%' },
                    { label: 'サポート (support)', weight: '10%' },
                  ].map((item) => (
                    <div key={item.label} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      background: 'var(--pr-bg)',
                      border: '1px solid var(--pr-border)',
                      borderRadius: '8px',
                      padding: '10px 14px',
                    }}>
                      <span style={{ fontSize: '.85rem', color: 'var(--pr-text-sec)' }}>{item.label}</span>
                      <span style={{ fontSize: '.85rem', fontWeight: 700, color: 'var(--pr-accent)' }}>{item.weight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ベイズ平均 */}
              <div style={{
                background: 'var(--pr-surface)',
                border: '1px solid var(--pr-border)',
                borderRadius: '12px',
                padding: '20px 24px',
                marginBottom: '12px',
              }}>
                <div style={{
                  fontSize: '.72rem',
                  fontWeight: 700,
                  color: 'var(--pr-text-ter)',
                  textTransform: 'uppercase',
                  letterSpacing: '.06em',
                  marginBottom: '10px',
                }}>
                  ベイズ平均補正
                </div>
                <p style={{ fontSize: '.85rem', color: 'var(--pr-text-sec)', lineHeight: 1.8, marginBottom: '12px' }}>
                  レビューが少ないサービスのスコアが極端にならないよう、事前スコア 3.0・事前件数 5件を使ったベイズ平均で補正しています。
                  レビューが増えるほど実際の評価に近づきます。
                </p>
                <div style={{
                  fontFamily: 'monospace',
                  fontSize: '.85rem',
                  background: 'var(--pr-bg)',
                  border: '1px solid var(--pr-border)',
                  borderRadius: '8px',
                  padding: '10px 16px',
                  color: 'var(--pr-text-sec)',
                }}>
                  score = (5 × 3.0 + n × weighted) / (5 + n)
                </div>
              </div>

              <a
                href="https://github.com/naaaaki/plainrank/blob/main/src/lib/score.ts"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '.85rem', color: 'var(--pr-accent)', textDecoration: 'none' }}
              >
                GitHubでコードを見る →
              </a>
            </section>

            {/* 不正レビュー対策 */}
            <section>
              <h2 style={{
                fontSize: '1.1rem',
                fontWeight: 700,
                color: 'var(--pr-text-pri)',
                marginBottom: '12px',
                paddingBottom: '8px',
                borderBottom: '1px solid var(--pr-border)',
              }}>
                不正レビュー対策
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  {
                    title: 'GitHub / Googleアカウント認証必須',
                    desc: '捨てアカウントによるスパムを防ぐため、ソーシャルアカウントによる認証を必須としています。',
                  },
                  {
                    title: '1アカウント・1サービス・1レビューのみ',
                    desc: '同じユーザーが同じサービスに複数回レビューを投稿することはできません。',
                  },
                  {
                    title: 'コミュニティフラグ機能',
                    desc: '怪しいレビューを他のユーザーが報告できます。一定数のフラグが立ったレビューはモデレーター確認待ちになります。',
                  },
                  {
                    title: 'スポンサー・アフィリエイト排除',
                    desc: '金銭的な関係がランキングやスコアに影響することは一切ありません。スポンサー契約・広告掲載は行いません。',
                  },
                ].map((item) => (
                  <div key={item.title} style={{
                    display: 'flex',
                    gap: '12px',
                    background: 'var(--pr-surface)',
                    border: '1px solid var(--pr-border)',
                    borderRadius: '8px',
                    padding: '14px 16px',
                  }}>
                    <span style={{ color: 'var(--pr-accent)', fontWeight: 700, flexShrink: 0 }}>✓</span>
                    <div>
                      <div style={{ fontSize: '.88rem', fontWeight: 600, color: 'var(--pr-text-pri)', marginBottom: '4px' }}>{item.title}</div>
                      <div style={{ fontSize: '.83rem', color: 'var(--pr-text-sec)', lineHeight: 1.7 }}>{item.desc}</div>
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
                オープンソース
              </h2>
              <p style={{ fontSize: '.9rem', color: 'var(--pr-text-sec)', lineHeight: 1.8, marginBottom: '16px' }}>
                Plainrankのコードはすべてオープンソースとして公開しています。スコア計算・不正検知・ランキングロジックをだれでも確認・検証できます。
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
                GitHubで見る
              </a>
            </section>

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
