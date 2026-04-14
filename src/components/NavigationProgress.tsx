'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

/**
 * ページ遷移時にページ上部に表示されるプログレスバー。
 * 既存のページコンテンツを残したまま上に重なるため、白画面にならない。
 */
export default function NavigationProgress() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [width, setWidth] = useState(0);
  const prevPathname = useRef(pathname);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // リンクのクリックを検知してプログレスバーを開始
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;
      const href = target.getAttribute('href');
      // 外部リンク・アンカーリンクはスキップ
      if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto')) return;

      setVisible(true);
      setWidth(10);

      // ゆっくり進むアニメーション（90%で止まる）
      let current = 10;
      intervalRef.current = setInterval(() => {
        current = Math.min(current + Math.random() * 8, 88);
        setWidth(current);
      }, 150);
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  // pathname が変わったら完了アニメーション
  useEffect(() => {
    if (pathname === prevPathname.current) return;
    prevPathname.current = pathname;

    if (intervalRef.current) clearInterval(intervalRef.current);
    setWidth(100);

    timerRef.current = setTimeout(() => {
      setVisible(false);
      setWidth(0);
    }, 300);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [pathname]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: `${width}%`,
        height: '3px',
        background: 'var(--pr-accent)',
        zIndex: 9999,
        transition: width === 100 ? 'width 0.2s ease-out' : 'width 0.15s ease',
        pointerEvents: 'none',
      }}
    />
  );
}
