"use client"

import Link from "next/link";
import { BOOKS } from "@/data/books";
import BookFlipReader from "@/components/reader/BookFlipReader";
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

    return(
        <div className="mx-auto max-w-3/4 px-4 py-12 space-y-8">
         {/* {ヘッダー} */}
        <div className="flex items-start justify-between gap-4">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">{book.title}</h1>
                <p className="text-sm text-gray-600">{book.subtitle}</p>
            </div>
            <Link href="/" className="text-sm text-blue-600">本棚に戻る</Link>
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

        {/* {FlipBook} */}
        <BookFlipReader book={book} lang={lang} />
        </div>
    )
}
