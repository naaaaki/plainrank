'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { SearchResultItem } from '@/app/api/search/route';

// ---------------------------------------------------------------------------
// 定数
// ---------------------------------------------------------------------------

/** debounce 待機時間（ms） */
const DEBOUNCE_MS = 300;

/** 検索を発火させる最小文字数 */
const MIN_QUERY_LENGTH = 2;

// ---------------------------------------------------------------------------
// SearchBar コンポーネント
// ---------------------------------------------------------------------------

/**
 * ヘッダー用検索バー。
 * - ユーザー入力を 300ms debounce して /api/search へ fetch する
 * - 結果をドロップダウンで表示し、クリックで該当ページへ遷移する
 * - `/` キーでフォーカスを移動する
 * - フォーカスが外れるとドロップダウンを閉じる
 */
export default function SearchBar() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ---------------------------------------------------------------------------
  // 検索実行
  // ---------------------------------------------------------------------------

  const search = useCallback(async (q: string) => {
    if (q.length < MIN_QUERY_LENGTH) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
      if (!res.ok) throw new Error('Search request failed');
      const data: { results: SearchResultItem[] } = await res.json() as { results: SearchResultItem[] };
      setResults(data.results);
      setIsOpen(true);
    } catch {
      // ネットワークエラーなどはサイレントに処理する
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ---------------------------------------------------------------------------
  // 入力ハンドラ（debounce 付き）
  // ---------------------------------------------------------------------------

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (debounceTimerRef.current !== null) {
      clearTimeout(debounceTimerRef.current);
    }
    debounceTimerRef.current = setTimeout(() => {
      void search(value);
    }, DEBOUNCE_MS);
  };

  // ---------------------------------------------------------------------------
  // 結果クリック
  // ---------------------------------------------------------------------------

  const handleSelect = (item: SearchResultItem) => {
    setIsOpen(false);
    setQuery('');
    router.push(`/${item.category.slug}/${item.slug}`);
  };

  // ---------------------------------------------------------------------------
  // `/` キーでフォーカス
  // ---------------------------------------------------------------------------

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // テキスト入力中は無視する
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // ---------------------------------------------------------------------------
  // フォーカスアウト → ドロップダウンを閉じる
  // ---------------------------------------------------------------------------

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ---------------------------------------------------------------------------
  // クリーンアップ（debounce タイマー）
  // ---------------------------------------------------------------------------

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current !== null) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // ---------------------------------------------------------------------------
  // スコア表示（小数点1桁）
  // ---------------------------------------------------------------------------

  const formatScore = (score: number) => score.toFixed(1);

  // ---------------------------------------------------------------------------
  // レンダリング
  // ---------------------------------------------------------------------------

  return (
    <div className="pr-header-search" ref={containerRef}>
      <span className="pr-search-icon">🔍</span>
      <input
        ref={inputRef}
        type="text"
        placeholder="ツール・SaaS・AIを検索..."
        value={query}
        onChange={handleChange}
        onFocus={() => {
          if (results.length > 0) setIsOpen(true);
        }}
        aria-label="サービスを検索"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        autoComplete="off"
      />
      {/* `/` キーヒント：入力中は非表示 */}
      {!query && <span className="pr-search-kbd">/</span>}

      {/* ドロップダウン */}
      {isOpen && (
        <div className="pr-search-dropdown" role="listbox" aria-label="検索結果">
          {isLoading && (
            <div className="pr-search-dropdown-empty">検索中...</div>
          )}

          {!isLoading && results.length === 0 && (
            <div className="pr-search-dropdown-empty">見つかりませんでした</div>
          )}

          {!isLoading && results.map((item) => (
            <button
              key={item.id}
              type="button"
              className="pr-search-dropdown-item"
              role="option"
              aria-selected={false}
              onClick={() => handleSelect(item)}
            >
              <div className="pr-search-dropdown-item-main">
                <span className="pr-search-dropdown-item-name">{item.name}</span>
                <span className="pr-search-dropdown-item-category">{item.category.name}</span>
              </div>
              <span className="pr-search-dropdown-item-score">
                ★ {formatScore(item.score)}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
