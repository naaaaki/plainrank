import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';

// ---------------------------------------------------------------------------
// 型定義
// ---------------------------------------------------------------------------

/** 検索結果の1件分 */
export interface SearchResultItem {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  score: number;
  reviewCount: number;
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

/** API レスポンス */
interface SearchResponse {
  results: SearchResultItem[];
}

// ---------------------------------------------------------------------------
// バリデーション
// ---------------------------------------------------------------------------

/** クエリパラメータのスキーマ */
const querySchema = z.object({
  q: z.string().min(2).max(100),
});

/** 検索結果として返す最大件数 */
const MAX_RESULTS = 10;

// ---------------------------------------------------------------------------
// Route Handler
// ---------------------------------------------------------------------------

/**
 * GET /api/search?q=xxx
 *
 * サービス名・説明文を部分一致（大文字小文字を無視）で検索し、最大 MAX_RESULTS 件を返す。
 * q が 2 文字未満の場合は空配列を返す。
 */
export async function GET(request: NextRequest): Promise<NextResponse<SearchResponse>> {
  const { searchParams } = request.nextUrl;
  const raw = { q: searchParams.get('q') ?? '' };

  // バリデーション失敗（q が空 or 2文字未満）は空配列で即返す
  const parsed = querySchema.safeParse(raw);
  if (!parsed.success) {
    return NextResponse.json({ results: [] });
  }

  const { q } = parsed.data;

  const services = await prisma.service.findMany({
    where: {
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
      ],
    },
    include: {
      category: true,
    },
    take: MAX_RESULTS,
    orderBy: {
      // スコアが高い順に並べる
      score: 'desc',
    },
  });

  const results: SearchResultItem[] = services.map((service) => ({
    id: service.id,
    name: service.name,
    slug: service.slug,
    description: service.description,
    score: service.score,
    reviewCount: service.reviewCount,
    category: {
      id: service.category.id,
      name: service.category.name,
      slug: service.category.slug,
    },
  }));

  return NextResponse.json({ results });
}
