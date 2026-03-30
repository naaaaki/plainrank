"use client";

import Link from "next/link";
import { useState } from "react";

function StarInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '10px 0',
      borderBottom: '1px solid var(--pr-border)',
    }}>
      <span style={{ fontSize: '.875rem', fontWeight: 500, color: 'var(--pr-text-pri)' }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i)}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(0)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', lineHeight: 0 }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 20 20"
              fill={i <= (hovered || value) ? '#d97706' : 'var(--pr-surface-3)'}
              style={{ transition: 'fill .1s', display: 'block' }}
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
        <span style={{ marginLeft: '6px', fontSize: '.82rem', fontWeight: 700, color: 'var(--pr-text-pri)', width: '20px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
          {hovered || value || "–"}
        </span>
      </div>
    </div>
  );
}

export default function NewReviewPage() {
  const [scores, setScores] = useState({ overall: 0, usability: 0, value: 0, support: 0 });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="pr-page" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
          <div style={{ textAlign: 'center', maxWidth: '360px' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(22,163,74,.08)',
              border: '1px solid rgba(22,163,74,.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--pr-green)" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--pr-text-pri)', marginBottom: '8px', letterSpacing: '-.02em' }}>
              レビューを受け付けました
            </h2>
            <p style={{ fontSize: '.875rem', color: 'var(--pr-text-sec)', marginBottom: '24px', lineHeight: 1.65 }}>
              ありがとうございます。モデレーター確認後に公開されます。
            </p>
            <Link href="/" className="pr-btn-primary" style={{ padding: '8px 24px' }}>
              トップに戻る
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const inputStyle = {
    width: '100%',
    background: 'var(--pr-bg)',
    border: '1px solid var(--pr-border)',
    borderRadius: '8px',
    padding: '10px 14px',
    fontSize: '.875rem',
    color: 'var(--pr-text-pri)',
    outline: 'none',
    transition: 'border-color .15s, box-shadow .15s',
    fontFamily: 'inherit',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '.82rem',
    fontWeight: 600,
    color: 'var(--pr-text-pri)',
    marginBottom: '6px',
  };

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
              <Link href="/auth/signin" className="pr-btn-primary">ログイン</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* ===== メインコンテンツ ===== */}
      <main style={{ background: 'var(--pr-bg)', minHeight: '100vh' }}>
        <div className="pr-container" style={{ paddingTop: '20px', paddingBottom: '60px', maxWidth: '640px' }}>

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
            <span style={{ color: 'var(--pr-text-pri)' }}>レビューを書く</span>
          </nav>

          {/* ページタイトル */}
          <div style={{ marginBottom: '20px' }}>
            <h1 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--pr-text-pri)', letterSpacing: '-.02em', marginBottom: '6px' }}>
              レビューを書く
            </h1>
            <p style={{ fontSize: '.875rem', color: 'var(--pr-text-sec)' }}>
              使った経験をもとに正直に評価してください。
            </p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* スコア入力 */}
            <div style={{
              background: 'var(--pr-surface)',
              border: '1px solid var(--pr-border)',
              borderRadius: '12px',
              padding: '16px 20px',
            }}>
              <div style={{
                fontSize: '.72rem',
                fontWeight: 700,
                color: 'var(--pr-text-ter)',
                textTransform: 'uppercase',
                letterSpacing: '.06em',
                marginBottom: '4px',
              }}>
                評価スコア
              </div>
              <StarInput label="総合評価" value={scores.overall} onChange={(v) => setScores({ ...scores, overall: v })} />
              <StarInput label="使いやすさ" value={scores.usability} onChange={(v) => setScores({ ...scores, usability: v })} />
              <StarInput label="コスパ" value={scores.value} onChange={(v) => setScores({ ...scores, value: v })} />
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: '10px',
              }}>
                <span style={{ fontSize: '.875rem', fontWeight: 500, color: 'var(--pr-text-pri)' }}>サポート</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setScores({ ...scores, support: i })}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', lineHeight: 0 }}
                    >
                      <svg width="28" height="28" viewBox="0 0 20 20" fill={i <= scores.support ? '#d97706' : 'var(--pr-surface-3)'} style={{ display: 'block' }}>
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                  <span style={{ marginLeft: '6px', fontSize: '.82rem', fontWeight: 700, color: 'var(--pr-text-pri)', width: '20px', textAlign: 'right', fontVariantNumeric: 'tabular-nums' }}>
                    {scores.support || "–"}
                  </span>
                </div>
              </div>
            </div>

            {/* 利用期間 */}
            <div style={{
              background: 'var(--pr-surface)',
              border: '1px solid var(--pr-border)',
              borderRadius: '12px',
              padding: '16px 20px',
            }}>
              <label style={labelStyle}>利用期間</label>
              <select style={{ ...inputStyle, appearance: 'none', cursor: 'pointer' }}>
                <option value="">選択してください</option>
                <option>1ヶ月未満</option>
                <option>1〜6ヶ月</option>
                <option>6ヶ月以上</option>
              </select>
            </div>

            {/* タイトル */}
            <div style={{
              background: 'var(--pr-surface)',
              border: '1px solid var(--pr-border)',
              borderRadius: '12px',
              padding: '16px 20px',
            }}>
              <label style={labelStyle}>タイトル（任意）</label>
              <input
                type="text"
                placeholder="例：コスパ最高、使いやすい"
                style={inputStyle}
              />
            </div>

            {/* 本文 */}
            <div style={{
              background: 'var(--pr-surface)',
              border: '1px solid var(--pr-border)',
              borderRadius: '12px',
              padding: '16px 20px',
            }}>
              <label style={labelStyle}>レビュー本文</label>
              <textarea
                rows={5}
                placeholder="実際に使ってみた感想を書いてください。良い点・悪い点など具体的に書くと他のユーザーの参考になります。"
                style={{ ...inputStyle, resize: 'none' }}
              />
            </div>

            {/* 良い点・悪い点 */}
            <div style={{
              background: 'var(--pr-surface)',
              border: '1px solid var(--pr-border)',
              borderRadius: '12px',
              padding: '16px 20px',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
            }}>
              <div>
                <label style={labelStyle}>良い点（任意）</label>
                <textarea
                  rows={3}
                  placeholder="特に良かった点"
                  style={{ ...inputStyle, resize: 'none' }}
                />
              </div>
              <div>
                <label style={labelStyle}>改善してほしい点（任意）</label>
                <textarea
                  rows={3}
                  placeholder="気になった点"
                  style={{ ...inputStyle, resize: 'none' }}
                />
              </div>
            </div>

            {/* 送信ボタン */}
            <button
              type="submit"
              className="pr-btn-primary"
              style={{
                width: '100%',
                padding: '11px',
                borderRadius: '8px',
                fontSize: '.875rem',
                fontWeight: 600,
                justifyContent: 'center',
              }}
            >
              レビューを投稿する
            </button>

            <p style={{ fontSize: '.75rem', textAlign: 'center', color: 'var(--pr-text-ter)' }}>
              投稿することで
              <Link href="/transparency" style={{ color: 'var(--pr-accent)', textDecoration: 'none', margin: '0 4px' }}>
                透明性ポリシー
              </Link>
              に同意したものとみなします
            </p>
          </form>
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
