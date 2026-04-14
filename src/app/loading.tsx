/**
 * ページ遷移中に表示されるスケルトンUI。
 * ヘッダーは layout.tsx で維持されるため、コンテンツ部分のみ表示する。
 */
export default function Loading() {
  return (
    <main style={{ background: 'var(--pr-bg)', minHeight: '100vh' }}>
      <div className="pr-container" style={{ paddingTop: '24px', paddingBottom: '60px' }}>
        {/* タイトルスケルトン */}
        <div style={{
          height: '28px',
          width: '200px',
          background: 'var(--pr-surface-2)',
          borderRadius: '8px',
          marginBottom: '20px',
          animation: 'pr-skeleton-pulse 1.4s ease-in-out infinite',
        }} />

        {/* カードスケルトン × 6 */}
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} style={{
            height: '80px',
            background: 'var(--pr-surface)',
            border: '1px solid var(--pr-border)',
            borderRadius: '12px',
            marginBottom: '10px',
            animation: `pr-skeleton-pulse 1.4s ease-in-out ${i * 0.08}s infinite`,
          }} />
        ))}

        <style>{`
          @keyframes pr-skeleton-pulse {
            0%, 100% { opacity: 1; }
            50%       { opacity: 0.5; }
          }
        `}</style>
      </div>
    </main>
  );
}
