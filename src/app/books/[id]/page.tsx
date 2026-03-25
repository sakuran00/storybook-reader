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

  if (!book) {
    return (
      <div className="mx-auto w-[85%] px-4 py-12 space-y-8">
        <Link href="/" className="text-sm text-slate-800 shadow-sm">
          本棚に戻る
        </Link>
        <p className="mt-4 text-gray-800">えほんが見つかりませんでした</p>
      </div>
    );
  }

  return (
    <div
      className="min-h-[100dvh] flex flex-col relative overflow-hidden"
      style={{ backgroundImage: "url('bg.jpg')" }}
    >
      {/* ページ遷移 最初は真っ白（または背景色）で、ゆっくり透明になって消える */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 0.5, duration: 1.0, ease: "easeOut" }}
        className="absolute inset-0 z-50 bg-stone-50 pointer-events-none"
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
        <div className="mt-6 font-klee font-semibold">
          {/* モバイル: 本棚に戻る + 言語トグルを同じ行に */}
          <div className="flex items-center justify-between px-4 md:hidden font-bold font-zen-maru-gothic mb-2">
            <Link
              href="/"
              className="group flex items-center w-fit text-md font-medium text-slate-600 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5 transition-transform group-hover:-translate-x-1" />
              本棚に戻る
            </Link>
            <div className="bg-slate-200/50 p-1 rounded-full flex items-center w-fit">
              <button
                onClick={() => setLang("ja")}
                className={`px-4 py-1 rounded-full text-sm font-medium transition-all duration-300 ease-out cursor-pointer ${
                  lang === "ja"
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-800 hover:shadow-sm"
                }`}
              >
                日本語
              </button>
              <button
                onClick={() => setLang("en")}
                className={`px-4 py-1 rounded-full text-sm font-medium transition-all duration-300 ease-out cursor-pointer ${
                  lang === "en"
                    ? "bg-white text-slate-800 shadow-sm"
                    : "text-slate-500 hover:text-slate-800 hover:shadow-sm"
                }`}
              >
                English
              </button>
            </div>
          </div>

          {/* モバイル: タイトル */}
          <div className="text-center px-4 md:hidden">
            <h1 className="text-xl text-shadow-sm text-slate-800 tracking-tight">
              <span className="text-amber-700/50 select-none mr-2">✦</span>
              {book.title}
              <span className="text-amber-700/50 select-none ml-2">✦</span>
            </h1>
          </div>

          {/* デスクトップ: 3カラムグリッド */}
          <div className="hidden md:grid md:grid-cols-[1fr_auto_1fr] items-center">
            <div className="flex items-center justify-start ml-15 font-bold font-zen-maru-gothic">
              <Link
                href="/"
                className="group flex items-center w-fit text-md font-medium text-slate-600 hover:text-slate-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1.5 transition-transform group-hover:-translate-x-1" />
                本棚に戻る
              </Link>
            </div>
            <div className="text-center">
              <h1 className="text-xl sm:text-2xl lg:text-3xl text-shadow-sm text-slate-800 tracking-tight">
                <span className="text-amber-700/50 select-none mr-2">✦</span>
                {book.title}
                <span className="text-amber-700/50 select-none ml-2">✦</span>
              </h1>
            </div>
            <div className="flex items-center justify-end mr-15 font-bold font-zen-maru-gothic">
              <div className="bg-slate-200/50 p-1 rounded-full flex items-center w-fit">
                <button
                  onClick={() => setLang("ja")}
                  className={`px-6 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ease-out cursor-pointer ${
                    lang === "ja"
                      ? "bg-white text-slate-800 shadow-sm"
                      : "text-slate-500 hover:text-slate-800 hover:shadow-sm"
                  }`}
                >
                  日本語
                </button>
                <button
                  onClick={() => setLang("en")}
                  className={`px-6 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ease-out cursor-pointer ${
                    lang === "en"
                      ? "bg-white text-slate-800 shadow-sm"
                      : "text-slate-500 hover:text-slate-800 hover:shadow-sm"
                  }`}
                >
                  English
                </button>
              </div>
            </div>
          </div>
        </div>
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
        style={{ backgroundImage: "url('bg.jpg')" }}
      >
        <div className="w-full flex justify-center mt-3">
          <div className="w-full max-w-4xl h-[60vh] sm:h-[70vh] md:h-[80vh]">
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
