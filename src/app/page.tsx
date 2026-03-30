import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getServiceAbbr, getServiceAvatarClass, CATEGORY_DISPLAY } from '@/lib/service-meta';

const TRENDING = [
  { abbr: 'GM', name: 'Gemini Advanced',  change: '+48% レビュー増', avatarClass: 'av-gemini' },
  { abbr: 'CU', name: 'Cursor',           change: '+31% レビュー増', avatarClass: 'av-cursor' },
  { abbr: 'LI', name: 'Linear',           change: '+22% レビュー増', avatarClass: 'av-linear' },
  { abbr: 'FR', name: 'Framer',           change: '+18% レビュー増', avatarClass: 'av-framer' },
  { abbr: 'GH', name: 'GitHub Copilot',   change: '+15% レビュー増', avatarClass: 'av-github' },
];

interface RankItem {
  slug: string;
  abbr: string;
  name: string;
  desc: string;
  score: number;
  reviews: number;
  pct: number;
  avatarClass: string;
  rank: number;
}

function RankNumClass(rank: number) {
  if (rank === 1) return 'pr-rank-num top1';
  if (rank === 2) return 'pr-rank-num top2';
  if (rank === 3) return 'pr-rank-num top3';
  return 'pr-rank-num';
}

function CategorySection({
  badgeClass,
  badgeLabel,
  title,
  reviewCount,
  seeAllHref,
  totalCount,
  moreLabel,
  items,
  categorySlug,
}: {
  badgeClass: string;
  badgeLabel: string;
  title: string;
  reviewCount: string;
  seeAllHref: string;
  totalCount: string;
  moreLabel: string;
  items: RankItem[];
  categorySlug: string;
}) {
  return (
    <section className="pr-category-section">
      <div className="pr-section-head">
        <div className="pr-section-head-left">
          <span className={`pr-cat-badge ${badgeClass}`}>{badgeLabel}</span>
          <span className="pr-section-title">{title}</span>
          <span className="pr-review-count-label">{reviewCount}</span>
        </div>
        <Link href={seeAllHref} className="pr-see-all">すべて見る →</Link>
      </div>

      <div className="pr-list-col-header">
        <span className="pr-col-label">#</span>
        <span className="pr-col-label">サービス名</span>
        <span className="pr-col-label">スコア</span>
        <span className="pr-col-label right">レビュー数</span>
        <span className="pr-col-label"></span>
      </div>

      <ul className="pr-rank-list">
        {items.map((item) => (
          <li key={item.slug}>
            <Link href={`/${categorySlug}/${item.slug}`} className="pr-rank-row">
              <span className={RankNumClass(item.rank)}>{item.rank}</span>
              <div className="pr-service-info">
                <span className={`pr-service-avatar ${item.avatarClass}`}>{item.abbr}</span>
                <div className="pr-service-text">
                  <span className="pr-service-name">{item.name}</span>
                  <span className="pr-service-desc">{item.desc}</span>
                </div>
              </div>
              <div className="pr-score-area">
                <span className="pr-star-icon">★</span>
                <span className="pr-score-val">{item.score.toFixed(1)}</span>
                <div className="pr-score-bar-wrap">
                  <div className="pr-score-bar-bg">
                    <div className="pr-score-bar-fill" style={{ width: `${item.pct}%` }}></div>
                  </div>
                </div>
              </div>
              <span className="pr-review-num">{item.reviews.toLocaleString()}件</span>
              <span className="pr-row-arrow">›</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="pr-section-footer">
        <span className="pr-section-footer-note">TOP3を表示中 — 全{totalCount}件</span>
        <Link href={seeAllHref} className="pr-btn-see-more">{moreLabel} →</Link>
      </div>
    </section>
  );
}

export default async function HomePage() {
  const [
    aiToolsRaw,
    devToolsRaw,
    designToolsRaw,
    marketingToolsRaw,
    reviewCount,
    serviceCount,
    categoryCount,
    recentReviewsRaw,
    aiToolsCount,
    devToolsCount,
    designToolsCount,
    marketingToolsCount,
    popularCategories,
  ] = await Promise.all([
    prisma.service.findMany({ where: { category: { slug: 'ai-tools' } },      orderBy: { score: 'desc' }, take: 3 }),
    prisma.service.findMany({ where: { category: { slug: 'dev-tools' } },     orderBy: { score: 'desc' }, take: 3 }),
    prisma.service.findMany({ where: { category: { slug: 'design-tools' } },  orderBy: { score: 'desc' }, take: 3 }),
    prisma.service.findMany({ where: { category: { slug: 'marketing' } },     orderBy: { score: 'desc' }, take: 3 }),
    prisma.review.count(),
    prisma.service.count(),
    prisma.category.count(),
    prisma.review.findMany({ orderBy: { createdAt: 'desc' }, take: 3, include: { user: true, service: true } }),
    prisma.service.count({ where: { category: { slug: 'ai-tools' } } }),
    prisma.service.count({ where: { category: { slug: 'dev-tools' } } }),
    prisma.service.count({ where: { category: { slug: 'design-tools' } } }),
    prisma.service.count({ where: { category: { slug: 'marketing' } } }),
    prisma.category.findMany({
      orderBy: { viewCount: 'desc' },
      include: { _count: { select: { services: true } } },
    }),
  ]);

  function toRankItems(services: typeof aiToolsRaw): RankItem[] {
    return services.map((s, i) => ({
      slug: s.slug,
      abbr: getServiceAbbr(s.slug, s.name),
      name: s.name,
      desc: s.description ?? '',
      score: s.score,
      reviews: s.reviewCount,
      pct: Math.round((s.score / 5) * 100),
      avatarClass: getServiceAvatarClass(s.slug),
      rank: i + 1,
    }));
  }

  const aiTools       = toRankItems(aiToolsRaw);
  const devTools      = toRankItems(devToolsRaw);
  const designTools   = toRankItems(designToolsRaw);
  const marketingTools = toRankItems(marketingToolsRaw);

  const aiReviewCount      = aiToolsRaw.reduce((s, r) => s + r.reviewCount, 0);
  const devReviewCount     = devToolsRaw.reduce((s, r) => s + r.reviewCount, 0);
  const designReviewCount  = designToolsRaw.reduce((s, r) => s + r.reviewCount, 0);
  const mktReviewCount     = marketingToolsRaw.reduce((s, r) => s + r.reviewCount, 0);

  return (
    <div className="pr-page">
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
              <Link href="/review/new" className="pr-btn-ghost">レビューを書く</Link>
              <Link href="/auth/signin" className="pr-btn-primary">ログイン</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* ===== カテゴリクイックナビ ===== */}
      <nav className="pr-cat-nav">
        <div className="pr-container">
          <div className="pr-cat-nav-inner">
            <Link href="/" className="pr-cat-nav-item active">
              <span className="pr-cat-nav-dot" style={{ background: '#2563EB' }}></span>すべて
            </Link>
            <Link href="/ai-tools" className="pr-cat-nav-item">
              <span className="pr-cat-nav-dot" style={{ background: '#2563EB' }}></span>AIツール
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
          </div>
        </div>
      </nav>

      {/* ===== ヒーロー ===== */}
      <section className="pr-hero">
        <div className="pr-container">
          <div className="pr-hero-inner">
            <div>
              <div className="pr-hero-badge">✦ 広告なし・スポンサーなし</div>
              <h1>本音の<span className="accent">レビュー</span>だけが<br />集まる場所</h1>
              <p className="pr-hero-sub">
                SaaS・AIツールの信頼できる評価を届けます。<br />
                スポンサー料を受け取らない、独立した評価サイトです。
              </p>
            </div>

            <div className="pr-hero-stats-block">
              <div className="pr-stat-card">
                <span className="pr-stat-num">{reviewCount.toLocaleString()}+</span>
                <span className="pr-stat-label">件のレビュー</span>
              </div>
              <div className="pr-stat-card">
                <span className="pr-stat-num">{serviceCount.toLocaleString()}+</span>
                <span className="pr-stat-label">サービス掲載</span>
              </div>
              <div className="pr-stat-card">
                <span className="pr-stat-num">{categoryCount}</span>
                <span className="pr-stat-label">カテゴリ</span>
              </div>
            </div>
          </div>

          {/* 透明性バナー */}
          <div className="pr-trust-bar">
            <div className="pr-trust-bar-inner">
              <div className="pr-trust-item"><span>✓</span> 広告収入ゼロ</div>
              <div className="pr-trust-item"><span>✓</span> スポンサーレビュー排除</div>
              <div className="pr-trust-item"><span>✓</span> 全スコア根拠開示</div>
              <div className="pr-trust-item"><span>✓</span> 認証済みレビュアー制度</div>
              <Link href="/transparency" className="pr-trust-link">透明性ポリシーを読む →</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== メインコンテンツ ===== */}
      <main>
        <div className="pr-container">
          <div className="pr-main-layout">

            {/* ===== 左メインカラム ===== */}
            <div className="pr-main-col">

              {/* 比較バナー */}
              <Link href="/compare" className="pr-compare-banner">
                <div>
                  <div className="pr-compare-banner-title">ツールを並べて比較する</div>
                  <div className="pr-compare-banner-sub">ChatGPT vs Claude、Figma vs Framer… 気になるツールを横並びで比較</div>
                </div>
                <span className="pr-compare-banner-btn">比較する →</span>
              </Link>

              {/* AIツール */}
              <CategorySection
                badgeClass="ai"
                badgeLabel="✦ AIツール"
                title="AI ツール"
                reviewCount={`${aiReviewCount.toLocaleString()}件`}
                seeAllHref="/ai-tools"
                totalCount={String(aiToolsCount)}
                moreLabel="AIツールをもっと見る"
                items={aiTools}
                categorySlug="ai-tools"
              />

              {/* 開発ツール */}
              <CategorySection
                badgeClass="dev"
                badgeLabel="⚙ 開発ツール"
                title="開発ツール"
                reviewCount={`${devReviewCount.toLocaleString()}件`}
                seeAllHref="/dev-tools"
                totalCount={String(devToolsCount)}
                moreLabel="開発ツールをもっと見る"
                items={devTools}
                categorySlug="dev-tools"
              />

              {/* デザインツール */}
              <CategorySection
                badgeClass="dsgn"
                badgeLabel="◈ デザインツール"
                title="デザインツール"
                reviewCount={`${designReviewCount.toLocaleString()}件`}
                seeAllHref="/design-tools"
                totalCount={String(designToolsCount)}
                moreLabel="デザインツールをもっと見る"
                items={designTools}
                categorySlug="design-tools"
              />

              {/* マーケSaaS */}
              <CategorySection
                badgeClass="mkt"
                badgeLabel="◎ マーケSaaS"
                title="マーケSaaS"
                reviewCount={`${mktReviewCount.toLocaleString()}件`}
                seeAllHref="/marketing"
                totalCount={String(marketingToolsCount)}
                moreLabel="マーケSaaSをもっと見る"
                items={marketingTools}
                categorySlug="marketing"
              />

              {/* 最新レビュー */}
              {recentReviewsRaw.length > 0 && (
                <div>
                  <div className="pr-section-h2">
                    最新のレビュー
                    <div className="pr-section-h2-line"></div>
                  </div>

                  <section className="pr-recent-reviews-section">
                    <ul className="pr-review-feed">
                      {recentReviewsRaw.map((review) => {
                        const userName = review.user.name ?? 'ユーザー';
                        const initials = userName.slice(0, 2).toUpperCase();
                        const stars = Math.round(review.overall);
                        const starsStr = '★'.repeat(stars) + '☆'.repeat(5 - stars);
                        const dateStr = review.createdAt.toISOString().split('T')[0];
                        return (
                          <li key={review.id} className="pr-review-feed-item">
                            <div className="pr-review-feed-header">
                              <div className="pr-reviewer-avatar">
                                {initials}
                              </div>
                              <span className="pr-reviewer-name">@{userName}</span>
                              <span className="pr-verified-badge">認証済み</span>
                              <span className="pr-review-stars">{starsStr}</span>
                              <span className="pr-review-target">{review.service.name}</span>
                            </div>
                            <p className="pr-review-body">{review.body}</p>
                            <div className="pr-review-footer">
                              <span className="pr-review-date">{dateStr}</span>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </section>
                </div>
              )}

            </div>{/* /.main-col */}

            {/* ===== サイドバー ===== */}
            <aside className="pr-sidebar">

              {/* 人気カテゴリグリッド */}
              <div className="pr-sidebar-card">
                <div className="pr-sidebar-card-head">人気カテゴリ</div>
                <div className="pr-cat-grid">
                  {popularCategories.map((cat) => {
                    const display = CATEGORY_DISPLAY[cat.slug] ?? { icon: '●', color: '#666' };
                    return (
                      <Link key={cat.slug} href={`/${cat.slug}`} className="pr-cat-grid-item">
                        <span className="pr-cat-grid-icon">{display.icon}</span>
                        <span className="pr-cat-grid-name">{cat.name}</span>
                        <span className="pr-cat-grid-count">{cat._count.services}サービス</span>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* 急上昇 */}
              <div className="pr-sidebar-card">
                <div className="pr-sidebar-card-head">今週の急上昇</div>
                <ul className="pr-trending-list">
                  {TRENDING.map((item, i) => (
                    <li key={i} className="pr-trending-item">
                      <span className="pr-trending-rank">{i + 1}</span>
                      <span className={`pr-trending-avatar ${item.avatarClass}`}>{item.abbr}</span>
                      <div className="pr-trending-info">
                        <div className="pr-trending-name">{item.name}</div>
                        <div className="pr-trending-change">↑ {item.change}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* レビュー投稿CTA */}
              <div className="pr-sidebar-card">
                <div className="pr-review-cta">
                  <div className="pr-review-cta-title">レビューを書いてみませんか</div>
                  <div className="pr-review-cta-sub">あなたの体験が、次に使う人の参考になります。スポンサー報酬はありません。</div>
                  <Link href="/review/new" className="pr-btn-cta-full">レビューを投稿する →</Link>
                </div>
              </div>

            </aside>

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
                <li><Link href="/review/new">レビューを投稿</Link></li>
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
