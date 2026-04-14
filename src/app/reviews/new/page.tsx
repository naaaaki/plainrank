"use client";

import Link from "next/link";
import { Suspense, useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Header from "@/components/layout/Header";

// ---------------------------------------------------------------------------
// StarInput
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// ServiceSelector
// ---------------------------------------------------------------------------
interface ServiceOption {
  id: string;
  name: string;
  category: { name: string };
}

function ServiceSelector({ onSelect }: { onSelect: (id: string, name: string) => void }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ServiceOption[]>([]);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (query.length < 2) { setResults([]); return; }
    timerRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
        const data = await res.json() as { results: ServiceOption[] };
        setResults(data.results);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [query]);

  return (
    <div style={{
      background: 'var(--pr-surface)',
      border: '1px solid var(--pr-border)',
      borderRadius: '12px',
      padding: '16px 20px',
    }}>
      <div style={{
        fontSize: '.72rem', fontWeight: 700, color: 'var(--pr-text-ter)',
        textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '10px',
      }}>
        レビューするサービスを選択 <span style={{ color: '#dc2626' }}>*</span>
      </div>
      <input
        type="text"
        placeholder="サービス名を入力して検索（例: Notion、ChatGPT）"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          width: '100%',
          background: 'var(--pr-bg)',
          border: '1px solid var(--pr-border)',
          borderRadius: '8px',
          padding: '10px 14px',
          fontSize: '.875rem',
          color: 'var(--pr-text-pri)',
          outline: 'none',
          fontFamily: 'inherit',
          boxSizing: 'border-box',
        }}
        autoFocus
      />
      {loading && (
        <p style={{ fontSize: '.8rem', color: 'var(--pr-text-ter)', marginTop: '8px' }}>検索中…</p>
      )}
      {results.length > 0 && (
        <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0 0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {results.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => onSelect(s.id, s.name)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: 'var(--pr-bg)',
                  border: '1px solid var(--pr-border)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'border-color .15s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--pr-accent)')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--pr-border)')}
              >
                <span style={{ fontSize: '.875rem', fontWeight: 600, color: 'var(--pr-text-pri)' }}>{s.name}</span>
                <span style={{ fontSize: '.75rem', color: 'var(--pr-text-ter)' }}>{s.category.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {query.length >= 2 && !loading && results.length === 0 && (
        <p style={{ fontSize: '.8rem', color: 'var(--pr-text-ter)', marginTop: '8px' }}>
          見つかりませんでした。別のキーワードで試してください。
        </p>
      )}
      {query.length > 0 && query.length < 2 && (
        <p style={{ fontSize: '.8rem', color: 'var(--pr-text-ter)', marginTop: '6px' }}>
          2文字以上入力してください
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// NewReviewForm
// ---------------------------------------------------------------------------
function NewReviewForm() {
  const searchParams = useSearchParams();
  const initServiceId   = searchParams.get("serviceId") ?? "";
  const initServiceName = searchParams.get("serviceName") ?? "";

  const [selectedServiceId,   setSelectedServiceId]   = useState(initServiceId);
  const [selectedServiceName, setSelectedServiceName] = useState(initServiceName);
  const [scores,       setScores]       = useState({ overall: 0, usability: 0, value: 0, support: 0 });
  const [body,         setBody]         = useState("");
  const [pros,         setPros]         = useState("");
  const [cons,         setCons]         = useState("");
  const [submitted,    setSubmitted]    = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSelectService = (id: string, name: string) => {
    setSelectedServiceId(id);
    setSelectedServiceName(name);
    setErrorMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!selectedServiceId) {
      setErrorMessage("レビューするサービスを選択してください");
      return;
    }
    if (scores.overall === 0 || scores.usability === 0 || scores.value === 0 || scores.support === 0) {
      setErrorMessage("すべての評価項目を選択してください");
      return;
    }

    let finalBody = body.trim();
    if (pros.trim()) finalBody += `\n\n【良い点】\n${pros.trim()}`;
    if (cons.trim()) finalBody += `\n\n【改善してほしい点】\n${cons.trim()}`;

    if (finalBody.length < 10) {
      setErrorMessage("レビュー本文を10文字以上入力してください");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: selectedServiceId,
          overall:   scores.overall,
          usability: scores.usability,
          value:     scores.value,
          support:   scores.support,
          body:      finalBody,
        }),
      });

      if (res.status === 401) {
        setErrorMessage("レビューを投稿するにはログインが必要です。ページ上部からログインしてください");
        return;
      }
      if (res.status === 409) {
        setErrorMessage("このサービスにはすでにレビューを投稿済みです");
        return;
      }
      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setErrorMessage(data.error ?? "投稿に失敗しました。もう一度お試しください");
        return;
      }

      setSubmitted(true);
    } catch {
      setErrorMessage("通信エラーが発生しました。もう一度お試しください");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="pr-page" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
          <div style={{ textAlign: 'center', maxWidth: '360px' }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '50%',
              background: 'rgba(22,163,74,.08)', border: '1px solid rgba(22,163,74,.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px',
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

  const inputStyle: React.CSSProperties = {
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
    boxSizing: 'border-box',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '.82rem',
    fontWeight: 600,
    color: 'var(--pr-text-pri)',
    marginBottom: '6px',
  };

  const sectionStyle: React.CSSProperties = {
    background: 'var(--pr-surface)',
    border: '1px solid var(--pr-border)',
    borderRadius: '12px',
    padding: '16px 20px',
  };

  return (
    <div className="pr-page">
      <Header />

      <main style={{ background: 'var(--pr-bg)', minHeight: '100vh' }}>
        <div className="pr-container" style={{ paddingTop: '20px', paddingBottom: '60px', maxWidth: '640px' }}>

          {/* パンくず */}
          <nav style={{
            fontSize: '.78rem', color: 'var(--pr-text-ter)',
            marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px',
          }}>
            <Link href="/" className="pr-breadcrumb-link">ホーム</Link>
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

            {/* サービス選択 */}
            {selectedServiceId ? (
              <div style={{
                ...sectionStyle,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '12px',
              }}>
                <div>
                  <div style={{ fontSize: '.72rem', fontWeight: 700, color: 'var(--pr-text-ter)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '4px' }}>
                    レビュー対象
                  </div>
                  <div style={{ fontSize: '.95rem', fontWeight: 700, color: 'var(--pr-text-pri)' }}>
                    {selectedServiceName || selectedServiceId}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => { setSelectedServiceId(""); setSelectedServiceName(""); }}
                  style={{
                    flexShrink: 0,
                    fontSize: '.78rem',
                    color: 'var(--pr-text-ter)',
                    background: 'none',
                    border: '1px solid var(--pr-border)',
                    borderRadius: '6px',
                    padding: '4px 10px',
                    cursor: 'pointer',
                  }}
                >
                  変更
                </button>
              </div>
            ) : (
              <ServiceSelector onSelect={handleSelectService} />
            )}

            {/* 評価スコア */}
            <div style={sectionStyle}>
              <div style={{
                fontSize: '.72rem', fontWeight: 700, color: 'var(--pr-text-ter)',
                textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: '4px',
              }}>
                評価スコア
              </div>
              <StarInput label="総合評価" value={scores.overall} onChange={(v) => setScores({ ...scores, overall: v })} />
              <StarInput label="使いやすさ" value={scores.usability} onChange={(v) => setScores({ ...scores, usability: v })} />
              <StarInput label="コスパ" value={scores.value} onChange={(v) => setScores({ ...scores, value: v })} />
              <StarInput label="サポート" value={scores.support} onChange={(v) => setScores({ ...scores, support: v })} />
            </div>

            {/* レビュー本文 */}
            <div style={sectionStyle}>
              <label style={labelStyle}>
                レビュー本文 <span style={{ color: '#dc2626' }}>*</span>
              </label>
              <textarea
                rows={5}
                placeholder="実際に使ってみた感想を書いてください。具体的に書くと他のユーザーの参考になります。"
                style={{ ...inputStyle, resize: 'none' }}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                required
                minLength={10}
                maxLength={2000}
              />
              <div style={{ fontSize: '.72rem', color: 'var(--pr-text-ter)', marginTop: '6px', textAlign: 'right' }}>
                {body.length} / 2000
              </div>
            </div>

            {/* 良い点・改善点 */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div style={sectionStyle}>
                <label style={labelStyle}>良い点（任意）</label>
                <textarea
                  rows={3}
                  placeholder="特に良かった点"
                  style={{ ...inputStyle, resize: 'none' }}
                  value={pros}
                  onChange={(e) => setPros(e.target.value)}
                  maxLength={500}
                />
              </div>
              <div style={sectionStyle}>
                <label style={labelStyle}>改善してほしい点（任意）</label>
                <textarea
                  rows={3}
                  placeholder="気になった点"
                  style={{ ...inputStyle, resize: 'none' }}
                  value={cons}
                  onChange={(e) => setCons(e.target.value)}
                  maxLength={500}
                />
              </div>
            </div>

            {/* エラーメッセージ */}
            {errorMessage && (
              <div style={{
                padding: '10px 14px',
                background: 'rgba(220,38,38,.06)',
                border: '1px solid rgba(220,38,38,.25)',
                borderRadius: '8px',
                fontSize: '.82rem',
                color: '#dc2626',
              }}>
                {errorMessage}
              </div>
            )}

            {/* 送信ボタン */}
            <button
              type="submit"
              className="pr-btn-primary"
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '11px',
                borderRadius: '8px',
                fontSize: '.875rem',
                fontWeight: 600,
                justifyContent: 'center',
                opacity: isSubmitting ? 0.6 : 1,
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
              }}
            >
              {isSubmitting ? "投稿中..." : "レビューを投稿する"}
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

      <footer className="pr-footer">
        <div className="pr-container">
          <div className="pr-footer-grid">
            <div>
              <Link href="/" className="pr-footer-logo">
                <span className="pr-logo-icon">P</span>
                Plainrank
              </Link>
              <p className="pr-footer-tagline">
                
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

export default function NewReviewPage() {
  return (
    <Suspense>
      <NewReviewForm />
    </Suspense>
  );
}
