'use client';

import { SessionProvider } from 'next-auth/react';

/**
 * クライアントサイドのセッション管理プロバイダー。
 * layout.tsx（サーバーコンポーネント）から auth() を取り除き、
 * セッション確認をクライアントサイドに委譲することで
 * 全ページを静的配信（CDN）可能にする。
 */
export default function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
