import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { updateServiceScore } from "@/lib/updateServiceScore";

// ---------------------------------------------------------------------------
// Request body schema
// ---------------------------------------------------------------------------

/**
 * Zod schema for validating POST /api/reviews request body.
 * All score fields must be integers 1–5; body must be 10–2000 characters.
 */
const reviewSchema = z.object({
  serviceId: z.string().min(1, "serviceId is required"),
  overall: z.number().int().min(1).max(5),
  usability: z.number().int().min(1).max(5),
  value: z.number().int().min(1).max(5),
  support: z.number().int().min(1).max(5),
  body: z.string().min(10, "本文は10文字以上で入力してください").max(2000, "本文は2000文字以内で入力してください"),
});

// ---------------------------------------------------------------------------
// POST /api/reviews
// ---------------------------------------------------------------------------

/**
 * Creates a new review for a service.
 *
 * Authentication: Required (401 if not logged in)
 * Duplicate guard: 409 if the user has already reviewed this service
 * After creation: triggers service score recalculation (P3-27)
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  // 1. Authentication check
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json(
      { error: "ログインが必要です" },
      { status: 401 }
    );
  }

  // 2. Parse and validate request body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "リクエストボディのパースに失敗しました" },
      { status: 400 }
    );
  }

  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "入力内容に誤りがあります", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { serviceId, overall, usability, value, support, body: reviewBody } = parsed.data;
  const userId = session.user.id;

  // 3. Duplicate review check (@@unique([userId, serviceId]))
  const existingReview = await prisma.review.findUnique({
    where: { userId_serviceId: { userId, serviceId } },
    select: { id: true },
  });

  if (existingReview) {
    return NextResponse.json(
      { error: "このサービスにはすでにレビューを投稿済みです" },
      { status: 409 }
    );
  }

  // 4. Create review
  const review = await prisma.review.create({
    data: {
      userId,
      serviceId,
      overall,
      usability,
      value,
      support,
      body: reviewBody,
    },
  });

  // 5. Recalculate and update service score (P3-27)
  await updateServiceScore(serviceId);

  return NextResponse.json(review, { status: 201 });
}
