"use client";

import { useState } from "react";

interface PendingService {
  id: string;
  name: string;
  slug: string;
  website: string | null;
  description: string | null;
  createdAt: Date;
  category: {
    name: string;
    slug: string;
  };
  submittedBy: {
    id: string;
    name: string | null;
    email: string | null;
  } | null;
}

interface PendingServiceListProps {
  services: PendingService[];
}

type ActionState = "idle" | "loading" | "approved" | "rejected";

/**
 * PENDING サービスの一覧と承認/却下ボタン（クライアントコンポーネント）
 *
 * PATCH /api/admin/services/[id] に status を送信して承認または却下する。
 */
export default function PendingServiceList({ services }: PendingServiceListProps) {
  // 各サービスの操作状態を管理
  const [states, setStates] = useState<Record<string, ActionState>>(
    Object.fromEntries(services.map((s) => [s.id, "idle"]))
  );

  const handleAction = async (id: string, status: "APPROVED" | "REJECTED") => {
    setStates((prev) => ({ ...prev, [id]: "loading" }));

    try {
      const res = await fetch(`/api/admin/services/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        alert(data.error ?? "操作に失敗しました");
        setStates((prev) => ({ ...prev, [id]: "idle" }));
        return;
      }

      setStates((prev) => ({
        ...prev,
        [id]: status === "APPROVED" ? "approved" : "rejected",
      }));
    } catch {
      alert("通信エラーが発生しました");
      setStates((prev) => ({ ...prev, [id]: "idle" }));
    }
  };

  return (
    <div
      style={{
        background: "var(--pr-surface)",
        border: "1px solid var(--pr-border)",
        borderRadius: "12px",
        overflow: "hidden",
      }}
    >
      {services.map((service, idx) => {
        const state = states[service.id] ?? "idle";
        const dateStr = new Date(service.createdAt).toISOString().split("T")[0];
        const isDone = state === "approved" || state === "rejected";

        return (
          <div
            key={service.id}
            style={{
              padding: "16px 20px",
              borderBottom: idx < services.length - 1 ? "1px solid var(--pr-border)" : "none",
              opacity: isDone ? 0.5 : 1,
              transition: "opacity .2s",
            }}
          >
            {/* サービス情報 */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: "16px",
                flexWrap: "wrap",
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                {/* 名前・カテゴリ */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginBottom: "4px",
                    flexWrap: "wrap",
                  }}
                >
                  <span
                    style={{
                      fontSize: ".95rem",
                      fontWeight: 700,
                      color: "var(--pr-text-pri)",
                    }}
                  >
                    {service.name}
                  </span>
                  <span
                    style={{
                      fontSize: ".7rem",
                      color: "var(--pr-text-ter)",
                      background: "var(--pr-surface-3)",
                      border: "1px solid var(--pr-border)",
                      borderRadius: "100px",
                      padding: "1px 8px",
                    }}
                  >
                    {service.category.name}
                  </span>
                  {isDone && (
                    <span
                      style={{
                        fontSize: ".7rem",
                        fontWeight: 700,
                        color: state === "approved" ? "#16a34a" : "#dc2626",
                        background:
                          state === "approved"
                            ? "rgba(22,163,74,.08)"
                            : "rgba(220,38,38,.08)",
                        border: `1px solid ${state === "approved" ? "rgba(22,163,74,.2)" : "rgba(220,38,38,.2)"}`,
                        borderRadius: "100px",
                        padding: "1px 8px",
                      }}
                    >
                      {state === "approved" ? "承認済み" : "却下済み"}
                    </span>
                  )}
                </div>

                {/* URL */}
                {service.website && (
                  <a
                    href={service.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: ".78rem",
                      color: "var(--pr-accent)",
                      textDecoration: "none",
                      display: "block",
                      marginBottom: "6px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {service.website}
                  </a>
                )}

                {/* 説明 */}
                {service.description && (
                  <p
                    style={{
                      fontSize: ".82rem",
                      color: "var(--pr-text-sec)",
                      lineHeight: 1.5,
                      margin: "0 0 8px",
                    }}
                  >
                    {service.description}
                  </p>
                )}

                {/* メタ情報（投稿者・日時） */}
                <div
                  style={{
                    display: "flex",
                    gap: "12px",
                    flexWrap: "wrap",
                  }}
                >
                  <span style={{ fontSize: ".72rem", color: "var(--pr-text-ter)" }}>
                    投稿者:{" "}
                    {service.submittedBy
                      ? service.submittedBy.name ?? service.submittedBy.email ?? "不明"
                      : "管理者"}
                  </span>
                  <span style={{ fontSize: ".72rem", color: "var(--pr-text-ter)" }}>
                    投稿日: {dateStr}
                  </span>
                </div>
              </div>

              {/* 承認・却下ボタン */}
              {!isDone && (
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    flexShrink: 0,
                    alignSelf: "center",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleAction(service.id, "APPROVED")}
                    disabled={state === "loading"}
                    style={{
                      padding: "6px 16px",
                      borderRadius: "6px",
                      fontSize: ".8rem",
                      fontWeight: 600,
                      background: "#16a34a",
                      color: "#fff",
                      border: "none",
                      cursor: state === "loading" ? "not-allowed" : "pointer",
                      opacity: state === "loading" ? 0.6 : 1,
                      transition: "opacity .15s",
                    }}
                  >
                    {state === "loading" ? "処理中..." : "承認"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAction(service.id, "REJECTED")}
                    disabled={state === "loading"}
                    style={{
                      padding: "6px 16px",
                      borderRadius: "6px",
                      fontSize: ".8rem",
                      fontWeight: 600,
                      background: "transparent",
                      color: "#dc2626",
                      border: "1px solid rgba(220,38,38,.4)",
                      cursor: state === "loading" ? "not-allowed" : "pointer",
                      opacity: state === "loading" ? 0.6 : 1,
                      transition: "opacity .15s",
                    }}
                  >
                    却下
                  </button>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
