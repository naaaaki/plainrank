import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-[#1E293B]">
      {/* ヘッダー */}
      <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center gap-4">
          <Link href="/" className="text-xl font-bold text-[#2563EB] shrink-0">
            Plainrank
          </Link>
          <div className="flex-1" />
          <Link
            href="/auth/signin"
            className="text-sm font-medium px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shrink-0"
          >
            ログイン
          </Link>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 py-16">
        <nav className="text-sm text-gray-400 mb-8 flex items-center gap-2">
          <Link href="/" className="hover:text-[#2563EB] transition-colors">ホーム</Link>
          <span>/</span>
          <span className="text-[#1E293B]">About</span>
        </nav>

        <h1 className="text-4xl font-bold text-[#1E293B] mb-4">Plainrankについて</h1>
        <p className="text-gray-500 text-lg leading-relaxed mb-16">
          アフィリエイトやスポンサーで歪んだレビューサイトをクリーンにしたい。それだけです。
        </p>

        {/* なぜ作ったか */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-[#1E293B] mb-4">なぜ作ったか</h2>
          <div className="text-gray-500 leading-relaxed space-y-4">
            <p>
              ツールを探すとき、検索結果に出てくるレビューサイトのほとんどがアフィリエイト収入で成り立っています。
              高評価をつけるほど収入が上がる仕組みなら、正直な評価は期待できません。
            </p>
            <p>
              Plainrankはそれをやめました。スポンサー契約なし、アフィリエイトなし。
              スコア計算式はコードごと公開して、だれでも検証できるようにしています。
            </p>
          </div>
        </section>

        {/* 3つの約束 */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-[#1E293B] mb-6">3つの約束</h2>
          <div className="flex flex-col gap-4">
            {[
              {
                number: "01",
                title: "スポンサーなし",
                description: "金銭的な関係がスコアやランキングに影響することは一切ありません。掲載料・広告費は受け取りません。",
              },
              {
                number: "02",
                title: "計算式を公開",
                description: "スコアがどうやって決まるか、コードレベルで公開しています。ブラックボックスは一切ありません。",
              },
              {
                number: "03",
                title: "削除履歴も公開",
                description: "レビューを削除・非表示にした場合、その記録を残します。都合の悪いレビューを消すことはしません。",
              },
            ].map((item) => (
              <div key={item.number} className="flex gap-5 bg-[#F8FAFC] border border-gray-200 rounded-xl p-6">
                <div className="text-3xl font-bold text-gray-100 shrink-0 w-10">{item.number}</div>
                <div>
                  <h3 className="text-lg font-semibold text-[#1E293B] mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* OSSとして */}
        <section className="mb-14">
          <h2 className="text-2xl font-bold text-[#1E293B] mb-4">オープンソースプロジェクト</h2>
          <p className="text-gray-500 leading-relaxed mb-6">
            Plainrankのコードはすべてオープンソース（MITライセンス）で公開しています。
            バグ報告・機能提案・プルリクエスト、何でも歓迎です。
          </p>
          <a
            href="https://github.com/naaaaki/plainrank"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-[#1E293B] hover:bg-[#0F172A] px-5 py-2.5 rounded-lg transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" />
            </svg>
            GitHub / plainrank
          </a>
        </section>

        {/* リンク */}
        <div className="border-t border-gray-100 pt-8">
          <Link href="/transparency" className="text-sm text-[#2563EB] font-medium hover:underline">
            透明性ポリシーを詳しく見る →
          </Link>
        </div>
      </div>

      {/* フッター */}
      <footer className="border-t border-gray-100 py-6 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-end">
          <nav className="flex items-center gap-6 text-sm text-gray-400">
            <Link href="/transparency" className="hover:text-[#2563EB] transition-colors">透明性ポリシー</Link>
            <Link href="/about" className="text-[#2563EB]">About</Link>
            <a href="https://github.com/naaaaki/plainrank" target="_blank" rel="noopener noreferrer" className="hover:text-[#2563EB] transition-colors">GitHub</a>
          </nav>
        </div>
      </footer>
    </main>
  );
}
