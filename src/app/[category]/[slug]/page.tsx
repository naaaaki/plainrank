import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ category: string; slug: string }>;
}

const MOCK_SERVICES: Record<string, {
  name: string;
  abbr: string;
  avatarClass: string;
  category: string;
  categoryLabel: string;
  categoryBadgeClass: string;
  score: number;
  reviewCount: number;
  description: string;
  website: string;
  scores: { usability: number; value: number; support: number; features: number };
}> = {
  chatgpt: {
    name: 'ChatGPT',
    abbr: 'GP',
    avatarClass: 'av-chatgpt',
    category: 'ai-tools',
    categoryLabel: 'AIツール',
    categoryBadgeClass: 'ai',
    score: 4.6,
    reviewCount: 1204,
    description: 'OpenAIが提供する汎用AIアシスタント。文章生成・コーディング・翻訳など幅広く活用できる大規模言語モデル。',
    website: 'https://chat.openai.com',
    scores: { usability: 4.7, value: 4.2, support: 3.9, features: 4.8 },
  },
  linear: {
    name: 'Linear',
    abbr: 'LI',
    avatarClass: 'av-linear',
    category: 'dev-tools',
    categoryLabel: '開発ツール',
    categoryBadgeClass: 'dev',
    score: 4.8,
    reviewCount: 538,
    description: 'シンプルで高速なプロジェクト管理ツール。エンジニアチーム向けに最適化されたUIと豊富なショートカットが特徴。',
    website: 'https://linear.app',
    scores: { usability: 4.9, value: 4.6, support: 4.4, features: 4.7 },
  },
  figma: {
    name: 'Figma',
    abbr: 'FG',
    avatarClass: 'av-figma',
    category: 'design-tools',
    categoryLabel: 'デザインツール',
    categoryBadgeClass: 'dsgn',
    score: 4.7,
    reviewCount: 921,
    description: 'ブラウザベースのUIデザインツール。リアルタイム共同編集・プロトタイピング・デザインシステム管理が一体化。',
    website: 'https://figma.com',
    scores: { usability: 4.8, value: 4.3, support: 4.5, features: 4.9 },
  },
  claude: {
    name: 'Claude',
    abbr: 'CL',
    avatarClass: 'av-claude',
    category: 'ai-tools',
    categoryLabel: 'AIツール',
    categoryBadgeClass: 'ai',
    score: 4.5,
    reviewCount: 742,
    description: 'Anthropicが開発するAIアシスタント。長文処理・安全性・指示への正確な追随が評価されている。',
    website: 'https://claude.ai',
    scores: { usability: 4.6, value: 4.3, support: 4.0, features: 4.5 },
  },
  notion: {
    name: 'Notion',
    abbr: 'No',
    avatarClass: 'av-notion',
    category: 'dev-tools',
    categoryLabel: '開発ツール',
    categoryBadgeClass: 'dev',
    score: 4.3,
    reviewCount: 1893,
    description: 'ノート・Wiki・タスク管理を統合したオールインワンワークスペース。柔軟なブロック構造で幅広い用途に対応。',
    website: 'https://notion.so',
    scores: { usability: 4.2, value: 4.5, support: 3.8, features: 4.6 },
  },
};

const MOCK_REVIEWS = [
  {
    id: 1,
    author: 'tanaka_dev',
    score: 5,
    date: '2026-03-15',
    text: '使い始めてから業務効率が大幅に上がりました。特に複雑なタスクへの対応力が素晴らしい。UIもシンプルで迷わず使えます。',
    verified: true,
  },
  {
    id: 2,
    author: 'suzuki_designer',
    score: 4,
    date: '2026-03-08',
    text: '全体的に満足度高め。ただ無料プランの制限が少し厳しいと感じる場面がありました。有料プランにすれば問題ないと思います。',
    verified: true,
  },
  {
    id: 3,
    author: 'yamamoto_pm',
    score: 4,
    date: '2026-02-27',
    text: 'チームで使い始めて3ヶ月。サポートのレスポンスが早く、困ったときにすぐ対応してもらえた点が特に良かったです。',
    verified: false,
  },
];

