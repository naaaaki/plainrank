import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const cookieKey = `viewed_cat_${slug}`;

  // サーバー側でもクッキーを確認（直接APIを叩く攻撃を防ぐ）
  if (req.cookies.has(cookieKey)) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  try {
    await prisma.category.update({
      where: { slug },
      data: { viewCount: { increment: 1 } },
    });

    // レスポンスにクッキーをセット（24時間）
    const res = NextResponse.json({ ok: true });
    res.cookies.set(cookieKey, '1', {
      maxAge: 60 * 60 * 24,
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
    });
    return res;
  } catch {
    return NextResponse.json({ ok: false }, { status: 404 });
  }
}
