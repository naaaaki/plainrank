"use client";

import { useState } from "react";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Submission state of the newsletter form */
type FormStatus = "idle" | "submitting" | "success" | "error";

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

/**
 * NewsletterForm
 *
 * A simple email capture form for the Plainrank newsletter.
 * Submits to POST /api/newsletter and shows inline feedback.
 *
 * Design: matches the Plainrank dark-friendly design system (CSS variables).
 * External mail delivery is intentionally excluded — email is stored in DB only.
 */
export default function NewsletterForm() {
  const [email, setEmail] = useState<string>("");
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data: { message?: string; error?: string } = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error ?? "登録に失敗しました。再度お試しください。");
        setStatus("error");
        return;
      }

      setStatus("success");
      setEmail("");
    } catch {
      setErrorMessage("通信エラーが発生しました。再度お試しください。");
      setStatus("error");
    }
  }

  return (
    <section className="pr-newsletter-section">
      <div className="pr-container">
        <div className="pr-newsletter-inner">
          <div className="pr-newsletter-copy">
            <h2 className="pr-newsletter-title">新着レビュー・ランキング更新をお知らせ</h2>
            <p className="pr-newsletter-sub">
              注目ツールの新着レビューやランキング変動を受け取れます。スパムは送りません。
            </p>
          </div>

          {status === "success" ? (
            <p className="pr-newsletter-success">
              ご登録ありがとうございます！更新情報をお送りします。
            </p>
          ) : (
            <form onSubmit={handleSubmit} className="pr-newsletter-form" noValidate>
              <div className="pr-newsletter-field-row">
                <label htmlFor="newsletter-email" className="sr-only">
                  メールアドレス
                </label>
                <input
                  id="newsletter-email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  disabled={status === "submitting"}
                  autoComplete="email"
                  className="pr-newsletter-input"
                />
                <button
                  type="submit"
                  disabled={status === "submitting" || !email.trim()}
                  className="pr-newsletter-btn"
                >
                  {status === "submitting" ? "送信中…" : "登録する"}
                </button>
              </div>

              {status === "error" && (
                <p className="pr-newsletter-error" role="alert">
                  {errorMessage}
                </p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
