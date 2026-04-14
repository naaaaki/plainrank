import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

// ---------------------------------------------------------------------------
// Request body schema
// ---------------------------------------------------------------------------

/**
 * Zod schema for validating POST /api/newsletter request body.
 * Accepts a valid email address only.
 */
const newsletterSchema = z.object({
  email: z
    .string()
    .email("有効なメールアドレスを入力してください")
    .max(255, "メールアドレスが長すぎます"),
});

// ---------------------------------------------------------------------------
// POST /api/newsletter
// ---------------------------------------------------------------------------

/**
 * Registers an email address for the newsletter.
 *
 * Authentication: Not required (publicly accessible)
 * Duplicate guard: Returns 200 (no error) if already registered,
 *   to avoid leaking whether an email is in the DB.
 *
 * Note: External mail delivery (Mailchimp etc.) is intentionally not
 *   implemented here. This endpoint only persists the email address.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  // 1. Parse and validate request body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "リクエストボディのパースに失敗しました" },
      { status: 400 }
    );
  }

  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "入力内容に誤りがあります", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { email } = parsed.data;

  // 2. Upsert: すでに登録済みのメアドはそのまま返す（重複エラーを外部に漏らさない）
  await prisma.newsletterSubscription.upsert({
    where: { email },
    update: {},
    create: { email },
  });

  return NextResponse.json(
    { message: "登録を受け付けました。ありがとうございます！" },
    { status: 200 }
  );
}
