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
    categorySlug: string;
  }> = [
    // ai-tools
    { name: 'ChatGPT',        slug: 'chatgpt',    description: 'OpenAIが提供する汎用AIアシスタント。文章生成・コーディング・翻訳など幅広く活用できる大規模言語モデル。', website: 'https://chat.openai.com',             categorySlug: 'ai-tools' },
    { name: 'Claude',         slug: 'claude',     description: 'Anthropicが開発するAIアシスタント。長文処理・安全性・指示への正確な追随が評価されている。',             website: 'https://claude.ai',                  categorySlug: 'ai-tools' },
    { name: 'Cursor',         slug: 'cursor',     description: 'AIコードエディタ・開発者向け。コード補完・リファクタリング・バグ修正をAIがサポート。',                   website: 'https://cursor.sh',                  categorySlug: 'ai-tools' },
    { name: 'Gemini',         slug: 'gemini',     description: 'Googleが開発するAIアシスタント。Google Workspaceとの連携が強み。',                                        website: 'https://gemini.google.com',          categorySlug: 'ai-tools' },
    // dev-tools
    { name: 'GitHub Copilot', slug: 'copilot',    description: 'AIペアプログラマー・VS Code連携。コード補完・テスト生成・Pull Requestへの提案が可能。',                  website: 'https://github.com/features/copilot', categorySlug: 'dev-tools' },
    { name: 'Vercel',         slug: 'vercel',     description: 'フロントエンドホスティング。Next.js・Nuxt・SvelteKitを即座にデプロイできるプラットフォーム。',            website: 'https://vercel.com',                 categorySlug: 'dev-tools' },
    { name: 'Linear',         slug: 'linear',     description: 'シンプルで高速なプロジェクト管理ツール。エンジニアチーム向けに最適化されたUIと豊富なショートカットが特徴。', website: 'https://linear.app',                categorySlug: 'dev-tools' },
    { name: 'Supabase',       slug: 'supabase',   description: 'オープンソースのFirebase代替。PostgreSQL・認証・ストレージ・Edge Functionsを即座に構築できるBaaS。',    website: 'https://supabase.com',               categorySlug: 'dev-tools' },
    // design-tools
    { name: 'Figma',          slug: 'figma',      description: 'ブラウザベースのUIデザインツール。リアルタイム共同編集・プロトタイピング・デザインシステム管理が一体化。', website: 'https://figma.com',                  categorySlug: 'design-tools' },
    { name: 'Framer',         slug: 'framer',     description: 'インタラクティブデザイン・実装。コードなしでアニメーションやインタラクションを実現。',                    website: 'https://framer.com',                 categorySlug: 'design-tools' },
    { name: 'Canva',          slug: 'canva',      description: 'ノンデザイナー向け・テンプレ豊富。SNS画像・プレゼン・ポスターを簡単に作成できるデザインツール。',          website: 'https://canva.com',                  categorySlug: 'design-tools' },
    // marketing
    { name: 'HubSpot',        slug: 'hubspot',    description: 'CRM・マーケ・営業の統合プラットフォーム。インバウンドマーケティングに強い総合SaaS。',                    website: 'https://hubspot.com',                categorySlug: 'marketing' },
    { name: 'Mailchimp',      slug: 'mailchimp',  description: 'メールマーケティングの定番ツール。自動化・セグメント配信・A/Bテストを直感的に設定できる。',               website: 'https://mailchimp.com',              categorySlug: 'marketing' },
    { name: 'Ahrefs',         slug: 'ahrefs',     description: 'SEO分析ツールの最高峰。被リンク分析・キーワードリサーチ・競合調査を網羅する総合SEOプラットフォーム。',    website: 'https://ahrefs.com',                 categorySlug: 'marketing' },
    // productivity
    { name: 'Notion',         slug: 'notion',     description: 'ノート・Wiki・タスク管理を統合したオールインワンワークスペース。柔軟なブロック構造で幅広い用途に対応。',   website: 'https://notion.so',                  categorySlug: 'productivity' },
    { name: 'Slack',          slug: 'slack',      description: 'チームコミュニケーションツール。チャンネル・DM・外部ツール連携で業務効率を高める。',                       website: 'https://slack.com',                  categorySlug: 'productivity' },
    { name: 'Todoist',        slug: 'todoist',    description: 'シンプルで強力なタスク管理アプリ。繰り返しタスク・優先度・プロジェクト管理を直感的に操作できる。',          website: 'https://todoist.com',               categorySlug: 'productivity' },
    { name: 'Zapier',         slug: 'zapier',     description: '7,000以上のアプリを繋ぐ自動化ツール。コードなしでワークフローを構築し、繰り返し作業を自動化できる。',      website: 'https://zapier.com',                categorySlug: 'productivity' },
    // security
    { name: '1Password',      slug: '1password',  description: 'パスワード管理の定番。チーム共有・秘密鍵管理・SSO連携に対応した企業向けセキュリティツール。',              website: 'https://1password.com',              categorySlug: 'security' },
    { name: 'Cloudflare',     slug: 'cloudflare', description: 'CDN・DDoS対策・Webアプリケーションファイアウォールを提供。無料プランから始められるグローバルネットワーク。', website: 'https://cloudflare.com',            categorySlug: 'security' },
    { name: 'Snyk',           slug: 'snyk',       description: 'コード・依存関係・コンテナの脆弱性をCI/CDパイプラインで自動検出。開発者ファーストなセキュリティツール。',   website: 'https://snyk.io',                   categorySlug: 'security' },
  ];

  for (const svc of serviceData) {
    const category = await prisma.category.findUniqueOrThrow({ where: { slug: svc.categorySlug } });
    await prisma.service.upsert({
      where: { slug: svc.slug },
      update: {
        name: svc.name,
        description: svc.description,
        website: svc.website,
        score: 0,
        reviewCount: 0,
        categoryId: category.id,
      },
      create: {
        name: svc.name,
        slug: svc.slug,
        description: svc.description,
        website: svc.website,
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
