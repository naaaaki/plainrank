'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

export default function NavLinks() {
  const pathname = usePathname();
  const { status } = useSession();
  const isLoggedIn = status === 'authenticated';
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    pathname === href || (href !== '/' && pathname.startsWith(href));

  return (
    <>
      {/* ハンバーガーボタン（モバイルのみ表示） */}
      <button
        className="pr-hamburger"
        aria-label="メニューを開く"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
      >
        {open ? '✕' : '☰'}
      </button>

      {/* ナビリンク */}
      <nav className={`pr-header-nav${open ? ' open' : ''}`}>
        <Link
          href="/categories"
          className={`pr-btn-ghost${isActive('/categories') ? ' pr-nav-active' : ''}`}
          onClick={() => setOpen(false)}
        >
          カテゴリ
        </Link>
        <Link
          href="/ranking"
          className={`pr-btn-ghost${isActive('/ranking') ? ' pr-nav-active' : ''}`}
          onClick={() => setOpen(false)}
        >
          ランキング
        </Link>
        <Link
          href="/compare"
          className={`pr-btn-ghost${isActive('/compare') ? ' pr-nav-active' : ''}`}
          onClick={() => setOpen(false)}
        >
          比較する
        </Link>
        {isLoggedIn && (
          <Link
            href="/submit"
            className={`pr-btn-ghost${isActive('/submit') ? ' pr-nav-active' : ''}`}
            onClick={() => setOpen(false)}
          >
            サービスを登録
          </Link>
        )}
        <Link href="/reviews/new" className="pr-btn-outline" onClick={() => setOpen(false)}>
          レビューを書く
        </Link>
        {!isLoggedIn && status !== 'loading' && (
          <Link href="/auth/signin" className="pr-btn-primary" onClick={() => setOpen(false)}>
            ログイン
          </Link>
        )}
      </nav>
    </>
  );
}
