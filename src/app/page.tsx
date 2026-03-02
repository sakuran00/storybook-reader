"use client";

import { BOOKS } from "@/data/books";
import BookCard from "@/components/book/BookCard";
import { Zen_Maru_Gothic } from "next/font/google";
import { useDragScroll } from "@/hooks/useDragScroll";



const zenMaru = Zen_Maru_Gothic({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const ROTATIONS = [
  "rotate-0", "rotate-4",   "-rotate-4", 
]

export default function Home() {
  const { ref, onMouseDown, onMouseLeave, onMouseUp, onMouseMove, isDragging } = useDragScroll();

  return (
    <div className={`mx-auto max-w-7xl px-4 py-8 pt-24 ${zenMaru.className}`}>
      <h1 className="text-3xl font-bold mb-10">本棚</h1>
      <div 
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
          `}>
        {BOOKS.map((book, index) => {
          //背表紙の色と傾きをランダムに決定
          const isSpine = (index + 1) % 3 === 0; //例: 3の倍数を背表紙とする
          const isCover = !isSpine; //それ以外は表紙とする

          //色と角度を順番やランダムで決める。
          const rotation = ROTATIONS[index % ROTATIONS.length];

        return(
            <BookCard
              key={book.id}
              {...book}
              coverImageUrl={book.cover}
              isDragging={isDragging} //ドラッグ中の誤クリック防止用に渡す
              variant={isCover ? "cover" : "spine"} //偶数番目を表紙、奇数番目を背表紙とする
              rotation={rotation}
            />
          );
        })}
      </div>
      <div 
        className={`
          flex flex-row gap-8 items-end min-w-max 
          border-b-[12px] border-amber-800/60 px-10 pb-0 
          bg-gradient-to-b from-transparent via-transparent to-black/10
          rounded-lg cursor-grab active:cursor-grabbing select-none h-80
          `}>
      </div>
    </div>
  );
}