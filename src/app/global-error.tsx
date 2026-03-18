"use client";

// global-error.tsx は root layout（layout.tsx）自体でエラーが起きたときの最後の砦
// Header や ToastProvider など layout が丸ごと壊れた場合に表示される
// ※ error.tsx と違い、<html><body> タグを自分で書く必要がある（layout が使えないため）

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Global Error]", error);
  }, [error]);

  return (
    <html lang="ja">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "1.5rem",
          backgroundColor: "#f5f0e8",
          fontFamily: "sans-serif",
          color: "#44403c",
        }}
      >
        <span style={{ fontSize: "4rem" }}>📚</span>

        <h1 style={{ fontSize: "1.5rem", color: "#78350f", margin: 0 }}>
          アプリの読み込みに失敗しました
        </h1>

        <p
          style={{
            fontSize: "0.875rem",
            color: "#78716c",
            textAlign: "center",
            lineHeight: 1.8,
            margin: 0,
          }}
        >
          深刻なエラーが発生しました。
          <br />
          ページを再読み込みしてください。
        </p>

        {process.env.NODE_ENV === "development" && (
          <pre
            style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "0.5rem",
              padding: "0.75rem 1rem",
              fontSize: "0.75rem",
              color: "#b91c1c",
              maxWidth: "28rem",
              overflow: "auto",
            }}
          >
            {error.message}
            {error.digest && `\ndigest: ${error.digest}`}
          </pre>
        )}

        <button
          onClick={reset}
          style={{
            borderRadius: "9999px",
            backgroundColor: "#92400e",
            color: "#fff",
            padding: "0.5rem 1.5rem",
            fontSize: "0.875rem",
            border: "none",
            cursor: "pointer",
          }}
        >
          再読み込みする
        </button>
      </body>
    </html>
  );
}
