import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ category: string }>;
}

/**
 * カテゴリ一覧ページ
 * 指定カテゴリに属するサービスの一覧とスコアを表示する。
 * MVP段階ではモックデータを使用。本番ではDB取得に切り替える。
 */
export default async function CategoryPage({ params }: Props) {
  const { category } = await params;

  // TODO: DBからカテゴリ情報とサービス一覧を取得する
  const MOCK_CATEGORIES: Record<string, { name: string; services: { name: string; slug: string; score: number; reviewCount: number }[] }> = {
    "ai-tools": {
      name: "AI Tools",
      services: [
        { name: "ChatGPT", slug: "chatgpt", score: 4.6, reviewCount: 128 },
        { name: "Claude", slug: "claude", score: 4.8, reviewCount: 95 },
      ],
    },
    "saas": {
      name: "SaaS",
      services: [
        { name: "Notion", slug: "notion", score: 4.5, reviewCount: 210 },
        { name: "Linear", slug: "linear", score: 4.7, reviewCount: 83 },
      ],
    },
    "design-tools": {
      name: "Design Tools",
      services: [
        { name: "Figma", slug: "figma", score: 4.9, reviewCount: 312 },
      ],
    },
  };

  const categoryData = MOCK_CATEGORIES[category];
  if (!categoryData) notFound();

  return (
    <main className="max-w-4xl mx-auto py-12 px-6">
      <nav className="text-sm text-zinc-500 mb-6">
        <Link href="/" className="hover:text-zinc-900">ホーム</Link>
        <span className="mx-2">/</span>
        <span className="text-zinc-900">{categoryData.name}</span>
      </nav>

      <h1 className="text-3xl font-bold text-zinc-900 mb-8">{categoryData.name}</h1>

      <div className="space-y-4">
        {categoryData.services.map((service) => (
          <Link
            key={service.slug}
            href={`/${category}/${service.slug}`}
            className="flex items-center justify-between bg-white border border-zinc-200 rounded-xl px-6 py-5 hover:shadow-md transition-shadow"
          >
            <div>
              <h2 className="text-lg font-semibold text-zinc-900">{service.name}</h2>
              <p className="text-sm text-zinc-500">{service.reviewCount} 件のレビュー</p>
            </div>
            <div className="text-2xl font-bold text-zinc-900">
              {service.score.toFixed(1)}
              <span className="text-base font-normal text-zinc-400"> / 5.0</span>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
