/**
 * ページ遷移中に表示されるローディングUI。
 * Next.js App Router がルート変更時に自動で表示する。
 */
export default function Loading() {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '3px',
      zIndex: 9999,
      background: 'var(--pr-border)',
      overflow: 'hidden',
    }}>
      <div style={{
        height: '100%',
        background: 'var(--pr-accent)',
        animation: 'pr-loading-bar 1.2s ease-in-out infinite',
        transformOrigin: 'left center',
      }} />
      <style>{`
        @keyframes pr-loading-bar {
          0%   { transform: scaleX(0); margin-left: 0; }
          50%  { transform: scaleX(0.6); margin-left: 20%; }
          100% { transform: scaleX(0); margin-left: 100%; }
        }
      `}</style>
    </div>
  );
}
