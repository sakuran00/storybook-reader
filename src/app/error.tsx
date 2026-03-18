"use client";

// Next.js のエラーバウンダリを実装
// このファイルと同じ階層・配下のページで想定外のエラーが発生したときに表示される
// props:
//   error  … 発生した Error オブジェクト（digest はサーバー側エラーの識別子）
//   reset  … エラーバウンダリをリセットして再レンダリングを試みる関数

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  // エラー内容をコンソールに記録（本番では外部ログサービスへ送ることも検討）
  useEffect(() => {
    console.error("[App Error]", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-[#f5f0e8] px-4 font-klee font-semibold text-slate-700">
      <span className="text-6xl select-none">📖</span>

      <h1 className="text-2xl text-amber-900">
        おっと、なにかがおかしいよ
      </h1>

      <p className="text-sm text-slate-500 text-center max-w-xs leading-relaxed">
        予期しないエラーが発生しました。
        <br />
        もう一度試すか、ホームへ戻ってみてください。
      </p>

      {/* 開発時のみエラーメッセージを表示 */}
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
          onClick={() => router.push("/")}
          className="rounded-full bg-amber-700/80 px-5 py-2 text-sm text-white hover:bg-amber-800 transition-colors"
        >
          ホームへ戻る
        </button>
      </div>
    </div>
  );
}
