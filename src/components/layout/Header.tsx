import { Suspense } from 'react';
import Link from 'next/link';
import SearchBar from './SearchBar';
import NavLinksServer from './NavLinksServer';
import NavLinksFallback from './NavLinksFallback';

/**
 * サイト共通ヘッダー。
 *
 * auth() は NavLinksServer 内で呼び出し、Suspense で包むことでページ描画をブロックしない。
 * ロゴ・検索バーはすぐに表示され、ナビゲーションは認証解決後に差し込まれる。
 */
export default function Header() {
  return (
    <header className="pr-header">
      <div className="pr-container">
        <div className="pr-header-inner">
          <Link href="/" className="pr-logo">
            <span className="pr-logo-icon">P</span>
            Plainrank
          </Link>
          <SearchBar />
          <Suspense fallback={<NavLinksFallback />}>
            <NavLinksServer />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
