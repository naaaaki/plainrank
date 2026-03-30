import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL ?? '' });
const prisma = new PrismaClient({ adapter });

async function main() {
  // --------------------------------------------------------------------------
  // Categories（6件）
  // --------------------------------------------------------------------------
  const categories = [
    { name: 'AIツール',       slug: 'ai-tools',      description: 'ChatGPT・Claude・Geminiなど、生成AIアシスタントから特化型ツールまで' },
    { name: '開発ツール',     slug: 'dev-tools',     description: 'エンジニア・開発チーム向けのプロジェクト管理・コラボレーションツール' },
    { name: 'デザインツール', slug: 'design-tools',  description: 'UI/UXデザイン・プロトタイピング・グラフィック制作ツール' },
    { name: 'マーケSaaS',     slug: 'marketing',     description: 'マーケティング・分析・広告運用に特化したSaaSツール' },
    { name: '生産性',         slug: 'productivity',  description: '個人・チームの生産性を高めるツール' },
    { name: 'セキュリティ',   slug: 'security',      description: 'セキュリティ対策・監視・コンプライアンスツール' },
  ];

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description },
      create: cat,
    });
  }
  console.log('Categories seeded');

  // --------------------------------------------------------------------------
  // Services
  // --------------------------------------------------------------------------
  const serviceData: Array<{
    name: string;
    slug: string;
    description: string;
    website: string;
    score: number;
    reviewCount: number;
    categorySlug: string;
  }> = [
    // ai-tools
    { name: 'ChatGPT',        slug: 'chatgpt', description: 'OpenAIが提供する汎用AIアシスタント。文章生成・コーディング・翻訳など幅広く活用できる大規模言語モデル。', website: 'https://chat.openai.com', score: 4.8, reviewCount: 2341, categorySlug: 'ai-tools' },
    { name: 'Claude',         slug: 'claude',  description: 'Anthropicが開発するAIアシスタント。長文処理・安全性・指示への正確な追随が評価されている。',             website: 'https://claude.ai',          score: 4.7, reviewCount: 1823, categorySlug: 'ai-tools' },
    { name: 'Cursor',         slug: 'cursor',  description: 'AIコードエディタ・開発者向け。コード補完・リファクタリング・バグ修正をAIがサポート。',                   website: 'https://cursor.sh',          score: 4.6, reviewCount:  956, categorySlug: 'ai-tools' },
    { name: 'Gemini',         slug: 'gemini',  description: 'Googleが開発するAIアシスタント。Google Workspaceとの連携が強み。',                                        website: 'https://gemini.google.com',  score: 4.4, reviewCount:  620, categorySlug: 'ai-tools' },
    // dev-tools
    { name: 'GitHub Copilot', slug: 'copilot', description: 'AIペアプログラマー・VS Code連携。コード補完・テスト生成・Pull Requestへの提案が可能。',                  website: 'https://github.com/features/copilot', score: 4.5, reviewCount: 1204, categorySlug: 'dev-tools' },
    { name: 'Vercel',         slug: 'vercel',  description: 'フロントエンドホスティング。Next.js・Nuxt・SvelteKitを即座にデプロイできるプラットフォーム。',            website: 'https://vercel.com',         score: 4.4, reviewCount:  782, categorySlug: 'dev-tools' },
    { name: 'Linear',         slug: 'linear',  description: 'シンプルで高速なプロジェクト管理ツール。エンジニアチーム向けに最適化されたUIと豊富なショートカットが特徴。', website: 'https://linear.app',         score: 4.3, reviewCount:  654, categorySlug: 'dev-tools' },
    { name: 'Notion',         slug: 'notion',  description: 'ノート・Wiki・タスク管理を統合したオールインワンワークスペース。柔軟なブロック構造で幅広い用途に対応。',   website: 'https://notion.so',          score: 4.3, reviewCount: 1893, categorySlug: 'dev-tools' },
    // design-tools
    { name: 'Figma',          slug: 'figma',   description: 'ブラウザベースのUIデザインツール。リアルタイム共同編集・プロトタイピング・デザインシステム管理が一体化。', website: 'https://figma.com',          score: 4.6, reviewCount: 1890, categorySlug: 'design-tools' },
    { name: 'Framer',         slug: 'framer',  description: 'インタラクティブデザイン・実装。コードなしでアニメーションやインタラクションを実現。',                    website: 'https://framer.com',         score: 4.4, reviewCount:  432, categorySlug: 'design-tools' },
    { name: 'Canva',          slug: 'canva',   description: 'ノンデザイナー向け・テンプレ豊富。SNS画像・プレゼン・ポスターを簡単に作成できるデザインツール。',          website: 'https://canva.com',          score: 4.3, reviewCount: 1102, categorySlug: 'design-tools' },
    // marketing
    { name: 'HubSpot',        slug: 'hubspot', description: 'CRM・マーケ・営業の統合プラットフォーム。インバウンドマーケティングに強い総合SaaS。',                    website: 'https://hubspot.com',        score: 4.3, reviewCount: 1102, categorySlug: 'marketing' },
    { name: 'Slack',          slug: 'slack',   description: 'チームコミュニケーションツール。チャンネル・DM・外部ツール連携で業務効率を高める。',                       website: 'https://slack.com',          score: 4.1, reviewCount:  743, categorySlug: 'marketing' },
  ];

  for (const svc of serviceData) {
    const category = await prisma.category.findUniqueOrThrow({ where: { slug: svc.categorySlug } });
    await prisma.service.upsert({
      where: { slug: svc.slug },
      update: {
        name: svc.name,
        description: svc.description,
        website: svc.website,
        score: svc.score,
        reviewCount: svc.reviewCount,
        categoryId: category.id,
      },
      create: {
        name: svc.name,
        slug: svc.slug,
        description: svc.description,
        website: svc.website,
        score: svc.score,
        reviewCount: svc.reviewCount,
        categoryId: category.id,
      },
    });
  }
  console.log('Services seeded');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
