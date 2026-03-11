"use client";

import { BOOKS } from "@/data/books";
import BookCard from "@/components/book/BookCard";
import { Zen_Maru_Gothic, Zen_Kaku_Gothic_Antique } from "next/font/google";
import { useDragScroll } from "@/hooks/useDragScroll";
import { motion, Variants } from "framer-motion";

const zenMaru = Zen_Maru_Gothic({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const zenKaku = Zen_Kaku_Gothic_Antique({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const ROTATIONS = ["rotate-0", "rotate-5", "-rotate-5"];

//　親と子のアニメーション設定（variant）を定義
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      duration: 1.5,
      ease: "easeOut",
      staggerChildren: 0.5
    }
  }
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y:-30 },
  show: { opacity: 1, y: 0, transition: { duration: 1.5, ease: "easeOut" }}
};

export default function Home() {
  const { ref, onMouseDown, onMouseLeave, onMouseUp, onMouseMove, isDragging } =
    useDragScroll();

  return (
    <div className={`mx-auto max-w-7xl px-4 py-8 pt-24 ${zenMaru.className}`}>
      <motion.h1
      //タイトルも少し上からふわっと出したい場合はここにも設定
      initial={{ opacity: 0, y:-30}}
      animate={{ opacity: 1, y:0 }}
      transition={{ duration: 1.0, ease: "easeOut"}}
      className="text-3xl font-bold mb-10 text-slate-800 text-shadow-md"
      >
        よみたいほんをえらんでね
      </motion.h1>

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
          border-b-[12px] border-amber-800/60 px-10 pb-0  /* 下のパディングを0にして、本と棚板を密着させる */

           /* 影部分 */
          bg-gradient-to-b from-transparent via-transparent to-black/10
    
          /* その他のスタイル */
          rounded-lg cursor-grab active:cursor-grabbing select-none
          `}
      >

        {BOOKS.map((book, index) => {
          //背表紙の色と傾きをランダムに決定
          const isSpine = (index + 1) % 3 === 0; //3の倍数を背表紙とする
          const isCover = !isSpine; //それ以外は表紙とする

          //色と角度を順番やランダムで決める。
          const rotation = ROTATIONS[index % ROTATIONS.length];

          return (
            // 子供要素をmotion.divで絵囲み、variants="item"を適用
          <motion.div key={book.id} variants={itemVariants} className="origin-bottom"> 
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

        <motion.div
        initial={{ opacity:0 }}
        animate={{ opacity:1 }}
        transition={{ duration: 1.0, delay: 1.5, ease: "easeOut" }}
        className={`
          flex flex-row gap-8 items-end min-w-max 
          border-b-[12px] border-amber-800/60 px-10 pb-0 
          bg-gradient-to-b from-transparent via-transparent to-black/10
          rounded-lg cursor-grab active:cursor-grabbing select-none h-80
          `}
        ></motion.div>
  </div>
  );
}
