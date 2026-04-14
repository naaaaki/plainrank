"use client";

import { useState } from "react";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface ServiceSubmitFormProps {
  categories: Category[];
}

/**
 * サービス投稿フォーム（クライアントコンポーネント）
 *
 * POST /api/services にリクエストを送信し、PENDING状態でサービスを登録する。
 * 送信後は「審査中です」メッセージを表示する。
 */
export default function ServiceSubmitForm({ categories }: ServiceSubmitFormProps) {
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "var(--pr-bg)",
    border: "1px solid var(--pr-border)",
    borderRadius: "8px",
    padding: "10px 14px",
    fontSize: ".875rem",
    color: "var(--pr-text-pri)",
    outline: "none",
    transition: "border-color .15s, box-shadow .15s",
    fontFamily: "inherit",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: ".82rem",
    fontWeight: 600,
    color: "var(--pr-text-pri)",
    marginBottom: "6px",
  };

  const sectionStyle: React.CSSProperties = {
    background: "var(--pr-surface)",
    border: "1px solid var(--pr-border)",
    borderRadius: "12px",
    padding: "16px 20px",
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage("サービス名は必須です");
      return;
    }
    if (!categoryId) {
      setErrorMessage("カテゴリを選択してください");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          website: website.trim() || undefined,
          description: description.trim() || undefined,
          categoryId,
        }),
      });

      if (res.status === 401) {
        setErrorMessage("ログインが必要です");
        return;
      }

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setErrorMessage(data.error ?? "投稿に失敗しました。もう一度お試しください");
        return;
      }

      setSubmitted(true);
    } catch {
      setErrorMessage("通信エラーが発生しました。もう一度お試しください");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 送信成功後の表示
  if (submitted) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 20px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "50%",
            background: "rgba(22,163,74,.08)",
            border: "1px solid rgba(22,163,74,.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
          }}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--pr-green)"
            strokeWidth="2.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2
          style={{
            fontSize: "1.3rem",
            fontWeight: 700,
            color: "var(--pr-text-pri)",
            marginBottom: "8px",
            letterSpacing: "-.02em",
          }}
        >
          登録申請を受け付けました
        </h2>
        <p
          style={{
            fontSize: ".875rem",
            color: "var(--pr-text-sec)",
            marginBottom: "8px",
            lineHeight: 1.65,
            maxWidth: "360px",
          }}
        >
          審査中です。承認されると公開されます。
        </p>
        <p
          style={{
            fontSize: ".8rem",
            color: "var(--pr-text-ter)",
            marginBottom: "28px",
            lineHeight: 1.6,
            maxWidth: "360px",
          }}
        >
          通常数営業日以内に審査します。スパムや重複投稿は却下される場合があります。
        </p>
        <Link href="/" className="pr-btn-primary" style={{ padding: "8px 24px" }}>
          トップに戻る
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

      {/* サービス名 */}
      <div style={sectionStyle}>
        <label style={labelStyle} htmlFor="service-name">
          サービス名 <span style={{ color: "#dc2626" }}>*</span>
        </label>
        <input
          id="service-name"
          type="text"
          placeholder="例: Notion、ChatGPT、Figma"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
          maxLength={100}
          required
        />
      </div>

      {/* サイトURL */}
      <div style={sectionStyle}>
        <label style={labelStyle} htmlFor="service-website">
          公式サイトURL（任意）
        </label>
        <input
          id="service-website"
          type="url"
          placeholder="https://example.com"
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          style={inputStyle}
        />
        <p
          style={{
            fontSize: ".72rem",
            color: "var(--pr-text-ter)",
            marginTop: "6px",
          }}
        >
          https:// または http:// から始まるURLを入力してください
        </p>
      </div>

      {/* カテゴリ */}
      <div style={sectionStyle}>
        <label style={labelStyle} htmlFor="service-category">
          カテゴリ <span style={{ color: "#dc2626" }}>*</span>
        </label>
        <select
          id="service-category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          style={{
            ...inputStyle,
            cursor: "pointer",
          }}
          required
        >
          <option value="">カテゴリを選択してください</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* 説明 */}
      <div style={sectionStyle}>
        <label style={labelStyle} htmlFor="service-description">
          説明（任意）
        </label>
        <textarea
          id="service-description"
          rows={4}
          placeholder="サービスの概要を簡単に説明してください（500文字以内）"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ ...inputStyle, resize: "none" }}
          maxLength={500}
        />
        <div
          style={{
            fontSize: ".72rem",
            color: "var(--pr-text-ter)",
            marginTop: "6px",
            textAlign: "right",
          }}
        >
          {description.length} / 500
        </div>
      </div>

      {/* 注意事項 */}
      <div
        style={{
          padding: "12px 14px",
          background: "rgba(67,97,238,.06)",
          border: "1px solid rgba(67,97,238,.2)",
          borderRadius: "8px",
          fontSize: ".8rem",
          color: "var(--pr-text-sec)",
          lineHeight: 1.6,
        }}
      >
        <strong style={{ color: "var(--pr-text-pri)" }}>審査について：</strong>
        スパム・重複・実在しないサービスの投稿は却下されます。
        承認後はPlainrankに公開され、ユーザーがレビューを投稿できるようになります。
      </div>

      {/* エラーメッセージ */}
      {errorMessage && (
        <div
          style={{
            padding: "10px 14px",
            background: "rgba(220,38,38,.06)",
            border: "1px solid rgba(220,38,38,.25)",
            borderRadius: "8px",
            fontSize: ".82rem",
            color: "#dc2626",
          }}
        >
          {errorMessage}
        </div>
      )}

      {/* 送信ボタン */}
      <button
        type="submit"
        className="pr-btn-primary"
        disabled={isSubmitting}
        style={{
          width: "100%",
          padding: "11px",
          borderRadius: "8px",
          fontSize: ".875rem",
          fontWeight: 600,
          justifyContent: "center",
          opacity: isSubmitting ? 0.6 : 1,
          cursor: isSubmitting ? "not-allowed" : "pointer",
        }}
      >
        {isSubmitting ? "送信中..." : "登録申請を送信する"}
      </button>

      <p
        style={{
          fontSize: ".75rem",
          textAlign: "center",
          color: "var(--pr-text-ter)",
        }}
      >
        登録することで
        <Link
          href="/transparency"
          style={{ color: "var(--pr-accent)", textDecoration: "none", margin: "0 4px" }}
        >
          透明性ポリシー
        </Link>
        に同意したものとみなします
      </p>
    </form>
  );
}
