"use client";

import Link from "next/link";
import BookFlipReader from "@/components/reader/BookFlipReader";
import { BOOKS } from "@/data/books";
import { useMemo, useState, use, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";

export default function BookDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const book = useMemo(() => BOOKS.find((b) => b.id === id), [id]);
  const [lang, setLang] = useState<"ja" | "en">("ja");

  // ログイン状態を管理するstate追加
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  // ページを開いた時にログイン状態をチェック
  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setIsAuthenticated(!!user); // userがいればtrue、いなければfalse
    };
    checkUser();
  }, []);

  // 言語タブの共通スタイル
  const langClass = (active: boolean) =>
    `pb-0.5 border-b-[1.5px] text-[13px] font-bold transition-colors cursor-pointer ${
      active ? "text-ink border-ink" : "text-sand border-transparent hover:text-cocoa"
    }`;

  if (!book) {
    return (
      <div className="mx-auto w-[85%] px-4 py-12 space-y-8 font-bold">
        <Link href="/" className="text-sm text-cocoa hover:text-ink">
          ← ほんだなへ
        </Link>
        <p className="mt-4 text-ink">えほんが見つかりませんでした</p>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] flex flex-col relative overflow-hidden cursor-pointer">
      {/* ページ遷移 最初は紙の色で、ゆっくり透明になって消える */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 0.5, duration: 1.0, ease: "easeOut" }}
        className="absolute inset-0 z-50 bg-paper pointer-events-none"
      />

      {/* ヘッダー（少し上からスッと上がってくる） */}
      <motion.div
        initial={{
          opacity: 0,
          y: -15,
          filter: "blur(10px)",
        }}
        animate={{
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
        }}
        transition={{
          duration: 1.5,
          ease: [0.5, 0.8, 1, 1],
        }}
        className="sm:flex-1 flex flex-col z-20"
      >
        {/* タイトル・ナビゲーション */}
        <div className="mt-8 font-bold">
          {/* モバイル: ほんだなへ + 言語トグルを同じ行に */}
          <div className="flex items-center justify-between px-5 md:hidden mb-3">
            <Link
              href="/"
              className="group flex items-center w-fit text-[13px] text-cocoa hover:text-ink transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5 transition-transform group-hover:-translate-x-1" />
              ほんだなへ
            </Link>
            <div className="flex items-center gap-4">
              <button onClick={() => setLang("ja")} className={langClass(lang === "ja")}>
                日本語
              </button>
              <button onClick={() => setLang("en")} className={langClass(lang === "en")}>
                English
              </button>
            </div>
          </div>

          {/* モバイル: タイトル */}
          <div className="px-5 md:hidden">
            <h1 className="font-klee font-semibold text-lg text-ink tracking-[0.12em]">
              {book.title}
            </h1>
            <p className="text-[10px] text-sand tracking-[0.18em] mt-1">
              さく・え　{book.author}
            </p>
          </div>

          {/* デスクトップ: 3カラムグリッド */}
          <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] items-center">
            <div className="flex items-center justify-start ml-12">
              <Link
                href="/"
                className="group flex items-center w-fit text-[13px] text-cocoa hover:text-ink transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1.5 transition-transform group-hover:-translate-x-1" />
                ほんだなへ
              </Link>
            </div>
            <div className="text-center">
              <h1 className="font-klee font-semibold text-xl lg:text-2xl text-ink tracking-[0.22em]">
                {book.title}
              </h1>
              <p className="text-[11px] text-sand tracking-[0.2em] mt-1">
                さく・え　{book.author}
              </p>
            </div>
            <div className="flex items-center justify-end mr-12 gap-5">
              <button onClick={() => setLang("ja")} className={langClass(lang === "ja")}>
                日本語
              </button>
              <button onClick={() => setLang("en")} className={langClass(lang === "en")}>
                English
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{
          opacity: 0,
          y: -20,
          scale: 0.9,
          filter: "blur(5px)",
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
        }}
        transition={{
          duration: 1.5,
          delay: 0.25,
          ease: [0.5, 0.8, 1, 1],
        }}
        className="sm:flex-1 flex flex-col z-20"
      >
        <p className="text-center text-xs sm:text-sm font-klee font-semibold mt-2 px-6 text-taupe">
          え をうごかしたいときは、ほんのそとがわ をタッチしてみてね ✦
        </p>
      </motion.div>

      {/* {FlipBook} */}
      {/* isAuthenticatedが確認できるまでローディング　またはそのまま渡す */}
      <motion.div
        initial={{
          opacity: 0,
          y: -20,
          scale: 0.9,
          filter: "blur(5px)",
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
        }}
        transition={{
          duration: 1.5,
          delay: 0.25,
          ease: [0.5, 0.8, 1, 1],
        }}
        className="flex-1 flex flex-col z-20"
      >
        <div className="w-full flex justify-center mt-3">
          {/* モバイルは下の音声バーと重ならない範囲でなるべく大きく表示する */}
          <div className="w-full max-w-[96vw] sm:max-w-4xl h-[60vh] sm:h-[70vh] md:h-[80vh]">
            {isAuthenticated !== null && (
              <BookFlipReader
                key={lang}
                book={book}
                lang={lang}
                isAuthenticated={isAuthenticated}
              />
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
