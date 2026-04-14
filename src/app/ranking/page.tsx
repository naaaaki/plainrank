import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getServiceAbbr, getServiceAvatarClass, CATEGORY_META, CATEGORY_DISPLAY } from '@/lib/service-meta';
import Header from '@/components/layout/Header';

export const revalidate = 60;

export const metadata = {
  title: '総合ランキング | Plainrank',
  description: 'SaaS・AIツールの総合ランキング。広告なし・正直なユーザーレビューに基づくスコアで順位付けしています。',
};

function RankNumClass(rank: number) {
  if (rank === 1) return 'pr-rank-num top1';
  if (rank === 2) return 'pr-rank-num top2';
  if (rank === 3) return 'pr-rank-num top3';
  return 'pr-rank-num';
}

export default async function RankingPage() {
  const [services, totalReviews] = await Promise.all([
    prisma.service.findMany({
      where: { status: 'APPROVED' },
      orderBy: [{ reviewCount: 'desc' }, { score: 'desc' }],
      take: 30,
      include: { category: true },
    }),
    prisma.review.count(),
  ]);

  const totalServices = services.length;

  return (
    <div className="pr-page">
      {/* ===== ヘッダー ===== */}
      <Header />

      {/* ===== カテゴリクイックナビ ===== */}
      <nav className="pr-cat-nav">
        <div className="pr-container">
          <div className="pr-cat-nav-inner">
            <Link href="/" className="pr-cat-nav-item">
              <span className="pr-cat-nav-dot" style={{ background: '#4361ee' }}></span>すべて
            </Link>
            <Link href="/ai-tools" className="pr-cat-nav-item">
              <span className="pr-cat-nav-dot" style={{ background: '#4361ee' }}></span>AIツール
            </Link>
            <Link href="/dev-tools" className="pr-cat-nav-item">
              <span className="pr-cat-nav-dot" style={{ background: '#16a34a' }}></span>開発ツール
            </Link>
            <Link href="/design-tools" className="pr-cat-nav-item">
              <span className="pr-cat-nav-dot" style={{ background: '#7c3aed' }}></span>デザインツール
            </Link>
            <Link href="/marketing" className="pr-cat-nav-item">
              <span className="pr-cat-nav-dot" style={{ background: '#b45309' }}></span>マーケSaaS
            </Link>
            <Link href="/productivity" className="pr-cat-nav-item">
              <span className="pr-cat-nav-dot" style={{ background: '#dc2626' }}></span>生産性
            </Link>
            <Link href="/security" className="pr-cat-nav-item">
              <span className="pr-cat-nav-dot" style={{ background: '#059669' }}></span>セキュリティ
            </Link>
            <Link href="/mobile-apps" className="pr-cat-nav-item">
              <span className="pr-cat-nav-dot" style={{ background: '#0d9488' }}></span>モバイル
            </Link>
            <Link href="/communication" className="pr-cat-nav-item">
              <span className="pr-cat-nav-dot" style={{ background: '#8b5cf6' }}></span>コミュニケーション
            </Link>
            <Link href="/analytics" className="pr-cat-nav-item">
              <span className="pr-cat-nav-dot" style={{ background: '#ea580c' }}></span>分析・BI
            </Link>
            <Link href="/project-management" className="pr-cat-nav-item">
              <span className="pr-cat-nav-dot" style={{ background: '#4338ca' }}></span>プロジェクト管理
            </Link>
            <Link href="/hr-tools" className="pr-cat-nav-item">
              <span className="pr-cat-nav-dot" style={{ background: '#db2777' }}></span>HR・採用
            </Link>
          </div>
        </div>
      </nav>

      {/* ===== メインコンテンツ ===== */}
      <main>
        <div className="pr-container">
          {/* パンくず */}
          <nav className="pr-breadcrumb" style={{ padding: '16px 0 8px', fontSize: '13px', color: 'var(--pr-muted)' }}>
            <Link href="/" style={{ color: 'var(--pr-muted)', textDecoration: 'none' }}>ホーム</Link>
            <span style={{ margin: '0 6px' }}>›</span>
            <span>ランキング</span>
          </nav>

          {/* ページヘッダー */}
          <div style={{ marginBottom: '32px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 700, color: 'var(--pr-text)', marginBottom: '8px' }}>
              総合ランキング
            </h1>
            <p style={{ fontSize: '15px', color: 'var(--pr-muted)', lineHeight: 1.6, maxWidth: '640px' }}>
              全カテゴリのサービスをレビュー数・スコアで順位付け。広告なし・正直な評価に基づくランキングです。
            </p>

            {/* 統計 */}
            <div style={{ display: 'flex', gap: '24px', marginTop: '20px' }}>
              <div className="pr-stat-card" style={{ padding: '12px 20px' }}>
                <span className="pr-stat-num" style={{ fontSize: '20px' }}>{totalServices}+</span>
                <span className="pr-stat-label">サービス掲載</span>
              </div>
              <div className="pr-stat-card" style={{ padding: '12px 20px' }}>
                <span className="pr-stat-num" style={{ fontSize: '20px' }}>{totalReviews.toLocaleString()}+</span>
                <span className="pr-stat-label">総レビュー数</span>
              </div>
            </div>
          </div>

          {/* ランキングリスト */}
          <div className="pr-list-col-header">
            <span className="pr-col-label">#</span>
            <span className="pr-col-label">サービス名</span>
            <span className="pr-col-label">カテゴリ</span>
            <span className="pr-col-label">スコア</span>
            <span className="pr-col-label right">レビュー数</span>
            <span className="pr-col-label"></span>
          </div>

          <ul className="pr-rank-list" style={{ marginBottom: '48px' }}>
            {services.map((service, i) => {
              const rank = i + 1;
              const abbr = getServiceAbbr(service.slug, service.name);
              const avatarClass = getServiceAvatarClass(service.slug);
              const pct = Math.round((service.score / 5) * 100);
              const categorySlug = service.category.slug;
              const catMeta = CATEGORY_META[categorySlug];
              const catDisplay = CATEGORY_DISPLAY[categorySlug] ?? { icon: '●', color: '#666' };

              return (
                <li key={service.slug}>
                  <Link href={`/${categorySlug}/${service.slug}`} className="pr-rank-row">
                    <span className={RankNumClass(rank)}>{rank}</span>
                    <div className="pr-service-info">
                      <span className={`pr-service-avatar ${avatarClass}`}>{abbr}</span>
                      <div className="pr-service-text">
                        <span className="pr-service-name">{service.name}</span>
                        <span className="pr-service-desc">{service.description ?? ''}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      {catMeta ? (
                        <span className={`pr-cat-badge ${catMeta.badgeClass}`} style={{ fontSize: '11px' }}>
                          {catMeta.badgeLabel}
                        </span>
                      ) : (
                        <span style={{ fontSize: '12px', color: catDisplay.color }}>
                          {catDisplay.icon} {service.category.name}
                        </span>
                      )}
                    </div>
                    <div className="pr-score-area">
                      <span className="pr-star-icon">★</span>
                      <span className="pr-score-val">{service.score.toFixed(1)}</span>
                      <div className="pr-score-bar-wrap">
                        <div className="pr-score-bar-bg">
                          <div className="pr-score-bar-fill" style={{ width: `${pct}%` }}></div>
                        </div>
                      </div>
                    </div>
                    <span className="pr-review-num">{service.reviewCount.toLocaleString()}件</span>
                    <span className="pr-row-arrow">›</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </main>

      {/* ===== フッター ===== */}
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
