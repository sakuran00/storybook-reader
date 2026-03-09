"use client";

import Link from "next/link";
import { BOOKS } from "@/data/books";
import BookFlipReader from "@/components/reader/BookFlipReader";
import { useMemo, useState, use } from "react";
import { Zen_Maru_Gothic } from "next/font/google";
import { ArrowLeft } from "lucide-react";

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
  const [currentPage, setCurrentPage] = useState(0);

  if (!book) {
    return (
      <div className="mx-auto w-[85%] px-4 py-12 space-y-8">
        <Link href="/" className="text-sum text-blue-600">
          本棚に戻る
        </Link>
        <p className="mt-4 text-gray-800">えほんが見つかりませんでした</p>
      </div>
    );
  }

  return (
    <div className={`min-h-screen pt-8 pb-16 ${zenMaru.className}`}>
      <div className="mx-auto max-w-5xl px-4 space-y-8">

        {/* ナビゲーション{本棚に戻る} */}
        <div className="flex items-center">
          <Link
          href="/"
          className="group flex items-center w-fit text-md font-medium text-slate-500 hover:text-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5 transition-transform group-hover:-translate-x-1"/>
            本棚に戻る
          </Link>
        </div>

        {/* ヘッダー＆言語切り替え */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 border-b border-slate-200/80 pb-6">
          <div className="space-y-1.5">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
              {book.title}
              </h1>
          </div>

        {/* ios風のトグルスイッチ型言語ボタン */}
        <div className="bg-slate-200/50 p-1 rounded-full flex items-center w-fit">
        <button
          onClick={() => setLang("ja")}
          className={`px-6 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ease-out cursor-pointer ${
            lang === "ja"
              ? "bg-white text-slate-800 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >日本語
        </button>
        <button
          onClick={() => setLang("en")}
          className={`px-6 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ease-out cursor-pointer ${
            lang === "en"
              ? "bg-white text-slate-800 shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >English
        </button>
      </div>
    </div>

  {/* {FlipBook} */}
    <BookFlipReader key={lang} book={book} lang={lang} />
    </div>
  </div>
  );
}
