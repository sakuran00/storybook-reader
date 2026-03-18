"use client";

// auth セグメント専用のエラーバウンダリ
// サインイン・サインアップページで想定外のエラーが起きたときに表示される
// （バリデーションエラーや「メール重複」などの想定内エラーは各フォームで処理済み）

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AuthError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error("[Auth Error]", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#f5f0e8] px-4 font-klee font-semibold text-slate-700">
      <span className="text-6xl select-none">🔐</span>

      <h1 className="text-2xl text-amber-900">
        ログインに問題が発生しました
      </h1>

      <p className="text-sm text-slate-500 text-center max-w-xs leading-relaxed">
        認証の処理中に予期しないエラーが発生しました。
        <br />
        もう一度お試しいただくか、しばらく時間をおいてください。
      </p>

      {process.env.NODE_ENV === "development" && (
        <pre className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-xs text-red-700 max-w-md overflow-auto">
          {error.message}
          {error.digest && `\ndigest: ${error.digest}`}
        </pre>
      )}

      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-full border border-amber-300 bg-white px-5 py-2 text-sm text-amber-800 hover:bg-amber-50 transition-colors"
        >
          もう一度試す
        </button>
        <button
          onClick={() => router.push("/auth/signin")}
          className="rounded-full bg-amber-700/80 px-5 py-2 text-sm text-white hover:bg-amber-800 transition-colors"
        >
          サインインへ戻る
        </button>
      </div>
    </div>
  );
}
