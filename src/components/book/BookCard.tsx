"use client";

import Image from "next/image";
import Link from "next/link";
import { Zen_Kaku_Gothic_New, Zen_Maru_Gothic } from "next/font/google";
import FavoriteButton from "./FavoriteButton";

const zenKaku = Zen_Kaku_Gothic_New({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

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
  //表紙モードのコンテンツ
  const coverContent = (
    <div
      className={`
        relative aspect-[3/4] w-48 shadow-md transition-transform 
        duration-300 hover:-translate-y-5 hover:shadow-xl/30 hover:scale-110
        group
        `}
    >
      {coverImageUrl ? (
        <Image
          src={coverImageUrl}
          alt={title}
          fill
          className="object-cover rounded-sm"
          draggable={false} // 画像のドラッグを無効化
        />
      ) : (
        <div
          className={`flex h-full items-center justify-center text-gray-200 ${zenKaku.className}`}
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
      hover:-translate-y-4 hover:shadow-xl/30 hover:scale-110 hover:rotate-0 
      border border-gray-100 bg-white 
      ${rotation}
      `}
    >
      {/* タイトルと著者を縦書きで表示 */}
      <div className="flex-1 flex items-center justify-center py-4">
        <h3
          className={`text-sm font-bold tracking-widest text-gray-500 ${zenMaru.className}`}
          style={{ writingMode: "vertical-rl" }}
        >
          {title}
        </h3>
      </div>

      {/* 帯部分 */}
      <div className="h-16 w-full flex items-center justify-center px-1 py-1 bg-pink-200">
        {/* 帯の中のテキスト */}
        <span className="text-[10px] text-white break-all leading-tight text-center line-clamp-3">
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
    <Link
      href={`/books/${id}`}
      className="block"
      draggable={false}
      onClick={(e) => {
        if (isDragging) e.preventDefault();
      }}
    >
      {content}
    </Link>
  );
}
