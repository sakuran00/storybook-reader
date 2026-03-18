"use client";

import { BOOKS } from "@/data/books";
import BookCard from "@/components/book/BookCard";
import { useDragScroll } from "@/hooks/useDragScroll";
import { motion, Variants } from "framer-motion";
import { useState, useMemo } from "react";
import { Search } from "lucide-react";

const ROTATIONS = ["rotate-0", "rotate-5", "-rotate-5"];

//　親と子のアニメーション設定（variant）を定義
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: 1.5,
      ease: "easeOut",
      staggerChildren: 0.5,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: -30 },
  show: { opacity: 1, y: 0, transition: { duration: 1.5, ease: "easeOut" } },
};

type StatusFilter = "all" | "available" | "unavailable";

export default function Home() {
  const { ref, onMouseDown, onMouseLeave, onMouseUp, onMouseMove, isDragging } =
    useDragScroll();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  // 検索・フィルタリング
  const filteredBooks = useMemo(() => {
    return BOOKS.filter((book) => {
      const matchesSearch =
        searchQuery === "" ||
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || book.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 pt-24 font-klee font-semibold">
      <motion.h1
        //タイトルも少し上からふわっと出したい場合はここにも設定
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, ease: "easeOut" }}
        className="text-3xl mb-6 text-slate-800 text-shadow-md"
      >
        <span className="text-amber-700/50 select-none mr-2">✦</span>
        よみたいほんをえらんでね
        <span className="text-amber-700/50 select-none ml-2">✦</span>
      </motion.h1>

      {/* 検索・フィルターエリア */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
        className="flex flex-wrap items-center gap-3 mb-8"
      >
        {/* 検索ボックス */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="タイトル・著者で検索"
            className="pl-9 pr-4 py-2 rounded-full border border-amber-200 bg-white/80 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-300 shadow-sm w-56"
          />
        </div>

        {/* ステータスフィルター */}
        <div className="flex gap-2 text-sm">
          {(
            [
              { value: "all", label: "すべて" },
              { value: "available", label: "よめる" },
              { value: "unavailable", label: "もうすぐ" },
            ] as { value: StatusFilter; label: string }[]
          ).map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setStatusFilter(value)}
              className={`
                px-3 py-1.5 rounded-full border transition-colors
                ${
                  statusFilter === value
                    ? "bg-amber-700/80 text-white border-amber-700"
                    : "bg-white/70 text-slate-600 border-amber-200 hover:bg-amber-50"
                }
              `}
            >
              {label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* 本棚 */}
      {filteredBooks.length > 0 ? (
        <motion.div
          //親要素にvariantsを設定して、初期状態(hidden)と目標状態(show)をしてい
          variants={containerVariants}
          initial="hidden"
          animate="show"
          ref={ref}
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
          className={`
            flex flex-row gap-8 items-end min-w-max
            border-b-[12px] border-amber-800/60 px-10 pb-0 
            bg-gradient-to-b from-transparent via-transparent to-black/10
            rounded-lg cursor-grab active:cursor-grabbing select-none
            `}
        >
          {filteredBooks.map((book, index) => {
            //背表紙の色と傾きをランダムに決定
            const isSpine = (index + 1) % 3 === 0; //3の倍数を背表紙とする
            const isCover = !isSpine; //それ以外は表紙とする

            //色と角度を順番やランダムで決める。
            const rotation = ROTATIONS[index % ROTATIONS.length];

            return (
              // 子供要素をmotion.divで絵囲み、variants="item"を適用
              <motion.div
                key={book.id}
                variants={itemVariants}
                className="origin-bottom "
              >
                <BookCard
                  key={book.id}
                  {...book}
                  coverImageUrl={book.cover}
                  isDragging={isDragging} //ドラッグ中の誤クリック防止用に渡す
                  variant={isCover ? "cover" : "spine"} //偶数番目を表紙、奇数番目を背表紙とする
                  rotation={rotation}
                />
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-slate-500 text-center py-16 text-lg"
        >
          みつかりませんでした 🔍
        </motion.p>
      )}
    </div>
  );
}
