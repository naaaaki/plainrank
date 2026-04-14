import { PrismaClient } from '@prisma/client';
import { PrismaNeon } from '@prisma/adapter-neon';

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL ?? '' });
const prisma = new PrismaClient({ adapter });

async function main() {
  // --------------------------------------------------------------------------
  // Categories（6件）
  // --------------------------------------------------------------------------
  const categories = [
    { name: 'AIツール',           slug: 'ai-tools',           description: 'ChatGPT・Claude・Geminiなど、生成AIアシスタントから特化型ツールまで' },
    { name: '開発ツール',         slug: 'dev-tools',          description: 'エンジニア・開発チーム向けのプロジェクト管理・コラボレーションツール' },
    { name: 'デザインツール',     slug: 'design-tools',       description: 'UI/UXデザイン・プロトタイピング・グラフィック制作ツール' },
    { name: 'マーケSaaS',         slug: 'marketing',          description: 'マーケティング・分析・広告運用に特化したSaaSツール' },
    { name: '生産性',             slug: 'productivity',       description: '個人・チームの生産性を高めるツール' },
    { name: 'セキュリティ',       slug: 'security',           description: 'セキュリティ対策・監視・コンプライアンスツール' },
    { name: '分析・BI',           slug: 'analytics',          description: 'プロダクト分析・ビジネスインテリジェンス・データ可視化ツール' },
    { name: 'プロジェクト管理',   slug: 'project-management', description: 'タスク・スプリント・ロードマップ管理に特化したコラボレーションツール' },
    { name: 'HR・採用',           slug: 'hr-tools',           description: '人事管理・採用・オンボーディングを効率化するHRテックツール' },
    { name: 'モバイル・アプリ',   slug: 'mobile-apps',        description: 'モバイルアプリ開発・配布・収益化を支援するツール・プラットフォーム' },
    { name: 'コミュニケーション', slug: 'communication',      description: 'チームチャット・ビデオ会議・非同期コミュニケーションツール' },
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
    // analytics
    { name: 'Mixpanel',       slug: 'mixpanel',   description: 'イベントベースのプロダクト分析ツール。ファネル・リテンション・コホート分析でユーザー行動を深く理解できる。',    website: 'https://mixpanel.com',         categorySlug: 'analytics' },
    { name: 'Amplitude',      slug: 'amplitude',  description: 'プロダクトアナリティクスのリーダー。デジタルプロダクトの改善に特化した分析・実験プラットフォーム。',            website: 'https://amplitude.com',        categorySlug: 'analytics' },
    { name: 'Metabase',       slug: 'metabase',   description: 'ノーコードで使えるオープンソースBIツール。SQLなしでダッシュボードを作成・共有できる。',                         website: 'https://metabase.com',         categorySlug: 'analytics' },
    // project-management
    { name: 'Asana',          slug: 'asana',      description: 'タスク・プロジェクト・ゴール管理を統合したワークマネジメントツール。チームの作業を可視化し進捗を追跡できる。',  website: 'https://asana.com',            categorySlug: 'project-management' },
    { name: 'Monday.com',     slug: 'monday',     description: '柔軟なボード形式でプロジェクトを管理できるワークOS。マーケ・開発・営業など多様なチームに対応。',               website: 'https://monday.com',           categorySlug: 'project-management' },
    { name: 'Jira',           slug: 'jira',       description: 'Atlassianのアジャイル開発向けプロジェクト管理ツール。スプリント管理・バックログ・ロードマップが充実。',          website: 'https://atlassian.com/software/jira', categorySlug: 'project-management' },
    { name: 'ClickUp',        slug: 'clickup',    description: 'タスク・ドキュメント・ゴールをひとつにまとめたオールインワン生産性プラットフォーム。高いカスタマイズ性が特徴。', website: 'https://clickup.com',         categorySlug: 'project-management' },
    // hr-tools
    { name: 'BambooHR',       slug: 'bamboohr',   description: '中小企業向けの人事情報システム（HRIS）。従業員データ管理・休暇申請・オンボーディングをシンプルに一元化。',    website: 'https://bamboohr.com',         categorySlug: 'hr-tools' },
    { name: 'Rippling',       slug: 'rippling',   description: '採用から給与・IT管理まで人事フローを統合したプラットフォーム。従業員ライフサイクル全体をカバー。',              website: 'https://rippling.com',         categorySlug: 'hr-tools' },
    { name: 'Greenhouse',     slug: 'greenhouse', description: '採用プロセスに特化したATS（採用管理システム）。候補者体験の向上と採用品質の改善に強みを持つ。',                website: 'https://greenhouse.com',       categorySlug: 'hr-tools' },
    // mobile-apps
    { name: 'Flutter',        slug: 'flutter',    description: 'Googleのクロスプラットフォームフレームワーク。ひとつのコードベースでiOS・Android・Webアプリを開発できる。',    website: 'https://flutter.dev',          categorySlug: 'mobile-apps' },
    { name: 'Expo',           slug: 'expo',       description: 'React Nativeアプリを素早く構築・デプロイできるプラットフォーム。OTAアップデートやビルドサービスも提供。',        website: 'https://expo.dev',             categorySlug: 'mobile-apps' },
    { name: 'RevenueCat',     slug: 'revenuecat', description: 'アプリ内課金・サブスクリプション管理のインフラ。iOS/Android両対応で収益化ロジックを一元管理できる。',            website: 'https://revenuecat.com',       categorySlug: 'mobile-apps' },
    { name: 'Firebase',       slug: 'firebase',   description: 'Googleのモバイル・Webアプリ向けBaaS。認証・DB・ストレージ・プッシュ通知・分析をワンストップで提供。',            website: 'https://firebase.google.com',  categorySlug: 'mobile-apps' },
    // communication
    { name: 'Zoom',           slug: 'zoom',       description: 'ビデオ会議・ウェビナーのデファクトスタンダード。高品質な映像・音声とブレイクアウトルームが特徴。',                website: 'https://zoom.us',              categorySlug: 'communication' },
    { name: 'Discord',        slug: 'discord',    description: 'テキスト・音声・ビデオを統合したコミュニティプラットフォーム。開発者・ゲーマー・クリエイターコミュニティで広く使われる。', website: 'https://discord.com',     categorySlug: 'communication' },
    { name: 'Loom',           slug: 'loom',       description: '画面録画・動画メッセージングツール。非同期コミュニケーションを促進し、会議を減らすことができる。',                  website: 'https://loom.com',             categorySlug: 'communication' },
    { name: 'Gather',         slug: 'gather',     description: 'バーチャルオフィス・イベントプラットフォーム。2D空間でアバターを使ったリモートコラボレーションを実現。',            website: 'https://gather.town',          categorySlug: 'communication' },
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
