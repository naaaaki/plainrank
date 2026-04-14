import type { Metadata } from 'next';
import Link from 'next/link';
export const metadata: Metadata = {
  title: 'お問い合わせ | Plainrank',
  description: 'Plainrankへのお問い合わせページです。ご質問・ご意見はメールにてご連絡ください。',
};

export default function ContactPage() {
  return (
    <div className="pr-page">
      <main style={{ background: 'var(--pr-bg)', minHeight: '100vh' }}>
        <div className="pr-container" style={{ paddingTop: '40px', paddingBottom: '80px', maxWidth: '640px' }}>

          {/* パンくず */}
          <nav style={{
            fontSize: '.78rem',
            color: 'var(--pr-text-ter)',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <Link href="/" className="pr-breadcrumb-link">ホーム</Link>
            <span>›</span>
            <span style={{ color: 'var(--pr-text-pri)' }}>お問い合わせ</span>
          </nav>

          <h1 style={{
            fontSize: '1.7rem',
            fontWeight: 700,
            color: 'var(--pr-text-pri)',
            letterSpacing: '-.03em',
            marginBottom: '12px',
          }}>
            お問い合わせ
          </h1>
          <p style={{ fontSize: '.9rem', color: 'var(--pr-text-sec)', lineHeight: 1.8, marginBottom: '40px' }}>
            Plainrankへのご質問・ご意見・不具合報告などは、以下のメールアドレスまでお気軽にご連絡ください。
          </p>

          {/* メール連絡先カード */}
          <div style={{
            background: 'var(--pr-surface)',
            border: '1px solid var(--pr-border)',
            borderRadius: '12px',
            padding: '32px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
            alignItems: 'flex-start',
          }}>
            <div style={{ fontSize: '.8rem', color: 'var(--pr-text-ter)', fontWeight: 600, letterSpacing: '.05em', textTransform: 'uppercase' }}>
              メールアドレス
            </div>
            <a
              href="mailto:dino.spike.web3@gmail.com"
              style={{
                fontSize: '1.15rem',
                fontWeight: 700,
                color: 'var(--pr-accent)',
                textDecoration: 'none',
                letterSpacing: '-.01em',
              }}
            >
              dino.spike.web3@gmail.com
            </a>
            <p style={{ fontSize: '.85rem', color: 'var(--pr-text-ter)', lineHeight: 1.7, margin: 0 }}>
              通常2〜3営業日以内にご返信します。
            </p>
          </div>

          {/* よくある問い合わせ内容 */}
          <div style={{ marginTop: '40px' }}>
            <h2 style={{
              fontSize: '1rem',
              fontWeight: 700,
              color: 'var(--pr-text-pri)',
              marginBottom: '16px',
            }}>
              よくあるお問い合わせ内容
            </h2>
            <ul style={{
              fontSize: '.88rem',
              color: 'var(--pr-text-sec)',
              lineHeight: 1.8,
              paddingLeft: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}>
              <li>レビューの削除・修正依頼</li>
              <li>サービス掲載に関するご依頼（※スポンサー掲載はお断りしています）</li>
              <li>不正レビューの報告</li>
              <li>アカウントに関するご質問</li>
              <li>バグ・不具合の報告</li>
              <li>プライバシーポリシーに関するご質問</li>
            </ul>
          </div>

          {/* 関連リンク */}
          <div style={{
            marginTop: '40px',
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
          }}>
            <Link href="/guidelines" style={{
              fontSize: '.83rem',
              color: 'var(--pr-accent)',
              textDecoration: 'none',
              border: '1px solid var(--pr-border)',
              borderRadius: '8px',
              padding: '8px 14px',
              background: 'var(--pr-surface)',
            }}>
              レビューガイドライン →
            </Link>
            <Link href="/privacy" style={{
              fontSize: '.83rem',
              color: 'var(--pr-accent)',
              textDecoration: 'none',
              border: '1px solid var(--pr-border)',
              borderRadius: '8px',
              padding: '8px 14px',
              background: 'var(--pr-surface)',
            }}>
              プライバシーポリシー →
            </Link>
            <Link href="/terms" style={{
              fontSize: '.83rem',
              color: 'var(--pr-accent)',
              textDecoration: 'none',
              border: '1px solid var(--pr-border)',
              borderRadius: '8px',
              padding: '8px 14px',
              background: 'var(--pr-surface)',
            }}>
              利用規約 →
            </Link>
          </div>

        </div>
      </main>

      {/* フッター */}
      <footer className="pr-footer">
        <div className="pr-container">
          <div className="pr-footer-grid">
            <div>
              <Link href="/" className="pr-footer-logo">
                <span className="pr-logo-icon">P</span>
                Plainrank
              </Link>
              <p className="pr-footer-tagline">
                忖度なしの、レビューサイト。
              </p>
            </div>
            <div>
              <div className="pr-footer-col-title">サービス</div>
              <ul className="pr-footer-links">
                <li><Link href="/categories">カテゴリ一覧</Link></li>
                <li><Link href="/compare">ツール比較</Link></li>
                <li><Link href="/ranking">総合ランキング</Link></li>
              </ul>
            </div>
            <div>
              <div className="pr-footer-col-title">ポリシー</div>
              <ul className="pr-footer-links">
                <li><Link href="/transparency">透明性ポリシー</Link></li>
                <li><Link href="/guidelines">レビューガイドライン</Link></li>
                <li><Link href="/privacy">プライバシーポリシー</Link></li>
                <li><Link href="/terms">利用規約</Link></li>
              </ul>
            </div>
            <div>
              <div className="pr-footer-col-title">コミュニティ</div>
              <ul className="pr-footer-links">
                <li><Link href="/reviews/new">レビューを投稿</Link></li>
                <li><Link href="/about">運営チーム</Link></li>
                <li><Link href="/contact">お問い合わせ</Link></li>
              </ul>
            </div>
          </div>
          <div className="pr-footer-bottom">
            <span className="pr-footer-copy">© 2026 Plainrank</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
