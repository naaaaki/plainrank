import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ category: string }>;
}

const MOCK_CATEGORIES: Record<string, {
  name: string;
  description: string;
  services: { name: string; slug: string; score: number; reviewCount: number; description: string }[];
}> = {
  "ai-tools": {
    name: "AIツール",
    description: "ChatGPT・Claude・Geminiなど、生成AIアシスタントから特化型ツールまで",
    services: [
      { name: "ChatGPT", slug: "chatgpt", score: 4.6, reviewCount: 1204, description: "OpenAIが提供する汎用AIアシスタント" },
      { name: "Claude", slug: "claude", score: 4.5, reviewCount: 742, description: "Anthropicが開発するAIアシスタント" },
    ],
  },
  "dev-tools": {
    name: "開発ツール",
    description: "エンジニア・開発チーム向けのプロジェクト管理・コラボレーションツール",
    services: [
      { name: "Linear", slug: "linear", score: 4.8, reviewCount: 538, description: "シンプルで高速なプロジェクト管理ツール" },
      { name: "Notion", slug: "notion", score: 4.3, reviewCount: 1893, description: "ノート・Wiki・タスク管理を統合したワークスペース" },
    ],
  },
  "design-tools": {
    name: "デザインツール",
    description: "UI/UXデザイン・プロトタイピング・グラフィック制作ツール",
    services: [
      { name: "Figma", slug: "figma", score: 4.7, reviewCount: 921, description: "ブラウザベースのUIデザインツール" },
    ],
  },
  "marketing": {
    name: "マーケSaaS",
    description: "マーケティング・分析・広告運用に特化したSaaSツール",
    services: [],
  },
};

function StarRating({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i <= Math.round(score) ? "text-amber-400" : "text-gray-200"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function scoreColor(score: number) {
  if (score >= 4.5) return "text-green-600";
  if (score >= 3.5) return "text-amber-600";
  return "text-red-500";
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const data = MOCK_CATEGORIES[category];
  if (!data) notFound();

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

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* パンくず */}
        <nav className="text-sm text-gray-400 mb-6 flex items-center gap-2">
          <Link href="/" className="hover:text-[#2563EB] transition-colors">ホーム</Link>
          <span>/</span>
          <span className="text-[#1E293B]">{data.name}</span>
        </nav>

        {/* カテゴリ見出し */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-[#1E293B] mb-2">{data.name}</h1>
          <p className="text-gray-500">{data.description}</p>
        </div>

        {/* サービス一覧 */}
        {data.services.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg">まだサービスが登録されていません</p>
            <p className="text-sm mt-2">近日公開予定です</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {data.services.map((service, i) => (
              <Link
                key={service.slug}
                href={`/${category}/${service.slug}`}
                className="group bg-white border border-gray-100 rounded-xl px-6 py-5 hover:border-[#2563EB] hover:shadow-sm transition-all flex items-center gap-6"
              >
                {/* 順位 */}
                <div className="text-2xl font-bold text-gray-200 w-8 shrink-0 text-center">
                  {i + 1}
                </div>

                {/* サービス情報 */}
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-semibold text-[#1E293B] group-hover:text-[#2563EB] transition-colors">
                    {service.name}
                  </h2>
                  <p className="text-sm text-gray-500 mt-0.5 truncate">{service.description}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <StarRating score={service.score} />
                    <span className="text-xs text-gray-400">{service.reviewCount.toLocaleString()} 件</span>
                  </div>
                </div>

                {/* スコア */}
                <div className="shrink-0 text-right">
                  <div className={`text-3xl font-bold tabular-nums ${scoreColor(service.score)}`}>
                    {service.score.toFixed(1)}
                  </div>
                  <div className="text-xs text-gray-400">/5.0</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* フッター */}
      <footer className="border-t border-gray-100 py-6 px-6 mt-12">
        <div className="max-w-6xl mx-auto flex items-center justify-end">
          <nav className="flex items-center gap-6 text-sm text-gray-400">
            <Link href="/transparency" className="hover:text-[#2563EB] transition-colors">透明性ポリシー</Link>
            <Link href="/about" className="hover:text-[#2563EB] transition-colors">About</Link>
            <a href="https://github.com/naaaaki/plainrank" target="_blank" rel="noopener noreferrer" className="hover:text-[#2563EB] transition-colors">GitHub</a>
          </nav>
        </div>
      </footer>
    </main>
  );
}
