import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { getServiceAbbr, getServiceAvatarClass, CATEGORY_META } from '@/lib/service-meta';
import { CategoryViewTracker } from '@/components/CategoryViewTracker';
export const revalidate = 60;

interface Props {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ sort?: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category } = await params;

  const categoryData = await prisma.category.findUnique({
    where: { slug: category },
  });
  if (!categoryData) {
    return { title: 'カテゴリ | Plainrank' };
  }

  const meta = CATEGORY_META[category] ?? {
    name: categoryData.name,
    description: categoryData.description ?? '',
  };

  const title = `${meta.name} おすすめ比較ランキング | Plainrank`;
  const description = meta.description
    ? `${meta.description} — 広告なし・正直なユーザーレビューで${meta.name}を比較。`
    : `${meta.name}のおすすめサービスを広告なし・正直なユーザーレビューで比較ランキング。`;
  const canonicalUrl = `https://plainrank.io/${category}`;

  return {
    title,
    description,
    // P3-39: canonical タグ
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
    },
  };
}

function StarRating({ score }: { score: number }) {
  return (
    <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          width="13"
          height="13"
          viewBox="0 0 20 20"
          fill={i <= Math.round(score) ? '#d97706' : '#e2e8f0'}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category } = await params;
  const { sort } = await searchParams;

  const orderBy = sort === 'score'
    ? { score: 'desc' as const }
    : { reviewCount: 'desc' as const };

  const categoryData = await prisma.category.findUnique({
    where: { slug: category },
    include: { services: { where: { status: 'APPROVED' }, orderBy } },
  });
  if (!categoryData) notFound();

  const meta = CATEGORY_META[category] ?? {
    name: categoryData.name,
    description: categoryData.description ?? '',
    badgeClass: '',
    badgeLabel: categoryData.name,
  };

  const reviewTotal = categoryData.services.reduce((sum, s) => sum + s.reviewCount, 0);

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'ホーム', item: 'https://plainrank.io' },
      { '@type': 'ListItem', position: 2, name: meta.name, item: `https://plainrank.io/${category}` },
    ],
  };

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${meta.name} ランキング`,
    itemListElement: categoryData.services.slice(0, 10).map((s, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: s.name,
      url: `https://plainrank.io/${category}/${s.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <div className="pr-page">
        <CategoryViewTracker slug={category} />
        {/* ===== カテゴリクイックナビ ===== */}
        <nav className="pr-cat-nav">
          <div className="pr-container">
            <div className="pr-cat-nav-inner">
              <Link href="/" className="pr-cat-nav-item">
                <span className="pr-cat-nav-dot" style={{ background: '#4361ee' }}></span>すべて
              </Link>
              <Link href="/ai-tools" className={`pr-cat-nav-item${category === 'ai-tools' ? ' active' : ''}`}>
                <span className="pr-cat-nav-dot" style={{ background: '#4361ee' }}></span>AIツール
              </Link>
              <Link href="/dev-tools" className={`pr-cat-nav-item${category === 'dev-tools' ? ' active' : ''}`}>
                <span className="pr-cat-nav-dot" style={{ background: '#16a34a' }}></span>開発ツール
              </Link>
              <Link href="/design-tools" className={`pr-cat-nav-item${category === 'design-tools' ? ' active' : ''}`}>
                <span className="pr-cat-nav-dot" style={{ background: '#7c3aed' }}></span>デザインツール
              </Link>
              <Link href="/marketing" className={`pr-cat-nav-item${category === 'marketing' ? ' active' : ''}`}>
                <span className="pr-cat-nav-dot" style={{ background: '#b45309' }}></span>マーケSaaS
              </Link>
              <Link href="/productivity" className={`pr-cat-nav-item${category === 'productivity' ? ' active' : ''}`}>
                <span className="pr-cat-nav-dot" style={{ background: '#dc2626' }}></span>生産性
              </Link>
              <Link href="/security" className={`pr-cat-nav-item${category === 'security' ? ' active' : ''}`}>
                <span className="pr-cat-nav-dot" style={{ background: '#059669' }}></span>セキュリティ
              </Link>
              <Link href="/mobile-apps" className={`pr-cat-nav-item${category === 'mobile-apps' ? ' active' : ''}`}>
                <span className="pr-cat-nav-dot" style={{ background: '#0d9488' }}></span>モバイル
              </Link>
              <Link href="/communication" className={`pr-cat-nav-item${category === 'communication' ? ' active' : ''}`}>
                <span className="pr-cat-nav-dot" style={{ background: '#8b5cf6' }}></span>コミュニケーション
              </Link>
              <Link href="/analytics" className={`pr-cat-nav-item${category === 'analytics' ? ' active' : ''}`}>
                <span className="pr-cat-nav-dot" style={{ background: '#ea580c' }}></span>分析・BI
              </Link>
              <Link href="/project-management" className={`pr-cat-nav-item${category === 'project-management' ? ' active' : ''}`}>
                <span className="pr-cat-nav-dot" style={{ background: '#4338ca' }}></span>プロジェクト管理
              </Link>
              <Link href="/hr-tools" className={`pr-cat-nav-item${category === 'hr-tools' ? ' active' : ''}`}>
                <span className="pr-cat-nav-dot" style={{ background: '#db2777' }}></span>HR・採用
              </Link>
            </div>
          </div>
        </nav>

        {/* ===== メインコンテンツ ===== */}
        <main style={{ background: 'var(--pr-bg)', minHeight: '100vh' }}>
          <div className="pr-container" style={{ paddingTop: '20px', paddingBottom: '60px' }}>

            {/* パンくず */}
            <nav style={{
              fontSize: '.78rem',
              color: 'var(--pr-text-ter)',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}>
              <Link href="/" className="pr-breadcrumb-link">
                ホーム
              </Link>
              <span>›</span>
              <span style={{ color: 'var(--pr-text-pri)' }}>{meta.name}</span>
            </nav>

            {/* ページヘッダー */}
            <div style={{
              background: 'var(--pr-surface)',
              border: '1px solid var(--pr-border)',
              borderRadius: '12px',
              padding: '20px 24px',
              marginBottom: '16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '16px',
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <span className={`pr-cat-badge ${meta.badgeClass}`}>{meta.badgeLabel}</span>
                  <h1 style={{
                    fontSize: '1.3rem',
                    fontWeight: 700,
                    color: 'var(--pr-text-pri)',
                    letterSpacing: '-.02em',
                    margin: 0,
                  }}>
                    {meta.name}
                  </h1>
                </div>
                <p style={{ fontSize: '.82rem', color: 'var(--pr-text-sec)', margin: 0 }}>
                  {meta.description}
                </p>
                <p style={{ fontSize: '.75rem', color: 'var(--pr-text-ter)', marginTop: '6px' }}>
                  <strong style={{ color: 'var(--pr-text-sec)' }}>{categoryData.services.length}件</strong>のサービス・
                  <strong style={{ color: 'var(--pr-text-sec)' }}>{reviewTotal.toLocaleString()}件</strong>のレビュー収録
                </p>
                <div style={{ display: 'flex', gap: '6px', marginTop: '12px' }}>
                  <Link
                    href={`/${category}`}
                    className={sort !== 'score' ? 'pr-btn-primary' : 'pr-btn-ghost'}
                    style={{ fontSize: '.75rem', padding: '4px 10px' }}
                  >
                    レビュー数順
                  </Link>
                  <Link
                    href={`/${category}?sort=score`}
                    className={sort === 'score' ? 'pr-btn-primary' : 'pr-btn-ghost'}
                    style={{ fontSize: '.75rem', padding: '4px 10px' }}
                  >
                    スコア順
                  </Link>
                </div>
              </div>
              <Link href="/reviews/new" className="pr-btn-primary" style={{ flexShrink: 0 }}>
                レビューを投稿
              </Link>
            </div>

            {/* ランキングセクション */}
            {categoryData.services.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '60px 20px',
                color: 'var(--pr-text-ter)',
                background: 'var(--pr-surface)',
                border: '1px solid var(--pr-border)',
                borderRadius: '12px',
              }}>
                <p style={{ fontSize: '1rem', marginBottom: '8px' }}>まだサービスが登録されていません</p>
                <p style={{ fontSize: '.82rem' }}>近日公開予定です</p>
              </div>
            ) : (
              <section className="pr-category-section">
                <div className="pr-list-col-header">
                  <span className="pr-col-label">#</span>
                  <span className="pr-col-label">サービス名</span>
                  <span className="pr-col-label">スコア</span>
                  <span className="pr-col-label right">レビュー数</span>
                  <span className="pr-col-label"></span>
                </div>

                <ul className="pr-rank-list">
                  {categoryData.services.map((service, i) => {
                    const rank = i + 1;
                    let rankClass = 'pr-rank-num';
                    if (rank === 1) rankClass += ' top1';
                    else if (rank === 2) rankClass += ' top2';
                    else if (rank === 3) rankClass += ' top3';
                    const pct = Math.round((service.score / 5) * 100);
                    const abbr = getServiceAbbr(service.slug, service.name);
                    const avatarClass = getServiceAvatarClass(service.slug);

                    const hasReviews = service.reviewCount > 0;

                    return (
                      <li key={service.slug}>
                        <Link href={`/${category}/${service.slug}`} className="pr-rank-row">
                          <span className={rankClass}>{rank}</span>
                          <div className="pr-service-info">
                            <span className={`pr-service-avatar ${avatarClass}`}>{abbr}</span>
                            <div className="pr-service-text">
                              <span className="pr-service-name">{service.name}</span>
                              <span className="pr-service-desc">{service.description ?? ''}</span>
                            </div>
                          </div>
                          {hasReviews ? (
                            <div className="pr-score-area">
                              <span className="pr-star-icon">★</span>
                              <span className="pr-score-val">{service.score.toFixed(1)}</span>
                              <div className="pr-score-bar-wrap">
                                <div className="pr-score-bar-bg">
                                  <div className="pr-score-bar-fill" style={{ width: `${pct}%` }}></div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="pr-score-area">
                              <span style={{ fontSize: '.72rem', color: 'var(--pr-text-ter)', fontStyle: 'italic' }}>レビュー募集中</span>
                            </div>
                          )}
                          <span className="pr-review-num">{service.reviewCount.toLocaleString()}件</span>
                          <span className="pr-row-arrow">›</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </section>
            )}

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
