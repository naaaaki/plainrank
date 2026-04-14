import Link from 'next/link';
import SearchBar from './SearchBar';
import NavLinks from './NavLinks';

/**
 * サイト共通ヘッダー。
 * セッション確認は NavLinks 内で useSession()（クライアントサイド）で行う。
 * auth() を呼ばないためページが静的配信（CDN）される。
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
          <NavLinks />
        </div>
      </div>
    </header>
  );
}
