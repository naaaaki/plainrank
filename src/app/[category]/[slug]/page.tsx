import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { getServiceAbbr, getServiceAvatarClass, CATEGORY_META } from '@/lib/service-meta';
import Header from '@/components/layout/Header';

export const revalidate = 300;

interface Props {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, slug } = await params;

  const service = await prisma.service.findFirst({
    where: { slug, status: 'APPROVED', category: { slug: category } },
    include: { category: true },
  });
  if (!service) {
    return { title: 'サービス詳細 | Plainrank' };
  }

  const title = `${service.name} レビュー・評価 | Plainrank`;
  const description = service.description
    ? service.description
    : `${service.name}のユーザーレビュー・評価を掲載。広告なし・正直な口コミで比較できます。`;
  const canonicalUrl = `https://plainrank.io/${category}/${slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      url: canonicalUrl,
    },
  };
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
            background: 'linear-gradient(90deg, var(--pr-accent), #3451d1)',
            borderRadius: '3px',
          }}
        />
      </div>
    </div>
  );
}

export default async function ServiceDetailPage({ params }: Props) {
  const { category, slug } = await params;

  const [service, relatedServices] = await Promise.all([
    prisma.service.findFirst({
      where: { slug, status: 'APPROVED', category: { slug: category } },
      include: {
        category: true,
        reviews: { orderBy: { createdAt: 'desc' }, take: 20, include: { user: true } },
      },
    }),
    prisma.service.findMany({
      where: {
        status: 'APPROVED',
        category: { slug: category },
        slug: { not: slug },
      },
      // P3-38: スコア降順で関連サービスを取得（同カテゴリ・自分以外・limit 4）
      orderBy: { score: 'desc' },
      take: 4,
    }),
  ]);
  if (!service) notFound();

  const reviews = service.reviews;
  const avgScores = reviews.length > 0
    ? {
        overall:   reviews.reduce((s, r) => s + r.overall,   0) / reviews.length,
        usability: reviews.reduce((s, r) => s + r.usability, 0) / reviews.length,
        value:     reviews.reduce((s, r) => s + r.value,     0) / reviews.length,
        support:   reviews.reduce((s, r) => s + r.support,   0) / reviews.length,
      }
    : null;

  const scorePct = Math.round((service.score / 5) * 100);
  const abbr = getServiceAbbr(service.slug, service.name);
  const avatarClass = getServiceAvatarClass(service.slug);

  const catMeta = CATEGORY_META[category] ?? {
    name: service.category.name,
    description: service.category.description ?? '',
    badgeClass: '',
    badgeLabel: service.category.name,
  };

  // P3-35: SoftwareApplication + aggregateRating JSON-LD（リッチスニペット対応）
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: service.name,
    description: service.description ?? '',
    url: service.website ?? `https://plainrank.io/${category}/${slug}`,
    applicationCategory: catMeta.name,
    ...(service.reviewCount > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: service.score.toFixed(1),
        reviewCount: service.reviewCount,
        bestRating: '5',
        worstRating: '1',
      },
    }),
  };

  // P3-39: BreadcrumbList JSON-LD（トップ > カテゴリ > サービス名）
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'ホーム', item: 'https://plainrank.io' },
      { '@type': 'ListItem', position: 2, name: catMeta.name, item: `https://plainrank.io/${category}` },
      { '@type': 'ListItem', position: 3, name: service.name, item: `https://plainrank.io/${category}/${slug}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <div className="pr-page">
        <Header />

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
              <Link href={`/${category}`} className="pr-breadcrumb-link">
                {catMeta.name}
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
                    <span className={`pr-service-avatar ${avatarClass}`} style={{ width: '40px', height: '40px', fontSize: '.85rem' }}>
                      {abbr}
                    </span>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <h1 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--pr-text-pri)', letterSpacing: '-.02em', margin: 0 }}>
                          {service.name}
                        </h1>
                        <span className={`pr-cat-badge ${catMeta.badgeClass}`}>{catMeta.name}</span>
                      </div>
                    </div>
                  </div>
                  <p style={{ fontSize: '.875rem', color: 'var(--pr-text-sec)', lineHeight: 1.65, marginBottom: '12px' }}>
                    {service.description ?? ''}
                  </p>
                  {service.website && (
                    <a
                      href={`${service.website}?utm_source=plainrank&utm_medium=referral&utm_campaign=service_detail`}
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
                  )}
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
                  {service.reviewCount > 0 ? (
                    <>
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
                    </>
                  ) : (
                    <div style={{ marginBottom: '12px' }}>
                      <div style={{ fontSize: '.85rem', fontWeight: 600, color: 'var(--pr-text-ter)', marginBottom: '6px' }}>
                        レビュー募集中
                      </div>
                      <div style={{ fontSize: '.72rem', color: 'var(--pr-text-ter)' }}>
                        まだレビューがありません
                      </div>
                    </div>
                  )}
                  <Link
                    href={`/reviews/new?serviceId=${service.id}&serviceName=${encodeURIComponent(service.name)}`}
                    className="pr-btn-cta-full"
                  >
                    レビューを書く
                  </Link>
                </div>
              </div>
            </section>

            {/* ===== スコアブレークダウン（レビューがある場合のみ） ===== */}
            {avgScores && (
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
                  <ScoreBar label="総合評価"   score={avgScores.overall} />
                  <ScoreBar label="使いやすさ" score={avgScores.usability} />
                  <ScoreBar label="コスパ"     score={avgScores.value} />
                  <ScoreBar label="サポート"   score={avgScores.support} />
                </div>
              </section>
            )}

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

              {reviews.length === 0 ? (
                <div style={{
                  background: 'var(--pr-surface)',
                  border: '1px solid var(--pr-border)',
                  borderRadius: '12px',
                  padding: '40px 20px',
                  textAlign: 'center',
                  color: 'var(--pr-text-ter)',
                }}>
                  <p style={{ fontSize: '.9rem', marginBottom: '8px' }}>まだレビューがありません。最初のレビューを書いてみませんか？</p>
                  <Link href="/reviews/new" className="pr-btn-primary" style={{ display: 'inline-block', marginTop: '12px', fontSize: '.82rem' }}>
                    レビューを書く
                  </Link>
                </div>
              ) : (
                <div style={{ background: 'var(--pr-surface)', border: '1px solid var(--pr-border)', borderRadius: '12px', overflow: 'hidden' }}>
                  {reviews.map((review, idx) => {
                    const authorName = review.user.name ?? 'ユーザー';
                    const initial = authorName[0].toUpperCase();
                    const stars = Math.round(review.overall);
                    const dateStr = review.createdAt.toISOString().split('T')[0];
                    return (
                      <div
                        key={review.id}
                        style={{
                          padding: '16px',
                          borderBottom: idx < reviews.length - 1 ? '1px solid var(--pr-border)' : 'none',
                        }}
                      >
                        {/* レビューヘッダー */}
                        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div className="pr-reviewer-avatar">
                              {initial}
                            </div>
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontSize: '.82rem', fontWeight: 600, color: 'var(--pr-text-pri)' }}>
                                  {authorName}
                                </span>
                                <span className="pr-verified-badge">✓ 確認済み</span>
                              </div>
                              <span style={{ fontSize: '.7rem', color: 'var(--pr-text-ter)' }}>{dateStr}</span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <span className="pr-review-stars">{'★'.repeat(stars)}{'☆'.repeat(5 - stars)}</span>
                            <span style={{ fontSize: '.8rem', fontWeight: 700, color: 'var(--pr-text-pri)', fontVariantNumeric: 'tabular-nums' }}>
                              {review.overall.toFixed(1)}
                            </span>
                          </div>
                        </div>
                        {/* レビュー本文 */}
                        <p style={{ fontSize: '.82rem', color: 'var(--pr-text-sec)', lineHeight: 1.6, margin: 0 }}>
                          {review.body}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* ===== 同カテゴリの関連サービス ===== */}
            {relatedServices.length > 0 && (
              <section style={{ marginTop: '24px' }}>
                <h2 style={{ fontSize: '.95rem', fontWeight: 600, color: 'var(--pr-text-pri)', marginBottom: '12px' }}>
                  同カテゴリの関連サービス
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '10px' }}>
                  {relatedServices.map((s) => {
                    const abbr = getServiceAbbr(s.slug, s.name);
                    const avClass = getServiceAvatarClass(s.slug);
                    return (
                      <Link
                        key={s.slug}
                        href={`/${category}/${s.slug}`}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          background: 'var(--pr-surface)',
                          border: '1px solid var(--pr-border)',
                          borderRadius: '10px',
                          padding: '12px',
                          textDecoration: 'none',
                          transition: 'border-color .15s',
                        }}
                      >
                        <span className={`pr-service-avatar ${avClass}`} style={{ width: '32px', height: '32px', fontSize: '.7rem', flexShrink: 0 }}>
                          {abbr}
                        </span>
                        <div style={{ minWidth: 0 }}>
                          <div style={{ fontSize: '.82rem', fontWeight: 600, color: 'var(--pr-text-pri)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {s.name}
                          </div>
                          <div style={{ fontSize: '.7rem', color: 'var(--pr-text-ter)' }}>
                            {s.reviewCount > 0 ? `★${s.score.toFixed(1)} · ${s.reviewCount}件` : 'レビュー募集中'}
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
                <div style={{ marginTop: '10px', textAlign: 'right' }}>
                  <Link href={`/${category}`} style={{ fontSize: '.78rem', color: 'var(--pr-accent)', textDecoration: 'none' }}>
                    {catMeta.name}をすべて見る →
                  </Link>
                </div>
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
