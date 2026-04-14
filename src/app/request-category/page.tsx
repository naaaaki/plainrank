"use client";

import Link from "next/link";
import { useState } from "react";

export default function RequestCategoryPage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
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
      setErrorMessage("カテゴリ名を入力してください");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/category-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim() || undefined,
        }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        setErrorMessage(data.error ?? "送信に失敗しました。もう一度お試しください");
        return;
      }

      setSubmitted(true);
    } catch {
      setErrorMessage("通信エラーが発生しました。もう一度お試しください");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <main style={{ background: "var(--pr-bg)", minHeight: "100vh" }}>
        <div className="pr-container" style={{ paddingTop: "80px", paddingBottom: "60px", maxWidth: "560px", textAlign: "center" }}>
          <div style={{
            width: "56px", height: "56px", borderRadius: "50%",
            background: "rgba(22,163,74,.08)", border: "1px solid rgba(22,163,74,.2)",
            display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px",
          }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--pr-green)" strokeWidth="2.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--pr-text-pri)", marginBottom: "8px" }}>
            申請を受け付けました
          </h1>
          <p style={{ fontSize: ".875rem", color: "var(--pr-text-sec)", marginBottom: "28px", lineHeight: 1.65 }}>
            ご申請ありがとうございます。内容を確認のうえ、カテゴリの追加を検討します。
          </p>
          <Link href="/submit" className="pr-btn-primary" style={{ padding: "8px 24px" }}>
            サービス登録に戻る
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main style={{ background: "var(--pr-bg)", minHeight: "100vh" }}>
      <div className="pr-container" style={{ paddingTop: "24px", paddingBottom: "60px", maxWidth: "560px" }}>

        {/* パンくず */}
        <nav style={{ fontSize: ".78rem", color: "var(--pr-text-ter)", marginBottom: "20px", display: "flex", alignItems: "center", gap: "6px" }}>
          <Link href="/submit" className="pr-breadcrumb-link">サービスを登録する</Link>
          <span>›</span>
          <span style={{ color: "var(--pr-text-pri)" }}>カテゴリを申請する</span>
        </nav>

        <h1 style={{ fontSize: "1.3rem", fontWeight: 700, color: "var(--pr-text-pri)", letterSpacing: "-.02em", marginBottom: "6px" }}>
          カテゴリを申請する
        </h1>
        <p style={{ fontSize: ".875rem", color: "var(--pr-text-sec)", marginBottom: "24px", lineHeight: 1.6 }}>
          希望するカテゴリ名と理由を送ってください。内容を確認して追加を検討します。
        </p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>

          <div style={sectionStyle}>
            <label style={labelStyle} htmlFor="cat-name">
              カテゴリ名 <span style={{ color: "#dc2626" }}>*</span>
            </label>
            <input
              id="cat-name"
              type="text"
              placeholder="例: ノーコードツール、HR Tech、セキュリティ"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={inputStyle}
              maxLength={100}
              required
            />
          </div>

          <div style={sectionStyle}>
            <label style={labelStyle} htmlFor="cat-description">
              理由・説明（任意）
            </label>
            <textarea
              id="cat-description"
              rows={4}
              placeholder="どんなサービスが該当するか、なぜ必要か、など"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ ...inputStyle, resize: "none" }}
              maxLength={500}
            />
          </div>

          {errorMessage && (
            <div style={{ padding: "10px 14px", background: "rgba(220,38,38,.06)", border: "1px solid rgba(220,38,38,.25)", borderRadius: "8px", fontSize: ".82rem", color: "#dc2626" }}>
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            className="pr-btn-primary"
            disabled={isSubmitting}
            style={{ width: "100%", padding: "11px", borderRadius: "8px", fontSize: ".875rem", fontWeight: 600, justifyContent: "center", opacity: isSubmitting ? 0.6 : 1, cursor: isSubmitting ? "not-allowed" : "pointer" }}
          >
            {isSubmitting ? "送信中..." : "申請する"}
          </button>

        </form>
      </div>
    </main>
  );
}
