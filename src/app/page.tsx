import Link from 'next/link';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { getServiceAbbr, getServiceAvatarClass, CATEGORY_DISPLAY } from '@/lib/service-meta';
import CategoryNav from '@/components/CategoryNav';
import NewsletterForm from '@/components/newsletter/NewsletterForm';

export const revalidate = 60;

// P3-39: トップページ canonical タグ
export const metadata: Metadata = {
  title: 'Plainrank — 忖度なしのAI・SaaSレビューサイト',
  description: '広告なし・スポンサーなし。ユーザーの正直なレビューだけで動くランキング。AIツール・開発ツール・デザインツールを透明なスコアで比較。',
  alternates: {
    canonical: 'https://plainrank.io',
  },
  openGraph: {
    title: 'Plainrank — 忖度なしのAI・SaaSレビューサイト',
    description: '広告なし・スポンサーなし。ユーザーの正直なレビューだけで動くランキング。',
    url: 'https://plainrank.io',
    type: 'website',
  },
};

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
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [
    aiToolsRaw,
    devToolsRaw,
    designToolsRaw,
    marketingToolsRaw,
    reviewCount,
    recentReviewsRaw,
    popularCategories,
    trendingGroups,
  ] = await Promise.all([
    prisma.service.findMany({ where: { status: 'APPROVED', category: { slug: 'ai-tools' } },     orderBy: { reviewCount: 'desc' }, take: 3 }),
    prisma.service.findMany({ where: { status: 'APPROVED', category: { slug: 'dev-tools' } },    orderBy: { reviewCount: 'desc' }, take: 3 }),
    prisma.service.findMany({ where: { status: 'APPROVED', category: { slug: 'design-tools' } }, orderBy: { reviewCount: 'desc' }, take: 3 }),
    prisma.service.findMany({ where: { status: 'APPROVED', category: { slug: 'marketing' } },    orderBy: { reviewCount: 'desc' }, take: 3 }),
    prisma.review.count(),
    prisma.review.findMany({ orderBy: { createdAt: 'desc' }, take: 3, include: { user: true, service: true } }),
    prisma.category.findMany({
      orderBy: { viewCount: 'desc' },
      include: { _count: { select: { services: true } } },
    }),
    prisma.review.groupBy({
      by: ['serviceId'],
      where: { createdAt: { gte: sevenDaysAgo } },
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
      take: 5,
    }),
  ]);

  // 急上昇: 直近7日のレビュー数が多い順。なければ総レビュー数トップ5
  let trendingServices: { name: string; slug: string; count: number; weekly: boolean }[];
  if (trendingGroups.length >= 3) {
    const ids = trendingGroups.map(g => g.serviceId);
    const svcs = await prisma.service.findMany({
      where: { id: { in: ids }, status: 'APPROVED' },
      select: { id: true, name: true, slug: true },
    });
    trendingServices = trendingGroups.map(g => {
      const svc = svcs.find(s => s.id === g.serviceId)!;
      return { name: svc.name, slug: svc.slug, count: g._count.id, weekly: true };
    });
  } else {
    const top = await prisma.service.findMany({
      where: { status: 'APPROVED', reviewCount: { gt: 0 } },
      orderBy: { reviewCount: 'desc' },
      take: 5,
      select: { name: true, slug: true, reviewCount: true },
    });
    trendingServices = top.map(s => ({ name: s.name, slug: s.slug, count: s.reviewCount, weekly: false }));
  }

  // popularCategories から計算（冗長クエリ排除）
  const serviceCount  = popularCategories.reduce((s, c) => s + c._count.services, 0);
  const categoryCount = popularCategories.length;
  const aiToolsCount      = popularCategories.find(c => c.slug === 'ai-tools')?._count.services      ?? 0;
  const devToolsCount     = popularCategories.find(c => c.slug === 'dev-tools')?._count.services     ?? 0;
  const designToolsCount  = popularCategories.find(c => c.slug === 'design-tools')?._count.services  ?? 0;
  const marketingToolsCount = popularCategories.find(c => c.slug === 'marketing')?._count.services   ?? 0;

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
      {/* ===== カテゴリクイックナビ ===== */}
      <CategoryNav activeHref="/" />

      {/* ===== ヒーロー ===== */}
      <section className="pr-hero">
        <div className="pr-container">
          <div className="pr-hero-inner">
            <div>
              <h1>忖度なしの<span className="accent">レビューサイト</span>、Plainrank</h1>
              <p className="pr-hero-sub">
                ユーザーだけのレビューで動くランキング。
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
              <div className="pr-trust-item"><span>✓</span> 忖度なし</div>
              <div className="pr-trust-item"><span>✓</span> ソースコード公開（GitHub）</div>
              <div className="pr-trust-item"><span>✓</span> スコア計算式公開</div>
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
              {trendingServices.length > 0 && (
                <div className="pr-sidebar-card">
                  <div className="pr-sidebar-card-head">
                    {trendingServices[0].weekly ? '今週の急上昇' : 'レビュー数トップ'}
                  </div>
                  <ul className="pr-trending-list">
                    {trendingServices.map((item, i) => (
                      <li key={item.slug} className="pr-trending-item">
                        <span className="pr-trending-rank">{i + 1}</span>
                        <span className={`pr-trending-avatar ${getServiceAvatarClass(item.slug)}`}>
                          {getServiceAbbr(item.slug, item.name)}
                        </span>
                        <div className="pr-trending-info">
                          <div className="pr-trending-name">{item.name}</div>
                          <div className="pr-trending-change">
                            {item.weekly ? `↑ 今週${item.count}件` : `${item.count}レビュー`}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* レビュー投稿CTA */}
              <div className="pr-sidebar-card">
                <div className="pr-review-cta">
                  <div className="pr-review-cta-title">レビューを書いてみませんか</div>
                  <div className="pr-review-cta-sub">あなたの体験が、次に使う人の参考になります。スポンサー報酬はありません。</div>
                  <Link href="/reviews/new" className="pr-btn-cta-full">レビューを投稿する →</Link>
                </div>
              </div>

            </aside>

          </div>
        </div>
      </main>

      {/* ===== ニュースレター登録（フッター上） ===== */}
      <NewsletterForm />

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
