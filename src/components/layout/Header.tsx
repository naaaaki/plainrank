import Link from 'next/link';
import SearchBar from './SearchBar';
import NavLinks from './NavLinks';
import { auth } from '@/auth';

export default async function Header() {
  const session = await auth();
  const isLoggedIn = !!session?.user?.id;

  return (
    <header className="pr-header">
      <div className="pr-container">
        <div className="pr-header-inner">
          <Link href="/" className="pr-logo">
            <span className="pr-logo-icon">P</span>
            Plainrank
          </Link>
          <SearchBar />
          <NavLinks isLoggedIn={isLoggedIn} />
        </div>
      </div>
    </header>
  );
}
