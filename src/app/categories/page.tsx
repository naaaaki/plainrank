import Link from 'next/link';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { CATEGORY_DISPLAY, CATEGORY_META } from '@/lib/service-meta';
import Header from '@/components/layout/Header';

export const revalidate = 60;

// P3-39: カテゴリ一覧ページ canonical タグ
export const metadata: Metadata = {
  title: 'カテゴリ一覧 | Plainrank',
  description:
    'SaaS・AIツールのカテゴリ一覧。AIツール・開発ツール・デザインツールなど、広告なし・正直なレビューでカテゴリを探せます。',
  alternates: {
    canonical: 'https://plainrank.io/categories',
  },
  openGraph: {
    title: 'カテゴリ一覧 | Plainrank',
    description: 'SaaS・AIツールのカテゴリ一覧。AIツール・開発ツール・デザインツールなど、広告なし・正直なレビューでカテゴリを探せます。',
    url: 'https://plainrank.io/categories',
  },
};

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      _count: { select: { services: { where: { status: 'APPROVED' } } } },
      services: {
        where: { status: 'APPROVED' },
        orderBy: { reviewCount: 'desc' },
        take: 3,
        select: { name: true, slug: true, reviewCount: true, score: true },
      },
    },
    orderBy: { viewCount: 'desc' },
  });

  // カテゴリごとの総レビュー数を集計
  const reviewTotals = await Promise.all(
    categories.map((cat) =>
      prisma.review.count({ where: { service: { categoryId: cat.id } } })
    )
  );

  const totalServices = categories.reduce((s, c) => s + c._count.services, 0);
  const totalReviews = reviewTotals.reduce((s, n) => s + n, 0);

  // P3-39: BreadcrumbList JSON-LD（トップ > カテゴリ一覧）
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'ホーム', item: 'https://plainrank.io' },
      { '@type': 'ListItem', position: 2, name: 'カテゴリ一覧', item: 'https://plainrank.io/categories' },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
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

      <main style={{ background: 'var(--pr-bg)', minHeight: '100vh' }}>
        <div className="pr-container" style={{ paddingTop: '24px', paddingBottom: '64px' }}>

          {/* パンくず */}
          <nav style={{
            fontSize: '.78rem',
            color: 'var(--pr-text-ter)',
            marginBottom: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <Link href="/" className="pr-breadcrumb-link">ホーム</Link>
            <span>›</span>
            <span style={{ color: 'var(--pr-text-pri)' }}>カテゴリ一覧</span>
          </nav>

          {/* ページヘッダー */}
          <div style={{
            marginBottom: '32px',
          }}>
            <h1 style={{
              fontSize: '1.6rem',
              fontWeight: 700,
              color: 'var(--pr-text-pri)',
              letterSpacing: '-.03em',
              marginBottom: '8px',
            }}>
              カテゴリ一覧
            </h1>
            <p style={{ fontSize: '.88rem', color: 'var(--pr-text-sec)', marginBottom: '16px' }}>
              広告なし・スポンサーなしの正直なレビューで、カテゴリから気になるツールを探せます。
            </p>
            {/* 統計バー */}
            <div style={{
              display: 'flex',
              gap: '24px',
              flexWrap: 'wrap',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--pr-accent)' }}>
                  {categories.length}
                </span>
                <span style={{ fontSize: '.8rem', color: 'var(--pr-text-ter)' }}>カテゴリ</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--pr-accent)' }}>
                  {totalServices.toLocaleString()}
                </span>
                <span style={{ fontSize: '.8rem', color: 'var(--pr-text-ter)' }}>サービス掲載</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--pr-accent)' }}>
                  {totalReviews.toLocaleString()}
                </span>
                <span style={{ fontSize: '.8rem', color: 'var(--pr-text-ter)' }}>件のレビュー</span>
              </div>
            </div>
          </div>

          {/* カテゴリカードグリッド */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: '16px',
          }}>
            {categories.map((cat, i) => {
              const display = CATEGORY_DISPLAY[cat.slug] ?? { icon: '●', color: '#666' };
              const meta = CATEGORY_META[cat.slug];
              const reviewTotal = reviewTotals[i];
              const badgeClass = meta?.badgeClass ?? '';
              const badgeLabel = meta?.badgeLabel ?? cat.name;
              const description = meta?.description ?? cat.description ?? '';

              return (
                <Link
                  key={cat.slug}
                  href={`/${cat.slug}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div style={{
                    background: 'var(--pr-surface)',
                    border: '1px solid var(--pr-border)',
                    borderRadius: '12px',
                    padding: '20px',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    transition: 'border-color .15s, box-shadow .15s',
                    cursor: 'pointer',
                  }}
                    className="pr-cat-card"
                  >
                    {/* カードヘッダー */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '10px',
                          background: `${display.color}18`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '1.1rem',
                          flexShrink: 0,
                        }}>
                          {display.icon}
                        </div>
                        <div>
                          <div style={{
                            fontSize: '.95rem',
                            fontWeight: 700,
                            color: 'var(--pr-text-pri)',
                            letterSpacing: '-.01em',
                          }}>
                            {cat.name}
                          </div>
                          <span className={`pr-cat-badge ${badgeClass}`} style={{ fontSize: '.7rem', marginTop: '3px', display: 'inline-block' }}>
                            {badgeLabel}
                          </span>
                        </div>
                      </div>
                      <span style={{
                        fontSize: '.75rem',
                        color: 'var(--pr-text-ter)',
                        flexShrink: 0,
                        marginTop: '2px',
                      }}>
                        {cat._count.services}件 →
                      </span>
                    </div>

                    {/* 説明 */}
                    {description && (
                      <p style={{
                        fontSize: '.8rem',
                        color: 'var(--pr-text-sec)',
                        lineHeight: 1.6,
                        margin: 0,
                      }}>
                        {description}
                      </p>
                    )}

                    {/* 統計 */}
                    <div style={{
                      display: 'flex',
                      gap: '16px',
                      paddingTop: '4px',
                      borderTop: '1px solid var(--pr-border)',
                    }}>
                      <div>
                        <div style={{ fontSize: '.9rem', fontWeight: 700, color: 'var(--pr-text-pri)' }}>
                          {cat._count.services}
                        </div>
                        <div style={{ fontSize: '.7rem', color: 'var(--pr-text-ter)' }}>サービス</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '.9rem', fontWeight: 700, color: 'var(--pr-text-pri)' }}>
                          {reviewTotal.toLocaleString()}
                        </div>
                        <div style={{ fontSize: '.7rem', color: 'var(--pr-text-ter)' }}>レビュー</div>
                      </div>
                    </div>

                    {/* 人気サービス Top3 */}
                    {cat.services.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {cat.services.map((s) => (
                          <span key={s.slug} style={{
                            fontSize: '.72rem',
                            background: 'var(--pr-surface-2)',
                            color: 'var(--pr-text-sec)',
                            border: '1px solid var(--pr-border)',
                            borderRadius: '6px',
                            padding: '2px 8px',
                            whiteSpace: 'nowrap',
                          }}>
                            {s.name}
                            {s.reviewCount > 0 && (
                              <span style={{ marginLeft: '4px', color: 'var(--pr-text-ter)' }}>
                                ★{s.score.toFixed(1)}
                              </span>
                            )}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>

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
    </>
  );
}
