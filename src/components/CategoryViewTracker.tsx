'use client';

import { useEffect } from 'react';

export function CategoryViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    // クライアント側でも事前チェック（不要なAPIコールを減らす）
    // httpOnly cookieはJS読めないため、ここではsessionStorageで簡易チェック
    const storageKey = `pr_viewed_${slug}`;
    if (sessionStorage.getItem(storageKey)) return;

    fetch(`/api/views/category/${slug}`, { method: 'POST' })
      .then(() => {
        sessionStorage.setItem(storageKey, '1');
      })
      .catch(() => {/* 失敗しても無視 */});
  }, [slug]);

  return null;
}
