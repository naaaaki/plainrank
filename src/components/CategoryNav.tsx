'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';

const CATEGORIES = [
  { href: '/',                    label: 'すべて',             color: '#4361ee' },
  { href: '/ai-tools',            label: 'AIツール',           color: '#4361ee' },
  { href: '/dev-tools',           label: '開発ツール',         color: '#16a34a' },
  { href: '/design-tools',        label: 'デザインツール',     color: '#7c3aed' },
  { href: '/marketing',           label: 'マーケSaaS',         color: '#b45309' },
  { href: '/productivity',        label: '生産性',             color: '#dc2626' },
  { href: '/security',            label: 'セキュリティ',       color: '#059669' },
  { href: '/mobile-apps',         label: 'モバイル',           color: '#0d9488' },
  { href: '/communication',       label: 'コミュニケーション', color: '#8b5cf6' },
  { href: '/analytics',           label: '分析・BI',           color: '#ea580c' },
  { href: '/project-management',  label: 'プロジェクト管理',   color: '#4338ca' },
  { href: '/hr-tools',            label: 'HR・採用',           color: '#db2777' },
];

export default function CategoryNav({ activeHref = '/' }: { activeHref?: string }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const [itemWidth, setItemWidth] = useState(0);

  // 1セット分の幅を計測してCSSアニメーション量を設定
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const measure = () => {
      const half = el.scrollWidth / 2;
      setItemWidth(half);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // リストを2回繰り返してシームレスループ
  const items = [...CATEGORIES, ...CATEGORIES];

  return (
    <nav className="pr-cat-nav">
      <div
        className="pr-cat-ticker-wrap"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div
          ref={trackRef}
          className="pr-cat-ticker-track"
          style={{
            animationDuration: `${CATEGORIES.length * 2.2}s`,
            animationPlayState: paused ? 'paused' : 'running',
            '--ticker-shift': itemWidth ? `${itemWidth}px` : '0px',
          } as React.CSSProperties}
        >
          {items.map(({ href, label, color }, i) => (
            <Link
              key={`${href}-${i}`}
              href={href}
              className={`pr-cat-nav-item${activeHref === href ? ' active' : ''}`}
            >
              <span className="pr-cat-nav-dot" style={{ background: color }} />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
