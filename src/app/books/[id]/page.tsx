"use client";

import Link from "next/link";
import BookFlipReader from "@/components/reader/BookFlipReader";
import { BOOKS } from "@/data/books";
import { useMemo, useState, use, useEffect } from "react";
import { Zen_Maru_Gothic } from "next/font/google";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { motion } from "framer-motion";

const zenMaru = Zen_Maru_Gothic({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

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
        <Link href="/" className="text-sum text-slate-800 shadow-sm">
          本棚に戻る
        </Link>
        <p className="mt-4 text-gray-800">えほんが見つかりませんでした</p>
      </div>
    );
  }

  return (
    <div
      className={`min-h-[100dvh] flex flex-col relative overflow-hidden ${zenMaru.className}`}
      style={{ backgroundImage: "url('bg2.jpg')" }}
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
        className="flex-1 flex flex-col z-20"
      >
        {/* タイトル・ナビゲーション（元のまま） */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center mt-6">
          {/* 左側:本棚に戻る */}
          <div className="flex items-center justify-start ml-15">
            <Link
              href="/"
              className="group flex items-center w-fit text-md font-medium text-slate-600 hover:text-slate-800 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5 transition-transform group-hover:-translate-x-1" />
              本棚に戻る
            </Link>
          </div>

          {/* 中央；タイトル */}
          <div className="text-center">
            <h1 className="text-xl sm:text-2xl lg:text-3xl text-shadow-sm font-extrabold text-slate-800 tracking-tight">
              {book.title}
            </h1>
          </div>

          {/* ios風のトグルスイッチ型言語ボタン */}
          <div className="flex items-center justify-start auto md:justify-end mr-15">
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
        style={{ backgroundImage: "url('bg2.jpg')" }}
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
