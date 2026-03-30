export const ABBR_MAP: Record<string, string> = {
  chatgpt: 'GP',
  claude: 'CL',
  cursor: 'CU',
  gemini: 'GM',
  copilot: 'CO',
  vercel: 'VE',
  linear: 'LI',
  notion: 'No',
  figma: 'FG',
  framer: 'FR',
  canva: 'CA',
  hubspot: 'HS',
  slack: 'SL',
};

export function getServiceAbbr(slug: string, name: string): string {
  return ABBR_MAP[slug] ?? name.slice(0, 2).toUpperCase();
}

export function getServiceAvatarClass(slug: string): string {
  return `av-${slug}`;
}

export const CATEGORY_META: Record<
  string,
  { name: string; description: string; badgeClass: string; badgeLabel: string }
> = {
  'ai-tools': {
    name: 'AIツール',
    description: 'ChatGPT・Claude・Geminiなど、生成AIアシスタントから特化型ツールまで',
    badgeClass: 'ai',
    badgeLabel: '✦ AIツール',
  },
  'dev-tools': {
    name: '開発ツール',
    description: 'エンジニア・開発チーム向けのプロジェクト管理・コラボレーションツール',
    badgeClass: 'dev',
    badgeLabel: '⚙ 開発ツール',
  },
  'design-tools': {
    name: 'デザインツール',
    description: 'UI/UXデザイン・プロトタイピング・グラフィック制作ツール',
    badgeClass: 'dsgn',
    badgeLabel: '◈ デザインツール',
  },
  marketing: {
    name: 'マーケSaaS',
    description: 'マーケティング・分析・広告運用に特化したSaaSツール',
    badgeClass: 'mkt',
    badgeLabel: '◎ マーケSaaS',
  },
  productivity: {
    name: '生産性',
    description: '個人・チームの生産性を高めるツール',
    badgeClass: 'prod',
    badgeLabel: '▶ 生産性',
  },
  security: {
    name: 'セキュリティ',
    description: 'セキュリティ対策・監視・コンプライアンスツール',
    badgeClass: 'sec',
    badgeLabel: '◉ セキュリティ',
  },
};
