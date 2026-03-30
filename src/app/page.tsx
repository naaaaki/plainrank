import Link from 'next/link';
import { Search } from 'lucide-react';

const categories = [
  { name: 'AIツール', slug: 'ai-tools', count: 142, trending: true },
  { name: '開発ツール', slug: 'dev-tools', count: 98, trending: true },
  { name: 'デザインツール', slug: 'design-tools', count: 64, trending: false },
  { name: 'マーケSaaS', slug: 'marketing', count: 51, trending: false },
];

const services = [
  { name: 'ChatGPT', slug: 'chatgpt', category: 'ai-tools', categoryLabel: 'AIツール', score: 4.6, reviewCount: 1204 },
  { name: 'Linear', slug: 'linear', category: 'dev-tools', categoryLabel: '開発ツール', score: 4.8, reviewCount: 538 },
  { name: 'Figma', slug: 'figma', category: 'design-tools', categoryLabel: 'デザインツール', score: 4.7, reviewCount: 921 },
];

const sortTabs = ['新着', '評価順'] as const;
type SortTab = typeof sortTabs[number];

function StarRating({ score }: { score: number }) {
  return (
    <div className='flex items-center gap-1'>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i <= Math.round(score) ? 'text-amber-400' : 'text-gray-200'}`}
          fill='currentColor'
          viewBox='0 0 20 20'
        >
          <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
        </svg>
      ))}
    </div>
  );
}

export default function HomePage() {
  const activeTab: SortTab = '新着';
  const trendingCategories = categories.filter((cat) => cat.trending);

  return (
    <main className='min-h-screen bg-white text-[#1E293B]'>
      {/* ヘッダー */}
      <header className='border-b border-gray-100 bg-white sticky top-0 z-50'>
        <div className='max-w-6xl mx-auto px-6 h-16 flex items-center gap-4'>
          <Link href='/' className='text-xl font-bold text-[#2563EB] shrink-0'>
            Plainrank
          </Link>
          <div className='relative flex-1 max-w-xl mx-auto'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4' />
            <input
              type='text'
              placeholder='サービスを検索...'
              className='w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#2563EB] transition-colors'
            />
          </div>
          <Link
            href='/auth/signin'
            className='text-sm font-medium px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors shrink-0'
          >
            ログイン
          </Link>
        </div>
      </header>

      <div className='max-w-6xl mx-auto px-6 py-8'>

        {/* 今注目セクション */}
        <section className='mb-10'>
          <p className='text-xs font-medium text-gray-400 uppercase tracking-wide mb-3'>今注目</p>
          <div className='flex flex-wrap gap-3'>
            {trendingCategories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className='flex items-center gap-2 px-4 py-2.5 bg-blue-50 border border-[#2563EB]/20 rounded-xl hover:border-[#2563EB] hover:shadow-sm transition-all'
              >
                <span className='text-base'>🔥</span>
                <div>
                  <p className='text-sm font-semibold text-[#1E293B]'>{cat.name}</p>
                  <p className='text-xs text-gray-400'>{cat.count} 件</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* カテゴリセクション */}
        <section className='mb-10'>
          <p className='text-xs font-medium text-gray-400 uppercase tracking-wide mb-3'>カテゴリ</p>
          <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className='flex items-center justify-between px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl hover:border-[#2563EB] hover:text-[#2563EB] hover:bg-blue-50 transition-colors'
              >
                <span className='text-sm font-medium'>{cat.name}</span>
                <span className='text-xs text-gray-400'>{cat.count}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* サービス一覧 */}
        <section>
          {/* ソートタブ */}
          <div className='flex items-center gap-1 border-b border-gray-100 mb-6'>
            {sortTabs.map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                  tab === activeTab
                    ? 'border-[#2563EB] text-[#2563EB]'
                    : 'border-transparent text-gray-500 hover:text-[#1E293B]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* サービスカード グリッド */}
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/${service.category}/${service.slug}`}
                className='group bg-white border border-gray-100 rounded-xl p-5 hover:border-[#2563EB] hover:shadow-sm transition-all'
              >
                <div className='flex items-start justify-between mb-3'>
                  <div>
                    <h2 className='font-semibold text-[#1E293B] group-hover:text-[#2563EB] transition-colors'>
                      {service.name}
                    </h2>
                    <span className='inline-block mt-1 text-xs font-medium text-[#2563EB] bg-blue-50 px-2 py-0.5 rounded-full'>
                      {service.categoryLabel}
                    </span>
                  </div>
                  <div className='text-right shrink-0'>
                    <div className='text-xl font-bold text-[#1E293B]'>{service.score.toFixed(1)}</div>
                    <div className='text-xs text-gray-400'>/5.0</div>
                  </div>
                </div>
                <StarRating score={service.score} />
                <p className='text-xs text-gray-400 mt-2'>{service.reviewCount.toLocaleString()} 件のレビュー</p>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* フッター */}
      <footer className='border-t border-gray-100 py-6 px-6 mt-12'>
        <div className='max-w-6xl mx-auto flex items-center justify-end'>
          <nav className='flex items-center gap-6 text-sm text-gray-400'>
            <Link href='/transparency' className='hover:text-[#2563EB] transition-colors'>透明性ポリシー</Link>
            <Link href='/about' className='hover:text-[#2563EB] transition-colors'>About</Link>
            <a href='https://github.com' target='_blank' rel='noopener noreferrer' className='hover:text-[#2563EB] transition-colors'>GitHub</a>
          </nav>
        </div>
      </footer>
    </main>
  );
}
