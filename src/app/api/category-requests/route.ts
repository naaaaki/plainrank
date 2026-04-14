import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(1, "カテゴリ名は必須です").max(100),
  description: z.string().max(500).optional(),
  email: z.string().email("有効なメールアドレスを入力してください").optional().or(z.literal("")),
});

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "リクエストの形式が正しくありません" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "入力内容に誤りがあります", details: parsed.error.flatten() }, { status: 400 });
  }

  const { name, description, email } = parsed.data;

  await prisma.categoryRequest.create({
    data: {
      name,
      description: description || null,
      email: email || null,
    },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
