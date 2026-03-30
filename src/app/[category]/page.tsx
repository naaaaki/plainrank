import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { getServiceAbbr, getServiceAvatarClass, CATEGORY_META } from '@/lib/service-meta';
import { CategoryViewTracker } from '@/components/CategoryViewTracker';

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
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

  return {
    title,
    description,
    openGraph: {
      title,
      description,
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

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;

  const categoryData = await prisma.category.findUnique({
    where: { slug: category },
    include: { services: { orderBy: { score: 'desc' } } },
  });
  if (!categoryData) notFound();

  const meta = CATEGORY_META[category] ?? {
    name: categoryData.name,
    description: categoryData.description ?? '',
    badgeClass: '',
    badgeLabel: categoryData.name,
  };

  const reviewTotal = categoryData.services.reduce((sum, s) => sum + s.reviewCount, 0);

  return (
    <div className="pr-page">
      <CategoryViewTracker slug={category} />
      {/* ===== ヘッダー ===== */}
      <header className="pr-header">
        <div className="pr-container">
          <div className="pr-header-inner">
            <Link href="/" className="pr-logo">
              <span className="pr-logo-icon">P</span>
              Plainrank
            </Link>

            <div className="pr-header-search">
              <span className="pr-search-icon">🔍</span>
              <input type="text" placeholder="ツール・SaaS・AIを検索..." />
              <span className="pr-search-kbd">/</span>
            </div>

            <nav className="pr-header-nav">
              <Link href="/ranking" className="pr-btn-ghost">ランキング</Link>
              <Link href="/compare" className="pr-btn-ghost">比較する</Link>
              <Link href="/reviews/new" className="pr-btn-ghost">レビューを書く</Link>
              <Link href="/auth/signin" className="pr-btn-primary">ログイン</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* ===== カテゴリクイックナビ ===== */}
      <nav className="pr-cat-nav">
        <div className="pr-container">
          <div className="pr-cat-nav-inner">
            <Link href="/" className="pr-cat-nav-item">
              <span className="pr-cat-nav-dot" style={{ background: '#2563EB' }}></span>すべて
            </Link>
            <Link href="/ai-tools" className={`pr-cat-nav-item${category === 'ai-tools' ? ' active' : ''}`}>
              <span className="pr-cat-nav-dot" style={{ background: '#2563EB' }}></span>AIツール
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
                広告なし・スポンサーなし・正直なレビューだけ。<br />
                SaaS・AIツールの「本音」が集まる独立評価サイトです。
              </p>
            </div>

            <div>
              <div className="pr-footer-col-title">サービス</div>
              <ul className="pr-footer-links">
                <li><Link href="/tools">ツール一覧</Link></li>
                <li><Link href="/categories">カテゴリ</Link></li>
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
                <li><Link href="/rss">RSS フィード</Link></li>
              </ul>
            </div>
          </div>

          <div className="pr-footer-bottom">
            <span className="pr-footer-copy">© 2026 Plainrank — 広告収入ゼロの独立メディア</span>
            <span className="pr-footer-trust">✓ スポンサーシップなし · ✓ 独立運営</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
