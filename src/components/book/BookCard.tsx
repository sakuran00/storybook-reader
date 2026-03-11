"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"
import { Zen_Maru_Gothic } from "next/font/google";
import FavoriteButton from "./FavoriteButton";

const zenMaru = Zen_Maru_Gothic({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

interface BookCardProps {
  id: string;
  title: string;
  subtitle: string;
  author?: string;
  coverImageUrl: string;
  disabled?: boolean;
  isDragging?: boolean; // *ドラッグ中の誤クリック防止用

  // デザイン用
  variant?: "cover" | "spine"; //表紙（cover）か背表紙（spine）か
  rotation?: string; // 傾きのクラス（例: rotate-1, -rotate-2)
}

export default function BookCard({
  id,
  title,
  subtitle,
  coverImageUrl,
  disabled = false,
  isDragging = false,
  variant = "cover",
  rotation = "rotate-0",
}: BookCardProps) {

  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false)
  
  const handleBookClick=(e: React.MouseEvent) => {
    //ドラッグ中はクリックイベントを無視
    if(isDragging){
      e.preventDefault();
      return;
    }
    //Linkの遷移を一旦止めて、アニメーションを走らせるためのstateをtrueにする
    e.preventDefault();

    //ズームアニメーション開始
    setIsTransitioning(true);

    //0.8秒後（アニメーション完了のタイミング）で遷移
    setTimeout(() => {
      router.push(`/books/${id}`);
    }, 800);
  } ;

  //表紙モードのコンテンツ
  const coverContent = (
    <div
      className={`
        relative aspect-[3/4] w-48 shadow-md transition-transform 
        duration-300 group
        ${!isTransitioning ? "hover:-translate-y-5 hover:shadow-xl/30 hover:scale-110" : "scale-110 -translate-y-5"}
        `} 
    >
      {coverImageUrl ? (
        <Image
          src={coverImageUrl}
          alt={title}
          fill
          className="object-cover rounded-sm pointer-events-none select-none"
          draggable={false} // 画像のドラッグを無効化
        />
      ) : (
        <div
          className={`flex h-full items-center justify-center text-gray-200 ${zenMaru.className}`}
        >
          No Image
        </div>
      )}
      {!disabled && (
        <div className="absolute top-2 right-2 z-10">
          <FavoriteButton bookId={id} />
        </div>
      )}

      {/* 帯のようなデザインを入れるならここ */}
    </div>
  );

  //背表紙モードのコンテンツ
  const spineContent = (
    <div
      className={`
      relative h-64 w-12 rounded-sm shadow-md transition-transform duration-300
      border border-slate-50/10 bg-slate-400/80
      ${rotation}
      ${!isTransitioning ? "hover:-translate-y-4 hover:shadow-xl/30 hover:scale-110 hover:rotate-0" : "scale-110 -translate-y-4 rotate-0 shadow-xl/30"}
      `}
    >
      {/* タイトルと著者を縦書きで表示 */}
      <div className="flex-1 flex items-center justify-center py-4">
        <h3
          className={`text-sm font-bold tracking-widest text-slate-800 ${zenMaru.className}`}
          style={{ writingMode: "vertical-rl" }}
        >
          {title}
        </h3>
      </div>

      {/* 帯部分 */}
      <div className="h-16 w-full flex items-center justify-center px-1 py-1 bg-white">
        {/* 帯の中のテキスト */}
        <span className="text-[10px] text-slate-800 break-all leading-tight text-center line-clamp-3">
          {subtitle}
        </span>
      </div>
    </div>
  );

  const content = variant === "cover" ? coverContent : spineContent;

  if (disabled) {
    return <div className="opacity-50 grayscale">{content}</div>;
  }

  return (
  <>
    <Link
      href={`/books/${id}`}
      className="block outline-none select-none appearance-none touch-none focus:outline-none focus-visible:outline-none"
      style={{ WebkitTapHighlightColor: "transparent" }}
      draggable={false}
      onClick={handleBookClick}
    >
      {content}
    </Link>

    {/* フェードアウト演出 */}
    <AnimatePresence>
      {isTransitioning && (
        <motion.div
          className="fixed inset-0 z-[9999]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        > 
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('/bg2.jpg')"
          }}
        />
        </motion.div>
      )}
    </AnimatePresence>
  </>
  );
}
