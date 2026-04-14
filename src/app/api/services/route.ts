import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// ---------------------------------------------------------------------------
// Request body schema
// ---------------------------------------------------------------------------

/**
 * Zod schema for validating POST /api/services request body.
 * ユーザーが新規サービスを投稿するためのバリデーション。
 */
const serviceSubmissionSchema = z.object({
  name: z.string().min(1, "サービス名は必須です").max(100, "サービス名は100文字以内で入力してください"),
  website: z.string().url("有効なURLを入力してください").optional().or(z.literal("")),
  description: z.string().max(500, "説明は500文字以内で入力してください").optional(),
  categoryId: z.string().min(1, "カテゴリは必須です"),
});

// ---------------------------------------------------------------------------
// POST /api/services
// ---------------------------------------------------------------------------

/**
 * ユーザーが新規サービスを投稿する。
 *
 * Authentication: Required (401 if not logged in)
 * Status: PENDING（管理者が承認するまで公開されない）
 *
 * スラグは name から自動生成する。重複する場合はランダムサフィックスを付与。
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  // 1. 認証チェック
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "ログインが必要です" },
      { status: 401 }
    );
  }

  // 2. リクエストボディのパース
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "リクエストボディのパースに失敗しました" },
      { status: 400 }
    );
  }

  // 3. バリデーション
  const parsed = serviceSubmissionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "入力内容に誤りがあります", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { name, website, description, categoryId } = parsed.data;
  const userId = session.user.id;

  // 4. カテゴリの存在確認
  const category = await prisma.category.findUnique({
    where: { id: categoryId },
    select: { id: true },
  });
  if (!category) {
    return NextResponse.json(
      { error: "指定されたカテゴリが見つかりません" },
      { status: 400 }
    );
  }

  // 5. スラグ生成（名前をASCII/ハイフン形式に変換し、重複時はサフィックスを追加）
  const baseSlug = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 50) || `service-${Date.now()}`;

  // スラグの重複チェックと解決
  let slug = baseSlug;
  const existing = await prisma.service.findUnique({ where: { slug }, select: { id: true } });
  if (existing) {
    slug = `${baseSlug}-${Math.random().toString(36).slice(2, 7)}`;
  }

  // 6. サービス作成（status=APPROVED：投稿即公開）
  const service = await prisma.service.create({
    data: {
      name,
      slug,
      website: website || null,
      description: description || null,
      categoryId,
      submittedById: userId,
      status: "APPROVED",
    },
    select: {
      id: true,
      name: true,
      slug: true,
      status: true,
      createdAt: true,
    },
  });

  return NextResponse.json(service, { status: 201 });
}
