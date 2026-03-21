"use client";

// Next.js のエラーバウンダリを実装
// このファイルと同じ階層・配下のページで想定外のエラーが発生したときに表示される
// props:
//   error  … 発生した Error オブジェクト（digest はサーバー側エラーの識別子）
//   reset  … エラーバウンダリをリセットして再レンダリングを試みる関数

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";

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
    <div className="flex flex-col items-center justify-center gap-6.5 mt-30 px-4 font-klee font-semibold text-amber-950">
      <Image src="/book.png" alt="Book" width={200} height={150} />

      <h1 className="text-3xl">なにかがおかしいよ。おうちのひとをよんでね。</h1>

      <p className="text-sm text-amber-950/70 text-center max-w-xs leading-relaxed">
        予期しないエラーが発生しました。
        <br />
        もう一度試すか、ホーム画面へお戻りください。
      </p>

      {/* 開発時のみエラーメッセージを表示 */}
      {process.env.NODE_ENV === "development" && (
        <pre className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-xs text-red-700 max-w-md overflow-auto">
          {error.message}
          {error.digest && `\ndigest: ${error.digest}`}
        </pre>
      )}

      <div className="flex gap-3">
        <Button
          onClick={reset}
          variant={"outline"}
          size="lg"
          className="rounded-full font-semibold bg-slate-50 text-slate-800 hover:bg-slate-800 hover:text-white px-5 py-2 mr-10"
        >
          もう一度試す
        </Button>
        <Button
          onClick={() => router.push("/")}
          size="lg"
          className="rounded-full font-semibold px-5 py-2"
        >
          ホームへ戻る
        </Button>
      </div>
    </div>
  );
}
