import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ExternalLink, CheckCircle } from 'lucide-react';

interface Props {
  params: Promise<{ category: string; slug: string }>;
}

const MOCK_SERVICES: Record<string, {
  name: string;
  category: string;
  categoryLabel: string;
  score: number;
  reviewCount: number;
  description: string;
  website: string;
  scores: { usability: number; value: number; support: number; features: number };
}> = {
  chatgpt: {
    name: 'ChatGPT',
    category: 'ai-tools',
    categoryLabel: 'AIツール',
    score: 4.6,
    reviewCount: 1204,
    description: 'OpenAIが提供する汎用AIアシスタント。文章生成・コーディング・翻訳など幅広く活用できる大規模言語モデル。',
    website: 'https://chat.openai.com',
    scores: { usability: 4.7, value: 4.2, support: 3.9, features: 4.8 },
  },
  linear: {
    name: 'Linear',
    category: 'dev-tools',
    categoryLabel: '開発ツール',
    score: 4.8,
    reviewCount: 538,
    description: 'シンプルで高速なプロジェクト管理ツール。エンジニアチーム向けに最適化されたUIと豊富なショートカットが特徴。',
    website: 'https://linear.app',
    scores: { usability: 4.9, value: 4.6, support: 4.4, features: 4.7 },
  },
  figma: {
    name: 'Figma',
    category: 'design-tools',
    categoryLabel: 'デザインツール',
    score: 4.7,
    reviewCount: 921,
    description: 'ブラウザベースのUIデザインツール。リアルタイム共同編集・プロトタイピング・デザインシステム管理が一体化。',
    website: 'https://figma.com',
    scores: { usability: 4.8, value: 4.3, support: 4.5, features: 4.9 },
  },
  claude: {
    name: 'Claude',
    category: 'ai-tools',
    categoryLabel: 'AIツール',
    score: 4.5,
    reviewCount: 742,
    description: 'Anthropicが開発するAIアシスタント。長文処理・安全性・指示への正確な追随が評価されている。',
    website: 'https://claude.ai',
    scores: { usability: 4.6, value: 4.3, support: 4.0, features: 4.5 },
  },
  notion: {
    name: 'Notion',
    category: 'dev-tools',
    categoryLabel: '開発ツール',
    score: 4.3,
    reviewCount: 1893,
    description: 'ノート・Wiki・タスク管理を統合したオールインワンワークスペース。柔軟なブロック構造で幅広い用途に対応。',
    website: 'https://notion.so',
    scores: { usability: 4.2, value: 4.5, support: 3.8, features: 4.6 },
  },
};

const MOCK_REVIEWS = [
  {
    id: 1,
    author: 'tanaka_dev',
    score: 5,
    date: '2026-03-15',
    text: '使い始めてから業務効率が大幅に上がりました。特に複雑なタスクへの対応力が素晴らしい。UIもシンプルで迷わず使えます。',
    verified: true,
  },
  {
    id: 2,
    author: 'suzuki_designer',
    score: 4,
    date: '2026-03-08',
    text: '全体的に満足度高め。ただ無料プランの制限が少し厳しいと感じる場面がありました。有料プランにすれば問題ないと思います。',
    verified: true,
  },
  {
    id: 3,
    author: 'yamamoto_pm',
    score: 4,
    date: '2026-02-27',
    text: 'チームで使い始めて3ヶ月。サポートのレスポンスが早く、困ったときにすぐ対応してもらえた点が特に良かったです。',
    verified: false,
  },
];

function StarRating({ score, size = 'sm' }: { score: number; size?: 'sm' | 'lg' }) {
  const cls = size === 'lg' ? 'w-6 h-6' : 'w-4 h-4';
  return (
    <div className='flex items-center gap-1'>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`${cls} ${i <= Math.round(score) ? 'text-amber-400' : 'text-gray-200'}`}
          fill='currentColor'
          viewBox='0 0 20 20'
        >
          <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
        </svg>
      ))}
    </div>
  );
}

