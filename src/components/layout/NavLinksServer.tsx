import { auth } from '@/auth';
import NavLinks from './NavLinks';

/**
 * auth() を呼び出すサーバーコンポーネント。
 * Header 内で Suspense に包んで使うことで、認証チェックをページ描画と並行して行う。
 */
export default async function NavLinksServer() {
  const session = await auth();
  const isLoggedIn = !!session?.user?.id;
  return <NavLinks isLoggedIn={isLoggedIn} />;
}