function StarRating({ score }: { score: number }) {
  return (
    <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          width="14"
          height="14"
          viewBox="0 0 20 20"
          fill={i <= Math.round(score) ? '#d97706' : 'var(--pr-surface-3)'}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  const pct = Math.round((score / 5) * 100);
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <span style={{ fontSize: '.82rem', color: 'var(--pr-text-sec)' }}>{label}</span>
        <span style={{ fontSize: '.82rem', fontWeight: 700, color: 'var(--pr-text-pri)', fontVariantNumeric: 'tabular-nums' }}>
          {score.toFixed(1)}
        </span>
      </div>
      <div style={{ width: '100%', height: '5px', background: 'var(--pr-surface-3)', borderRadius: '3px', overflow: 'hidden' }}>
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            background: 'linear-gradient(90deg, var(--pr-accent), #1d4ed8)',
            borderRadius: '3px',
          }}
        />
      </div>
    </div>
  );
}

export default async function ServiceDetailPage({ params }: Props) {
  const { category, slug } = await params;
  const service = MOCK_SERVICES[slug];
  if (!service) notFound();

  const scorePct = Math.round((service.score / 5) * 100);

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
            <Link href="/" style={{ color: 'var(--pr-text-ter)', textDecoration: 'none', transition: 'color .15s' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--pr-accent)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--pr-text-ter)')}>
              ホーム
            </Link>
            <span>›</span>
            <Link href={`/${service.category}`} style={{ color: 'var(--pr-text-ter)', textDecoration: 'none', transition: 'color .15s' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--pr-accent)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--pr-text-ter)')}>
              {service.categoryLabel}
            </Link>
            <span>›</span>
            <span style={{ color: 'var(--pr-text-pri)' }}>{service.name}</span>
          </nav>

          {/* ===== サービスヘッダーカード ===== */}
          <section style={{
            background: 'var(--pr-surface)',
            border: '1px solid var(--pr-border)',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '16px',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '20px', flexWrap: 'wrap' }}>
              {/* 左：サービス情報 */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                  <span className={`pr-service-avatar ${service.avatarClass}`} style={{ width: '40px', height: '40px', fontSize: '.85rem' }}>
                    {service.abbr}
                  </span>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <h1 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--pr-text-pri)', letterSpacing: '-.02em', margin: 0 }}>
                        {service.name}
                      </h1>
                      <span className={`pr-cat-badge ${service.categoryBadgeClass}`}>{service.categoryLabel}</span>
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: '.875rem', color: 'var(--pr-text-sec)', lineHeight: 1.65, marginBottom: '12px' }}>
                  {service.description}
                </p>
                <a
                  href={service.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '.8rem',
                    color: 'var(--pr-accent)',
                    textDecoration: 'none',
                    fontWeight: 500,
                  }}
                >
                  公式サイトを見る
                  <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 3H17V9M17 3L9 11M7 5H5C3.9 5 3 5.9 3 7v8c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2v-2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              </div>

              {/* 右：スコア */}
              <div style={{
                background: 'var(--pr-bg)',
                border: '1px solid var(--pr-border)',
                borderRadius: '10px',
                padding: '16px 20px',
                textAlign: 'center',
                minWidth: '140px',
                flexShrink: 0,
              }}>
                <div style={{ fontSize: '2.4rem', fontWeight: 700, color: 'var(--pr-text-pri)', letterSpacing: '-.03em', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
                  {service.score.toFixed(1)}
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', margin: '6px 0 4px' }}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg key={i} width="14" height="14" viewBox="0 0 20 20" fill={i <= Math.round(service.score) ? '#d97706' : 'var(--pr-surface-3)'}>
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <div style={{ fontSize: '.72rem', color: 'var(--pr-text-ter)', marginBottom: '12px' }}>
                  {service.reviewCount.toLocaleString()} 件のレビュー
                </div>
                {/* スコアバー */}
                <div style={{ width: '100%', height: '4px', background: 'var(--pr-surface-3)', borderRadius: '2px', overflow: 'hidden', marginBottom: '12px' }}>
                  <div style={{ width: `${scorePct}%`, height: '100%', background: 'linear-gradient(90deg, #d97706, #f59e0b)', borderRadius: '2px' }} />
                </div>
                <Link href="/reviews/new" className="pr-btn-cta-full">
                  レビューを書く
                </Link>
              </div>
            </div>
          </section>

          {/* ===== スコアブレークダウン ===== */}
          <section style={{
            background: 'var(--pr-surface)',
            border: '1px solid var(--pr-border)',
            borderRadius: '12px',
            padding: '20px 24px',
            marginBottom: '16px',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '16px',
              paddingBottom: '12px',
              borderBottom: '1px solid var(--pr-border)',
            }}>
              <h2 style={{ fontSize: '.95rem', fontWeight: 600, color: 'var(--pr-text-pri)', margin: 0 }}>
                なぜこのスコアなのか
              </h2>
              <Link href="/transparency" style={{ fontSize: '.78rem', color: 'var(--pr-accent)', textDecoration: 'none' }}>
                計算式を見る →
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <ScoreBar label="使いやすさ" score={service.scores.usability} />
              <ScoreBar label="コスパ" score={service.scores.value} />
              <ScoreBar label="サポート" score={service.scores.support} />
              <ScoreBar label="機能性" score={service.scores.features} />
            </div>
          </section>

          {/* ===== レビュー一覧 ===== */}
          <section>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
              <h2 style={{ fontSize: '.95rem', fontWeight: 600, color: 'var(--pr-text-pri)', margin: 0 }}>
                レビュー一覧
                <span style={{
                  marginLeft: '8px',
                  fontSize: '.72rem',
                  color: 'var(--pr-text-ter)',
                  background: 'var(--pr-surface-3)',
                  border: '1px solid var(--pr-border)',
                  borderRadius: '100px',
                  padding: '1px 8px',
                  fontWeight: 400,
                }}>
                  {service.reviewCount.toLocaleString()}件
                </span>
              </h2>
              <Link href="/reviews/new" className="pr-btn-primary" style={{ fontSize: '.78rem', padding: '5px 12px' }}>
                レビューを書く
              </Link>
            </div>

            <div style={{ background: 'var(--pr-surface)', border: '1px solid var(--pr-border)', borderRadius: '12px', overflow: 'hidden' }}>
              {MOCK_REVIEWS.map((review, idx) => (
                <div
                  key={review.id}
                  style={{
                    padding: '16px',
                    borderBottom: idx < MOCK_REVIEWS.length - 1 ? '1px solid var(--pr-border)' : 'none',
                  }}
                >
                  {/* レビューヘッダー */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div className="pr-reviewer-avatar">
                        {review.author[0].toUpperCase()}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span style={{ fontSize: '.82rem', fontWeight: 600, color: 'var(--pr-text-pri)' }}>
                            {review.author}
                          </span>
                          {review.verified && (
                            <span className="pr-verified-badge">✓ 確認済み</span>
                          )}
                        </div>
                        <span style={{ fontSize: '.7rem', color: 'var(--pr-text-ter)' }}>{review.date}</span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <span className="pr-review-stars">{'★'.repeat(review.score)}{'☆'.repeat(5 - review.score)}</span>
                      <span style={{ fontSize: '.8rem', fontWeight: 700, color: 'var(--pr-text-pri)', fontVariantNumeric: 'tabular-nums' }}>
                        {review.score}.0
                      </span>
                    </div>
                  </div>
                  {/* レビュー本文 */}
                  <p style={{ fontSize: '.82rem', color: 'var(--pr-text-sec)', lineHeight: 1.6, margin: 0 }}>
                    {review.text}
                  </p>
                </div>
              ))}
            </div>
          </section>

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
