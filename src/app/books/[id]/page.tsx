"use client"

import Link from "next/link";
import { BOOKS } from "@/data/books";
import TextPage from "@/components/reader/TextPage";
import { useMemo, useState, use } from "react"

export default function BookDetail({ params }: { params: Promise<{ id: string }> }){
    const { id } = use(params);
    const book = useMemo(() => BOOKS.find((b) => b.id === id),[id]);
    const[lang, setLang] =useState<"ja" | "en">("ja")
    const[currentPage, setCurrentPage] = useState(0);

    if(!book){
        return(
            <div className="mx-auto max-w-5xl px-4 py-12">
                <Link href="/" className="text-sum text-blue-600">本棚に戻る</Link>
                <p className="mt-4 text-gray-800">えほんが見つかりませんでした</p>
            </div>
        );
    }

    const totalPages = book.pages?.length || 0;
    const currentPageData = book.pages?.[currentPage]

    return(
        <div className="mx-auto max-w-3/4 px-4 py-12 space-y-8">
         {/* {ヘッダー} */}
        <div className="flex items-start justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">{book.title}</h1>
                <p className="text-sm text-gray-600">{book.subtitle}</p>
            </div>
            <Link href="/" className="text-sm text-blue-600"></Link>
        </div>

        {/* {言語切り替え} */}
        <div className="flex item-center gap-3">
            <span className="text-sm text-gray-700">言語：</span>
            <button 
                onClick={() => setLang("ja")}
                className={`rounded-full border px-3 py-1 text-sm ${lang== "ja" ? "bg-gray-900 text-white" : "bg-white text-gray-800"}`}
                >
                    日本語
            </button>
            <button 
                onClick={() => setLang("en") }
                className={`rounded-full border px-3 py-1 text-sm ${lang== "en" ? "bg-gray-900 text-white" : "bg-white text-gray-800"}`}
                >
                    English
            </button>
        </div>

        {/* ページ番号表示 */}
        <div className="text-center text-sm text-gray-600">
            {currentPage + 1} / {totalPages}
        </div>

        {/* 現在のページのみ表示 */}
        {currentPageData && (
            <TextPage
            key={currentPage}
            imageSrc={currentPageData.image}
            textUrl={lang === "ja" ? currentPageData.textJa : currentPageData.textEn}
            audioUrl={lang === "ja" ? currentPageData.audioJa : currentPageData.audioEn}
        />
        )}
        {/* ページ送りボタン*/}
        <div className="flex items-center justify-between gap-4">
            <button
                onClick={() => setCurrentPage( prev => Math.max(prev -1, 0))}
                disabled={currentPage === 0}
                className="rounded-full bg-gray-200 px-4 py-2 text-sm text-gray-800 disabled:opacity-50"
                >
                ← 前へ
            </button>
            <button
                onClick={() => setCurrentPage( prev => Math.min(totalPages -1, prev +1 ))}
                disabled={currentPage === totalPages -1}
                className = "rounded-full border border-gray-300 px-6 py-2 text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100"
                >
                次へ →
            </button>
        </div>
        </div>
    )
}
