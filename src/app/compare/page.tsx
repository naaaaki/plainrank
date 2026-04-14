import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { getServiceAbbr, getServiceAvatarClass, CATEGORY_META } from '@/lib/service-meta';
import Header from '@/components/layout/Header';
import CompareSelector from './CompareSelector';

export const metadata = {
  title: 'ツール比較 | Plainrank',
  description: 'SaaS・AIツールを4軸（使いやすさ・コスパ・サポート・総合）で比較。正直なユーザーレビューに基づく比較ページです。',
};

interface Props {
  searchParams: Promise<{ a?: string; b?: string }>;
}

export default async function ComparePage({ searchParams }: Props) {
  const { a, b } = await searchParams;

  if (a && b) {
    // ===== 比較結果モード =====
    const [serviceA, serviceB, avgA, avgB, reviewsA, reviewsB] = await Promise.all([
      prisma.service.findFirst({ where: { slug: a, status: 'APPROVED' }, include: { category: true } }),
      prisma.service.findFirst({ where: { slug: b, status: 'APPROVED' }, include: { category: true } }),
      prisma.review.aggregate({
        where: { service: { slug: a } },
        _avg: { overall: true, usability: true, value: true, support: true },
        _count: { id: true },
      }),
      prisma.review.aggregate({
        where: { service: { slug: b } },
        _avg: { overall: true, usability: true, value: true, support: true },
        _count: { id: true },
      }),
      prisma.review.findMany({
        where: { service: { slug: a } },
        orderBy: { createdAt: 'desc' },
        take: 3,
        select: { body: true, overall: true, createdAt: true },
      }),
      prisma.review.findMany({
        where: { service: { slug: b } },
        orderBy: { createdAt: 'desc' },
        take: 3,
        select: { body: true, overall: true, createdAt: true },
      }),
    ]);

    if (!serviceA || !serviceB) {
      return (
        <div className="pr-page">
          <Header />
          <CatNav />
          <main style={{ background: 'var(--pr-bg)', minHeight: '100vh' }}>
            <div className="pr-container" style={{ paddingTop: '48px', textAlign: 'center' }}>
              <p style={{ fontSize: '18px', color: 'var(--pr-text-pri)', marginBottom: '12px' }}>
                サービスが見つかりませんでした
              </p>
              <p style={{ fontSize: '14px', color: 'var(--pr-text-sec)', marginBottom: '24px' }}>
                {!serviceA && <span>「{a}」というサービスは存在しません。</span>}
                {!serviceB && <span>「{b}」というサービスは存在しません。</span>}
              </p>
              <Link href="/compare" className="pr-btn-primary">比較ページに戻る</Link>
            </div>
          </main>
          <PageFooter />
        </div>
      );
    }

    const abbrA = getServiceAbbr(serviceA.slug, serviceA.name);
    const abbrB = getServiceAbbr(serviceB.slug, serviceB.name);
    const avatarA = getServiceAvatarClass(serviceA.slug);
    const avatarB = getServiceAvatarClass(serviceB.slug);
    const catMetaA = CATEGORY_META[serviceA.category.slug];
    const catMetaB = CATEGORY_META[serviceB.category.slug];

    const g = (avg: typeof avgA, key: 'overall' | 'usability' | 'value' | 'support') =>
      avg._avg[key] ?? 0;

    const metrics = [
      { key: 'overall'   as const, label: '総合スコア',         icon: '★' },
      { key: 'usability' as const, label: '使いやすさ',         icon: '🖱' },
      { key: 'value'     as const, label: 'コストパフォーマンス', icon: '💰' },
      { key: 'support'   as const, label: 'サポート品質',       icon: '🎧' },
    ];

    // 4軸で何勝したか
    const winsA = metrics.filter(m => g(avgA, m.key) > g(avgB, m.key)).length;
    const winsB = metrics.filter(m => g(avgB, m.key) > g(avgA, m.key)).length;

    return (
      <div className="pr-page">
        <Header />
        <CatNav />
        <main style={{ background: 'var(--pr-bg)', minHeight: '100vh' }}>
          <div className="pr-container" style={{ paddingTop: '24px', paddingBottom: '64px', maxWidth: '860px' }}>

            {/* パンくず */}
            <nav style={{
              fontSize: '.78rem', color: 'var(--pr-text-ter)',
              marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '6px',
            }}>
              <Link href="/" className="pr-breadcrumb-link">ホーム</Link>
              <span>›</span>
              <Link href="/compare" className="pr-breadcrumb-link">ツール比較</Link>
              <span>›</span>
              <span style={{ color: 'var(--pr-text-pri)' }}>{serviceA.name} vs {serviceB.name}</span>
            </nav>

            {/* ===== サービスヘッダー ===== */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 60px 1fr',
              gap: '12px',
              alignItems: 'center',
              marginBottom: '8px',
            }}>
              {/* A */}
              <div style={{
                background: 'var(--pr-surface)',
                border: '1px solid var(--pr-border)',
                borderRadius: '12px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className={`pr-service-avatar ${avatarA}`} style={{ width: '48px', height: '48px', fontSize: '16px', borderRadius: '12px', flexShrink: 0 }}>
                    {abbrA}
                  </span>
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--pr-text-pri)' }}>{serviceA.name}</div>
                    {catMetaA
                      ? <span className={`pr-cat-badge ${catMetaA.badgeClass}`} style={{ fontSize: '11px' }}>{catMetaA.badgeLabel}</span>
                      : <span style={{ fontSize: '12px', color: 'var(--pr-text-ter)' }}>{serviceA.category.name}</span>}
                  </div>
                </div>
                {serviceA.description && (
                  <p style={{ fontSize: '12px', color: 'var(--pr-text-sec)', lineHeight: 1.6, margin: 0 }}>
                    {serviceA.description}
                  </p>
                )}
                {winsA > winsB && (
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#16a34a', background: 'rgba(22,163,74,.1)', borderRadius: '6px', padding: '4px 10px', display: 'inline-block' }}>
                    👑 {winsA}勝 — 総合優位
                  </div>
                )}
              </div>

              {/* VS */}
              <div style={{ textAlign: 'center', fontWeight: 900, fontSize: '14px', color: 'var(--pr-text-ter)', letterSpacing: '.05em' }}>
                VS
              </div>

              {/* B */}
              <div style={{
                background: 'var(--pr-surface)',
                border: '1px solid var(--pr-border)',
                borderRadius: '12px',
                padding: '20px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className={`pr-service-avatar ${avatarB}`} style={{ width: '48px', height: '48px', fontSize: '16px', borderRadius: '12px', flexShrink: 0 }}>
                    {abbrB}
                  </span>
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--pr-text-pri)' }}>{serviceB.name}</div>
                    {catMetaB
                      ? <span className={`pr-cat-badge ${catMetaB.badgeClass}`} style={{ fontSize: '11px' }}>{catMetaB.badgeLabel}</span>
                      : <span style={{ fontSize: '12px', color: 'var(--pr-text-ter)' }}>{serviceB.category.name}</span>}
                  </div>
                </div>
                {serviceB.description && (
                  <p style={{ fontSize: '12px', color: 'var(--pr-text-sec)', lineHeight: 1.6, margin: 0 }}>
                    {serviceB.description}
                  </p>
                )}
                {winsB > winsA && (
                  <div style={{ fontSize: '12px', fontWeight: 700, color: '#16a34a', background: 'rgba(22,163,74,.1)', borderRadius: '6px', padding: '4px 10px', display: 'inline-block' }}>
                    👑 {winsB}勝 — 総合優位
                  </div>
                )}
              </div>
            </div>

            {/* ===== 4軸メトリクス比較 ===== */}
            <div style={{
              background: 'var(--pr-surface)',
              border: '1px solid var(--pr-border)',
              borderRadius: '12px',
              overflow: 'hidden',
              marginBottom: '24px',
            }}>
              {metrics.map((metric, idx) => {
                const vA = g(avgA, metric.key);
                const vB = g(avgB, metric.key);
                const pA = Math.round((vA / 5) * 100);
                const pB = Math.round((vB / 5) * 100);
                const winA = vA > vB;
                const winB = vB > vA;
                const noData = vA === 0 && vB === 0;

                return (
                  <div key={metric.key} style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 120px 1fr',
                    gap: '0',
                    borderBottom: idx < metrics.length - 1 ? '1px solid var(--pr-border)' : 'none',
                  }}>
                    {/* A side */}
                    <div style={{
                      padding: '16px 20px',
                      background: winA ? 'rgba(37,99,235,.04)' : 'transparent',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '18px', fontWeight: 800, color: winA ? 'var(--pr-accent)' : 'var(--pr-text-pri)' }}>
                          {noData ? '—' : vA.toFixed(2)}
                        </span>
                        <span style={{ fontSize: '12px', color: 'var(--pr-text-ter)' }}>/5</span>
                        {winA && <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--pr-accent)', background: 'var(--pr-accent-dim)', borderRadius: '4px', padding: '1px 6px' }}>優位</span>}
                      </div>
                      {!noData && (
                        <div style={{ height: '6px', background: 'var(--pr-surface-3)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${pA}%`, background: winA ? 'var(--pr-accent)' : 'var(--pr-text-ter)', borderRadius: '3px', transition: 'width .3s' }} />
                        </div>
                      )}
                    </div>

                    {/* ラベル（中央） */}
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '12px 8px',
                      borderLeft: '1px solid var(--pr-border)',
                      borderRight: '1px solid var(--pr-border)',
                      background: 'var(--pr-surface-2)',
                    }}>
                      <span style={{ fontSize: '16px', marginBottom: '4px' }}>{metric.icon}</span>
                      <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--pr-text-sec)', textAlign: 'center', lineHeight: 1.3 }}>
                        {metric.label}
                      </span>
                    </div>

                    {/* B side */}
                    <div style={{
                      padding: '16px 20px',
                      background: winB ? 'rgba(37,99,235,.04)' : 'transparent',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '18px', fontWeight: 800, color: winB ? 'var(--pr-accent)' : 'var(--pr-text-pri)' }}>
                          {noData ? '—' : vB.toFixed(2)}
                        </span>
                        <span style={{ fontSize: '12px', color: 'var(--pr-text-ter)' }}>/5</span>
                        {winB && <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--pr-accent)', background: 'var(--pr-accent-dim)', borderRadius: '4px', padding: '1px 6px' }}>優位</span>}
                      </div>
                      {!noData && (
                        <div style={{ height: '6px', background: 'var(--pr-surface-3)', borderRadius: '3px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${pB}%`, background: winB ? 'var(--pr-accent)' : 'var(--pr-text-ter)', borderRadius: '3px', transition: 'width .3s' }} />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* レビュー数行 */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 120px 1fr',
                borderTop: '1px solid var(--pr-border)',
                background: 'var(--pr-surface-2)',
              }}>
                <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--pr-text-pri)' }}>
                    {avgA._count.id.toLocaleString()}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--pr-text-ter)' }}>件のレビュー</span>
                </div>
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  borderLeft: '1px solid var(--pr-border)', borderRight: '1px solid var(--pr-border)',
                  padding: '12px 8px',
                }}>
                  <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--pr-text-sec)' }}>レビュー数</span>
                </div>
                <div style={{ padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ fontSize: '15px', fontWeight: 700, color: 'var(--pr-text-pri)' }}>
                    {avgB._count.id.toLocaleString()}
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--pr-text-ter)' }}>件のレビュー</span>
                </div>
              </div>
            </div>

            {/* ===== 最新レビュー ===== */}
            {(reviewsA.length > 0 || reviewsB.length > 0) && (
              <div style={{ marginBottom: '32px' }}>
                <h2 style={{
                  fontSize: '1rem', fontWeight: 700, color: 'var(--pr-text-pri)',
                  marginBottom: '16px', paddingBottom: '8px', borderBottom: '1px solid var(--pr-border)',
                }}>
                  最新レビュー
                </h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  {/* A のレビュー */}
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--pr-text-sec)', marginBottom: '10px' }}>
                      {serviceA.name}
                    </div>
                    {reviewsA.length === 0 ? (
                      <p style={{ fontSize: '13px', color: 'var(--pr-text-ter)', fontStyle: 'italic' }}>まだレビューがありません</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {reviewsA.map((r, i) => (
                          <div key={i} style={{
                            background: 'var(--pr-surface)',
                            border: '1px solid var(--pr-border)',
                            borderRadius: '8px',
                            padding: '12px 14px',
                          }}>
                            <div style={{ fontSize: '12px', color: '#f59e0b', marginBottom: '6px' }}>
                              {'★'.repeat(Math.round(r.overall))}{'☆'.repeat(5 - Math.round(r.overall))}
                              <span style={{ color: 'var(--pr-text-ter)', marginLeft: '6px' }}>
                                {r.overall.toFixed(1)}
                              </span>
                            </div>
                            <p style={{
                              fontSize: '13px', color: 'var(--pr-text-sec)', lineHeight: 1.6,
                              margin: 0, display: '-webkit-box', WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical', overflow: 'hidden',
                            }}>
                              {r.body}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {/* B のレビュー */}
                  <div>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--pr-text-sec)', marginBottom: '10px' }}>
                      {serviceB.name}
                    </div>
                    {reviewsB.length === 0 ? (
                      <p style={{ fontSize: '13px', color: 'var(--pr-text-ter)', fontStyle: 'italic' }}>まだレビューがありません</p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {reviewsB.map((r, i) => (
                          <div key={i} style={{
                            background: 'var(--pr-surface)',
                            border: '1px solid var(--pr-border)',
                            borderRadius: '8px',
                            padding: '12px 14px',
                          }}>
                            <div style={{ fontSize: '12px', color: '#f59e0b', marginBottom: '6px' }}>
                              {'★'.repeat(Math.round(r.overall))}{'☆'.repeat(5 - Math.round(r.overall))}
                              <span style={{ color: 'var(--pr-text-ter)', marginLeft: '6px' }}>
                                {r.overall.toFixed(1)}
                              </span>
                            </div>
                            <p style={{
                              fontSize: '13px', color: 'var(--pr-text-sec)', lineHeight: 1.6,
                              margin: 0, display: '-webkit-box', WebkitLineClamp: 3,
                              WebkitBoxOrient: 'vertical', overflow: 'hidden',
                            }}>
                              {r.body}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ===== CTAボタン ===== */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 60px 1fr', gap: '12px', alignItems: 'center' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {serviceA.website && (
                  <a href={serviceA.website} target="_blank" rel="noopener noreferrer"
                    className="pr-btn-ghost" style={{ textAlign: 'center', display: 'block' }}>
                    公式サイト ↗
                  </a>
                )}
                <Link href={`/${serviceA.category.slug}/${serviceA.slug}`}
                  className="pr-btn-primary" style={{ textAlign: 'center', display: 'block' }}>
                  {serviceA.name} のレビューを見る
                </Link>
              </div>
              <div />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {serviceB.website && (
                  <a href={serviceB.website} target="_blank" rel="noopener noreferrer"
                    className="pr-btn-ghost" style={{ textAlign: 'center', display: 'block' }}>
                    公式サイト ↗
                  </a>
                )}
                <Link href={`/${serviceB.category.slug}/${serviceB.slug}`}
                  className="pr-btn-primary" style={{ textAlign: 'center', display: 'block' }}>
                  {serviceB.name} のレビューを見る
                </Link>
              </div>
            </div>

            {/* 別の比較へ */}
            <div style={{ marginTop: '32px', textAlign: 'center' }}>
              <Link href="/compare" style={{ fontSize: '13px', color: 'var(--pr-accent)', textDecoration: 'none' }}>
                ← 別のサービスを比較する
              </Link>
            </div>

          </div>
        </main>
        <PageFooter />
      </div>
    );
  }

  // ===== サービス選択UIモード =====
  const allServices = await prisma.service.findMany({
    orderBy: { reviewCount: 'desc' },
    include: { category: true },
  });

  const services = allServices.map(s => ({
    slug: s.slug,
    name: s.name,
    score: s.score,
    reviewCount: s.reviewCount,
    abbr: getServiceAbbr(s.slug, s.name),
    avatarClass: getServiceAvatarClass(s.slug),
    categoryName: s.category.name,
    badgeClass: CATEGORY_META[s.category.slug]?.badgeClass ?? '',
    badgeLabel: CATEGORY_META[s.category.slug]?.badgeLabel ?? s.category.name,
  }));

  return (
    <div className="pr-page">
      <Header />
      <CatNav />
      <main style={{ background: 'var(--pr-bg)', minHeight: '100vh' }}>
        <div className="pr-container" style={{ paddingTop: '24px', paddingBottom: '64px', maxWidth: '760px' }}>
          {/* パンくず */}
          <nav style={{
            fontSize: '.78rem', color: 'var(--pr-text-ter)',
            marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            <Link href="/" className="pr-breadcrumb-link">ホーム</Link>
            <span>›</span>
            <span style={{ color: 'var(--pr-text-pri)' }}>ツール比較</span>
          </nav>

          {/* ページヘッダー */}
          <div style={{ marginBottom: '28px' }}>
            <h1 style={{
              fontSize: '1.5rem', fontWeight: 700, color: 'var(--pr-text-pri)',
              letterSpacing: '-.03em', marginBottom: '6px',
            }}>
              ツール比較
            </h1>
            <p style={{ fontSize: '.88rem', color: 'var(--pr-text-sec)' }}>
              比較したい2つのサービスを選ぶと、4軸（使いやすさ・コスパ・サポート・総合）で比較します。
            </p>
          </div>

          {/* インタラクティブ選択UI */}
          <CompareSelector
            services={services}
            initialA={a ?? null}
            initialB={null}
          />
        </div>
      </main>
      <PageFooter />
    </div>
  );
}

function CatNav() {
  return (
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
  );
}

function PageFooter() {
  return (
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
  );
}
