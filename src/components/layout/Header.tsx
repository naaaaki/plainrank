import Link from 'next/link';
import SearchBar from './SearchBar';
import NavLinks from './NavLinks';
import { auth } from '@/auth';

export default async function Header() {
  const session = await auth();
  const isLoggedIn = !!session?.user?.id;
  const isAdmin = isLoggedIn && session.user?.email === process.env.ADMIN_EMAIL;

  return (
    <header className="pr-header">
      <div className="pr-container">
        <div className="pr-header-inner">
          <Link href="/" className="pr-logo">
            <span className="pr-logo-icon">P</span>
            Plainrank
          </Link>
          <SearchBar />
          <NavLinks isLoggedIn={isLoggedIn} isAdmin={isAdmin} />
        </div>
      </div>
    </header>
  );
}
