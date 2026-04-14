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

export const CATEGORY_DISPLAY: Record<string, { icon: string; color: string }> = {
  'ai-tools':           { icon: '✦', color: '#2563EB' },
  'dev-tools':          { icon: '⚙', color: '#16a34a' },
  'design-tools':       { icon: '◈', color: '#7c3aed' },
  'marketing':          { icon: '◎', color: '#b45309' },
  'productivity':       { icon: '▶', color: '#dc2626' },
  'security':           { icon: '◉', color: '#059669' },
  'analytics':          { icon: '◆', color: '#ea580c' },
  'project-management': { icon: '▦', color: '#4338ca' },
  'hr-tools':           { icon: '◒', color: '#db2777' },
  'mobile-apps':        { icon: '◱', color: '#0d9488' },
  'communication':      { icon: '◬', color: '#8b5cf6' },
};

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
  analytics: {
    name: '分析・BI',
    description: 'プロダクト分析・ビジネスインテリジェンス・データ可視化ツール',
    badgeClass: 'ana',
    badgeLabel: '◆ 分析・BI',
  },
  'project-management': {
    name: 'プロジェクト管理',
    description: 'タスク・スプリント・ロードマップ管理に特化したコラボレーションツール',
    badgeClass: 'pm',
    badgeLabel: '▦ プロジェクト管理',
  },
  'hr-tools': {
    name: 'HR・採用',
    description: '人事管理・採用・オンボーディングを効率化するHRテックツール',
    badgeClass: 'hr',
    badgeLabel: '◒ HR・採用',
  },
  'mobile-apps': {
    name: 'モバイル・アプリ',
    description: 'モバイルアプリ開発・配布・収益化を支援するツール・プラットフォーム',
    badgeClass: 'mob',
    badgeLabel: '◱ モバイル',
  },
  communication: {
    name: 'コミュニケーション',
    description: 'チームチャット・ビデオ会議・非同期コミュニケーションツール',
    badgeClass: 'comm',
    badgeLabel: '◬ コミュニケーション',
  },
};
