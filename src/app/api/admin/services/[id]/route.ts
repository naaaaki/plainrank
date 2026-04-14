import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

// ---------------------------------------------------------------------------
// 管理者チェック
// ---------------------------------------------------------------------------

/**
 * 管理者メールアドレス。
 * auth.ts に専用設定がないため、環境変数 ADMIN_EMAIL で管理する。
 */
function isAdmin(email: string | null | undefined): boolean {
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!adminEmail || !email) return false;
  return email === adminEmail;
}

// ---------------------------------------------------------------------------
// Request body schema
// ---------------------------------------------------------------------------

const statusUpdateSchema = z.object({
  status: z
    .string()
    .refine(
      (val): val is "APPROVED" | "REJECTED" => val === "APPROVED" || val === "REJECTED",
      { message: "status は APPROVED または REJECTED である必要があります" }
    ),
});

// ---------------------------------------------------------------------------
// PATCH /api/admin/services/[id]
// ---------------------------------------------------------------------------

/**
 * PENDING サービスを承認または却下する。
 *
 * Authentication: 管理者ログイン必須（ADMIN_EMAIL 環境変数で判定）
 * Body: { status: "APPROVED" | "REJECTED" }
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  // 1. 認証チェック
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "ログインが必要です" }, { status: 401 });
  }

  // 2. 管理者チェック
  if (!isAdmin(session.user.email)) {
    return NextResponse.json({ error: "管理者権限が必要です" }, { status: 403 });
  }

  // 3. リクエストボディのパース
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "リクエストボディのパースに失敗しました" },
      { status: 400 }
    );
  }

  const parsed = statusUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "入力内容に誤りがあります", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { id } = await params;
  const { status } = parsed.data;

  // 4. サービスの存在確認
  const service = await prisma.service.findUnique({
    where: { id },
    select: { id: true, status: true },
  });
  if (!service) {
    return NextResponse.json({ error: "サービスが見つかりません" }, { status: 404 });
  }

  // 5. ステータス更新
  const updated = await prisma.service.update({
    where: { id },
    data: { status },
    select: {
      id: true,
      name: true,
      slug: true,
      status: true,
      updatedAt: true,
    },
  });

  return NextResponse.json(updated);
}
