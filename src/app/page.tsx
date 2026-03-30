import Link from 'next/link';

// ランキングデータ
const AI_TOOLS = [
  { slug: 'chatgpt',  abbr: 'GP', name: 'ChatGPT',       desc: 'OpenAI の汎用AIアシスタント',    score: 4.8, reviews: 2341, pct: 96, avatarClass: 'av-chatgpt', rank: 1 },
  { slug: 'claude',   abbr: 'CL', name: 'Claude',        desc: 'Anthropic 製・長文処理に強い',    score: 4.7, reviews: 1823, pct: 94, avatarClass: 'av-claude',  rank: 2 },
  { slug: 'cursor',   abbr: 'CU', name: 'Cursor',        desc: 'AIコードエディタ・開発者向け',    score: 4.6, reviews:  956, pct: 92, avatarClass: 'av-cursor',  rank: 3 },
];

const DEV_TOOLS = [
  { slug: 'copilot',  abbr: 'CO', name: 'GitHub Copilot', desc: 'AIペアプログラマー・VS Code連携', score: 4.5, reviews: 1204, pct: 90, avatarClass: 'av-copilot', rank: 1 },
  { slug: 'vercel',   abbr: 'VE', name: 'Vercel',         desc: 'フロントエンドホスティング',      score: 4.4, reviews:  782, pct: 88, avatarClass: 'av-vercel',  rank: 2 },
  { slug: 'linear',   abbr: 'LI', name: 'Linear',         desc: 'プロジェクト管理・チーム向け',    score: 4.3, reviews:  654, pct: 86, avatarClass: 'av-linear',  rank: 3 },
];

const DESIGN_TOOLS = [
  { slug: 'figma',    abbr: 'FG', name: 'Figma',   desc: 'クラウドUIデザイン・共同編集',        score: 4.6, reviews: 1890, pct: 92, avatarClass: 'av-figma',  rank: 1 },
  { slug: 'framer',   abbr: 'FR', name: 'Framer',  desc: 'インタラクティブデザイン・実装',      score: 4.4, reviews:  432, pct: 88, avatarClass: 'av-framer', rank: 2 },
  { slug: 'canva',    abbr: 'CA', name: 'Canva',   desc: 'ノンデザイナー向け・テンプレ豊富',   score: 4.3, reviews: 1102, pct: 86, avatarClass: 'av-canva',  rank: 3 },
];

const MARKETING_TOOLS = [
  { slug: 'hubspot',  abbr: 'HS', name: 'HubSpot', desc: 'CRM・マーケ・営業の統合プラットフォーム', score: 4.3, reviews: 1102, pct: 86, avatarClass: 'av-hubspot', rank: 1 },
  { slug: 'notion',   abbr: 'No', name: 'Notion',  desc: 'ドキュメント・Wiki・プロジェクト管理',    score: 4.2, reviews:  987, pct: 84, avatarClass: 'av-notion',  rank: 2 },
  { slug: 'slack',    abbr: 'SL', name: 'Slack',   desc: 'チームコミュニケーションツール',          score: 4.1, reviews:  743, pct: 82, avatarClass: 'av-slack',   rank: 3 },
];

const TRENDING = [
  { abbr: 'GM', name: 'Gemini Advanced',  change: '+48% レビュー増', avatarClass: 'av-gemini' },
  { abbr: 'CU', name: 'Cursor',           change: '+31% レビュー増', avatarClass: 'av-cursor' },
  { abbr: 'LI', name: 'Linear',           change: '+22% レビュー増', avatarClass: 'av-linear' },
  { abbr: 'FR', name: 'Framer',           change: '+18% レビュー増', avatarClass: 'av-framer' },
  { abbr: 'GH', name: 'GitHub Copilot',   change: '+15% レビュー増', avatarClass: 'av-github' },
];

