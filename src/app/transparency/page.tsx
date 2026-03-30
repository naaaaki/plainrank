import Link from "next/link";

export default function TransparencyPage() {
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
          <span className="text-[#1E293B]">透明性ポリシー</span>
        </nav>

        <h1 className="text-4xl font-bold text-[#1E293B] mb-4">透明性ポリシー</h1>
        <p className="text-gray-500 mb-12 text-lg leading-relaxed">
          Plainrankはクリーンな評価サイトを作りたいという思いから生まれました。
          「クリーンと謳いたい」のではなく、実態としてクリーンにする。すべての仕組みをここに公開します。
        </p>

        {/* スコア計算式 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#1E293B] mb-4">スコアの計算方法</h2>
          <p className="text-gray-500 mb-6 leading-relaxed">
            スコアは4つの軸の重み付き平均をベースに、レビュー数が少ない場合のノイズを抑えるベイズ平均で補正しています。
            計算式はコードとともにGitHubで公開しています。
          </p>

          <div className="bg-[#F8FAFC] border border-gray-200 rounded-xl p-6 mb-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">重み付き平均</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "総合評価 (overall)", weight: "50%" },
                { label: "使いやすさ (usability)", weight: "20%" },
                { label: "コスパ (value)", weight: "20%" },
                { label: "サポート (support)", weight: "10%" },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between bg-white border border-gray-100 rounded-lg px-4 py-3">
                  <span className="text-sm text-gray-600">{item.label}</span>
                  <span className="text-sm font-bold text-[#2563EB]">{item.weight}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#F8FAFC] border border-gray-200 rounded-xl p-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">ベイズ平均補正</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              レビューが少ないサービスのスコアが極端にならないよう、事前スコア 3.0・事前件数 5件を使ったベイズ平均で補正しています。
              レビューが増えるほど実際の評価に近づきます。
            </p>
            <div className="mt-3 font-mono text-sm bg-white border border-gray-100 rounded-lg px-4 py-3 text-gray-600">
              score = (5 × 3.0 + n × weighted) / (5 + n)
            </div>
          </div>

          <div className="mt-4">
            <a
              href="https://github.com/naaaaki/plainrank/blob/main/src/lib/score.ts"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#2563EB] font-medium hover:underline"
            >
              GitHubでコードを見る →
            </a>
          </div>
        </section>

        {/* 不正対策 */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#1E293B] mb-4">不正レビュー対策</h2>
          <div className="flex flex-col gap-4">
            {[
              {
                title: "GitHub / Googleアカウント認証必須",
                description: "捨てアカウントによるスパムを防ぐため、ソーシャルアカウントによる認証を必須としています。",
              },
              {
                title: "1アカウント・1サービス・1レビューのみ",
                description: "同じユーザーが同じサービスに複数回レビューを投稿することはできません。",
              },
              {
                title: "コミュニティフラグ機能",
                description: "怪しいレビューを他のユーザーが報告できます。一定数のフラグが立ったレビューはモデレーター確認待ちになります。",
              },
              {
                title: "スポンサー・アフィリエイト排除",
                description: "金銭的な関係がランキングやスコアに影響することは一切ありません。スポンサー契約・広告掲載は行いません。",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 bg-[#F8FAFC] border border-gray-200 rounded-xl p-5">
                <div className="w-6 h-6 rounded-full bg-[#2563EB] flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-[#1E293B] mb-1">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* OSSについて */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-[#1E293B] mb-4">オープンソース</h2>
          <p className="text-gray-500 leading-relaxed mb-4">
            Plainrankのコードはすべてオープンソースとして公開しています。スコア計算・不正検知・ランキングロジックをだれでも確認・検証できます。
          </p>
          <a
            href="https://github.com/naaaaki/plainrank"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white bg-[#1E293B] hover:bg-[#0F172A] px-5 py-2.5 rounded-lg transition-colors"
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12" />
            </svg>
            GitHubで見る
          </a>
        </section>
      </div>

      {/* フッター */}
      <footer className="border-t border-gray-100 py-6 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-end">
          <nav className="flex items-center gap-6 text-sm text-gray-400">
            <Link href="/transparency" className="text-[#2563EB]">透明性ポリシー</Link>
            <Link href="/about" className="hover:text-[#2563EB] transition-colors">About</Link>
            <a href="https://github.com/naaaaki/plainrank" target="_blank" rel="noopener noreferrer" className="hover:text-[#2563EB] transition-colors">GitHub</a>
          </nav>
        </div>
      </footer>
    </main>
  );
}