function ScoreBar({ label, score }: { label: string; score: number }) {
  const pct = Math.round((score / 5) * 100);
  return (
    <div>
      <div className='flex justify-between text-sm mb-2'>
        <span className='text-gray-600'>{label}</span>
        <span className='font-semibold text-[#1E293B]'>{score.toFixed(1)}</span>
      </div>
      <div className='w-full bg-gray-100 rounded-full h-2.5'>
        <div className='bg-[#2563EB] h-2.5 rounded-full transition-all' style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export default async function ServiceDetailPage({ params }: Props) {
  const { category, slug } = await params;
  const service = MOCK_SERVICES[slug];
  if (!service) notFound();

  return (
    <main className='min-h-screen bg-[#F8FAFC] text-[#1E293B]'>
      <header className='border-b border-gray-100 bg-white sticky top-0 z-50'>
        <div className='max-w-6xl mx-auto px-6 h-16 flex items-center justify-between'>
          <Link href='/' className='text-xl font-bold text-[#2563EB]'>Plainrank</Link>
          <Link href='/auth/signin' className='text-sm font-medium px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors'>ログイン</Link>
        </div>
      </header>

      <div className='max-w-4xl mx-auto px-6 py-10'>
        <nav className='text-sm text-gray-400 mb-8 flex items-center gap-2'>
          <Link href='/' className='hover:text-[#2563EB] transition-colors'>ホーム</Link>
          <span>/</span>
          <Link href={`/${category}`} className='hover:text-[#2563EB] transition-colors capitalize'>{service.categoryLabel}</Link>
          <span>/</span>
          <span className='text-[#1E293B]'>{service.name}</span>
        </nav>

        <section className='bg-white border border-gray-100 rounded-2xl p-8 mb-6'>
          <div className='flex flex-col sm:flex-row sm:items-start justify-between gap-6'>
            <div className='flex-1'>
              <div className='flex items-center gap-3 mb-2'>
                <h1 className='text-3xl font-bold text-[#1E293B]'>{service.name}</h1>
                <span className='text-xs font-medium text-[#2563EB] bg-blue-50 px-3 py-1 rounded-full'>{service.categoryLabel}</span>
              </div>
              <p className='text-gray-500 mb-4 leading-relaxed'>{service.description}</p>
              <a href={service.website} target='_blank' rel='noopener noreferrer' className='inline-flex items-center gap-1.5 text-sm text-[#2563EB] hover:underline font-medium'>
                公式サイトを見る
                <ExternalLink className='w-3.5 h-3.5' />
              </a>
            </div>
            <div className='sm:text-center shrink-0'>
              <div className='text-6xl font-bold text-[#1E293B]'>{service.score.toFixed(1)}</div>
              <StarRating score={service.score} size='lg' />
              <p className='text-sm text-gray-400 mt-2'>{service.reviewCount.toLocaleString()} 件のレビュー</p>
              <Link href='/auth/signin' className='mt-4 block w-full text-center bg-[#2563EB] hover:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors'>レビューを書く</Link>
            </div>
          </div>
        </section>

        <section className='bg-white border border-gray-100 rounded-2xl p-8 mb-6'>
          <h2 className='text-xl font-bold text-[#1E293B] mb-6'>なぜこのスコアなのか</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-5'>
            <ScoreBar label='使いやすさ' score={service.scores.usability} />
            <ScoreBar label='コスパ' score={service.scores.value} />
            <ScoreBar label='サポート' score={service.scores.support} />
            <ScoreBar label='機能性' score={service.scores.features} />
          </div>
          <div className='mt-6 pt-6 border-t border-gray-100'>
            <Link href='/transparency' className='text-sm text-[#2563EB] hover:underline font-medium'>
              スコア計算式を見る →
            </Link>
          </div>
        </section>

        <section className='mb-6'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-xl font-bold text-[#1E293B]'>レビュー一覧</h2>
            <Link href='/auth/signin' className='text-sm font-medium bg-[#2563EB] hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors'>レビューを書く</Link>
          </div>
          <div className='flex flex-col gap-4'>
            {MOCK_REVIEWS.map((review) => (
              <div key={review.id} className='bg-white border border-gray-100 rounded-xl p-6'>
                <div className='flex items-start justify-between mb-3'>
                  <div className='flex items-center gap-2'>
                    <div className='w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-sm font-bold text-[#2563EB]'>
                      {review.author[0].toUpperCase()}
                    </div>
                    <div>
                      <div className='flex items-center gap-1.5'>
                        <span className='text-sm font-semibold text-[#1E293B]'>{review.author}</span>
                        {review.verified && (
                          <CheckCircle className='w-4 h-4 text-emerald-500' />
                        )}
                      </div>
                      <span className='text-xs text-gray-400'>{review.date}</span>
                    </div>
                  </div>
                  <StarRating score={review.score} />
                </div>
                <p className='text-sm text-gray-600 leading-relaxed'>{review.text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <footer className='bg-white border-t border-gray-100 py-10 px-6'>
        <div className='max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4'>
          <p className='text-sm text-gray-500'>Plainrank - スポンサーなし・公正なレビューサイト</p>
          <nav className='flex items-center gap-6 text-sm text-gray-500'>
            <Link href='/transparency' className='hover:text-[#2563EB] transition-colors'>透明性ポリシー</Link>
            <Link href='/about' className='hover:text-[#2563EB] transition-colors'>About</Link>
            <a href='https://github.com' target='_blank' rel='noopener noreferrer' className='hover:text-[#2563EB] transition-colors'>GitHub</a>
          </nav>
        </div>
      </footer>
    </main>
  );
}