const RECENT_REVIEWS = [
  {
    initials: 'YA',
    name: '@dev_yamada',
    stars: '★★★★★',
    target: 'ChatGPT',
    body: 'プロンプトの精度が上がってから格段に使いやすくなった。特に長文要約は他ツールと比べて頭一つ抜けている印象。日本語対応も改善が続いており、業務への組み込みが進んでいる。',
    date: '2026-03-29',
    helpful: 24,
    avatarStyle: undefined as string | undefined,
  },
  {
    initials: 'MK',
    name: '@mktg_kato',
    stars: '★★★☆☆',
    target: 'Notion',
    body: '価格改定後にコスパが落ちた印象。AI機能が使えるのは便利だが、月額が上がってからチームへの導入を再検討している。代替ツールも合わせて評価中。',
    date: '2026-03-28',
    helpful: 11,
    avatarStyle: 'background:linear-gradient(135deg,#7c3aed,#9333ea)',
  },
  {
    initials: 'SZ',
    name: '@suzuki_eng',
    stars: '★★★★☆',
    target: 'Linear',
    body: 'Jiraより圧倒的に軽くて使いやすい。サイクル管理の概念が最初は慣れないが、慣れたらスプリント管理がとても楽になった。小〜中規模チームに強くおすすめできる。',
    date: '2026-03-27',
    helpful: 8,
    avatarStyle: 'background:linear-gradient(135deg,#16a34a,#15803d)',
  },
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

export default function HomePage() {
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
                <span className="pr-stat-num">9,840+</span>
                <span className="pr-stat-label">件のレビュー</span>
              </div>
              <div className="pr-stat-card">
                <span className="pr-stat-num">210+</span>
                <span className="pr-stat-label">サービス掲載</span>
              </div>
              <div className="pr-stat-card">
                <span className="pr-stat-num">6</span>
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
                reviewCount="5,120件"
                seeAllHref="/ai-tools"
                totalCount="14"
                moreLabel="AIツールをもっと見る"
                items={AI_TOOLS}
                categorySlug="ai-tools"
              />

              {/* 開発ツール */}
              <CategorySection
                badgeClass="dev"
                badgeLabel="⚙ 開発ツール"
                title="開発ツール"
                reviewCount="2,640件"
                seeAllHref="/dev-tools"
                totalCount="22"
                moreLabel="開発ツールをもっと見る"
                items={DEV_TOOLS}
                categorySlug="dev-tools"
              />

              {/* デザインツール */}
              <CategorySection
                badgeClass="dsgn"
                badgeLabel="◈ デザインツール"
                title="デザインツール"
                reviewCount="2,535件"
                seeAllHref="/design-tools"
                totalCount="18"
                moreLabel="デザインツールをもっと見る"
                items={DESIGN_TOOLS}
                categorySlug="design-tools"
              />

              {/* マーケSaaS */}
              <CategorySection
                badgeClass="mkt"
                badgeLabel="◎ マーケSaaS"
                title="マーケSaaS"
                reviewCount="2,545件"
                seeAllHref="/marketing"
                totalCount="19"
                moreLabel="マーケSaaSをもっと見る"
                items={MARKETING_TOOLS}
                categorySlug="marketing"
              />

              {/* 最新レビュー */}
              <div>
                <div className="pr-section-h2">
                  最新のレビュー
                  <div className="pr-section-h2-line"></div>
                </div>

                <section className="pr-recent-reviews-section">
                  <ul className="pr-review-feed">
                    {RECENT_REVIEWS.map((review, i) => (
                      <li key={i} className="pr-review-feed-item">
                        <div className="pr-review-feed-header">
                          <div
                            className="pr-reviewer-avatar"
                            style={review.avatarStyle ? { background: review.avatarStyle.replace('background:', '') } : undefined}
                          >
                            {review.initials}
                          </div>
                          <span className="pr-reviewer-name">{review.name}</span>
                          <span className="pr-verified-badge">認証済み</span>
                          <span className="pr-review-stars">{review.stars}</span>
                          <span className="pr-review-target">{review.target}</span>
                        </div>
                        <p className="pr-review-body">{review.body}</p>
                        <div className="pr-review-footer">
                          <span className="pr-review-date">{review.date}</span>
                          <span className="pr-review-helpful">👍 参考になった ({review.helpful})</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

            </div>{/* /.main-col */}

            {/* ===== サイドバー ===== */}
            <aside className="pr-sidebar">

              {/* カテゴリ一覧グリッド */}
              <div className="pr-sidebar-card">
                <div className="pr-sidebar-card-head">カテゴリ一覧</div>
                <div className="pr-cat-grid">
                  <Link href="/ai-tools" className="pr-cat-grid-item">
                    <span className="pr-cat-grid-icon">✦</span>
                    <span className="pr-cat-grid-name">AIツール</span>
                    <span className="pr-cat-grid-count">14サービス</span>
                  </Link>
                  <Link href="/dev-tools" className="pr-cat-grid-item">
                    <span className="pr-cat-grid-icon">⚙</span>
                    <span className="pr-cat-grid-name">開発ツール</span>
                    <span className="pr-cat-grid-count">22サービス</span>
                  </Link>
                  <Link href="/design-tools" className="pr-cat-grid-item">
                    <span className="pr-cat-grid-icon">◈</span>
                    <span className="pr-cat-grid-name">デザイン</span>
                    <span className="pr-cat-grid-count">18サービス</span>
                  </Link>
                  <Link href="/marketing" className="pr-cat-grid-item">
                    <span className="pr-cat-grid-icon">◎</span>
                    <span className="pr-cat-grid-name">マーケSaaS</span>
                    <span className="pr-cat-grid-count">19サービス</span>
                  </Link>
                  <Link href="/productivity" className="pr-cat-grid-item">
                    <span className="pr-cat-grid-icon">▶</span>
                    <span className="pr-cat-grid-name">生産性</span>
                    <span className="pr-cat-grid-count">31サービス</span>
                  </Link>
                  <Link href="/security" className="pr-cat-grid-item">
                    <span className="pr-cat-grid-icon">◉</span>
                    <span className="pr-cat-grid-name">セキュリティ</span>
                    <span className="pr-cat-grid-count">16サービス</span>
                  </Link>
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
