/**
 * NavLinksServer のローディング中に表示するフォールバック。
 * auth() が解決するまでの間、ログインボタンのプレースホルダーを表示する。
 */
export default function NavLinksFallback() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{
        width: '72px',
        height: '32px',
        borderRadius: '8px',
        background: 'var(--pr-surface)',
        opacity: 0.5,
      }} />
    </div>
  );
}
