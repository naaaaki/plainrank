"use client";

import Link from "next/link";
import { useState } from "react";

function StarInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <span className="text-sm font-medium text-[#1E293B]">{label}</span>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => onChange(i)}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(0)}
            className="focus:outline-none"
          >
            <svg
              className={`w-8 h-8 transition-colors ${
                i <= (hovered || value) ? "text-amber-400" : "text-gray-200"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        ))}
        <span className="ml-2 text-sm font-semibold text-[#1E293B] w-6 text-right">
          {hovered || value || "-"}
        </span>
      </div>
    </div>
  );
}

export default function NewReviewPage() {
  const [scores, setScores] = useState({ overall: 0, usability: 0, value: 0, support: 0 });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center px-6">
        <div className="text-center max-w-sm">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-[#1E293B] mb-2">レビューを受け付けました</h2>
          <p className="text-gray-500 mb-8">ありがとうございます。モデレーター確認後に公開されます。</p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-2.5 bg-[#2563EB] text-white text-sm font-semibold rounded-lg hover:bg-blue-700 transition-colors"
          >
            トップに戻る
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-[#1E293B]">
      {/* ヘッダー */}
      <header className="border-b border-gray-100 bg-white sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center gap-4">
          <Link href="/" className="text-xl font-bold text-[#2563EB] shrink-0">
            Plainrank
          </Link>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-12">
        <nav className="text-sm text-gray-400 mb-8 flex items-center gap-2">
          <Link href="/" className="hover:text-[#2563EB] transition-colors">ホーム</Link>
          <span>/</span>
          <span className="text-[#1E293B]">レビューを書く</span>
        </nav>

        <h1 className="text-3xl font-bold text-[#1E293B] mb-2">レビューを書く</h1>
        <p className="text-gray-500 mb-10">使った経験をもとに正直に評価してください。</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* スコア入力 */}
          <div className="bg-[#F8FAFC] border border-gray-200 rounded-xl p-6">
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">評価スコア</h2>
            <StarInput label="総合評価" value={scores.overall} onChange={(v) => setScores({ ...scores, overall: v })} />
            <StarInput label="使いやすさ" value={scores.usability} onChange={(v) => setScores({ ...scores, usability: v })} />
            <StarInput label="コスパ" value={scores.value} onChange={(v) => setScores({ ...scores, value: v })} />
            <StarInput label="サポート" value={scores.support} onChange={(v) => setScores({ ...scores, support: v })} />
          </div>

          {/* 利用期間 */}
          <div>
            <label className="block text-sm font-semibold text-[#1E293B] mb-2">利用期間</label>
            <select className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm text-[#1E293B] focus:outline-none focus:border-[#2563EB] transition-colors bg-white">
              <option value="">選択してください</option>
              <option>1ヶ月未満</option>
              <option>1〜6ヶ月</option>
              <option>6ヶ月以上</option>
            </select>
          </div>

          {/* タイトル */}
          <div>
            <label className="block text-sm font-semibold text-[#1E293B] mb-2">タイトル（任意）</label>
            <input
              type="text"
              placeholder="例：コスパ最高、使いやすい"
              className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm placeholder-gray-400 focus:outline-none focus:border-[#2563EB] transition-colors"
            />
          </div>

          {/* 本文 */}
          <div>
            <label className="block text-sm font-semibold text-[#1E293B] mb-2">レビュー本文</label>
            <textarea
              rows={5}
              placeholder="実際に使ってみた感想を書いてください。良い点・悪い点など具体的に書くと他のユーザーの参考になります。"
              className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:border-[#2563EB] transition-colors resize-none"
            />
          </div>

          {/* 良い点・悪い点 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#1E293B] mb-2">良い点（任意）</label>
              <textarea
                rows={3}
                placeholder="特に良かった点"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:border-[#2563EB] transition-colors resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#1E293B] mb-2">改善してほしい点（任意）</label>
              <textarea
                rows={3}
                placeholder="気になった点"
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm placeholder-gray-400 focus:outline-none focus:border-[#2563EB] transition-colors resize-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            レビューを投稿する
          </button>

          <p className="text-xs text-center text-gray-400">
            投稿することで
            <Link href="/transparency" className="text-[#2563EB] hover:underline mx-1">透明性ポリシー</Link>
            に同意したものとみなします
          </p>
        </form>
      </div>
    </main>
  );
}
