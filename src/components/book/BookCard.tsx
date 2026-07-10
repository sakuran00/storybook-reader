"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FavoriteButton from "../favorites/FavoriteButton";
import { createClient } from "@/lib/supabase/client";
import LoginModal from "../ui/LoginModal";

interface BookCardProps {
  id: string;
  title: string;
  subtitle: string;
  author?: string;
  requiresAuth?: boolean;
  coverImageUrl: string;
  disabled?: boolean;
  isDragging?: boolean; // *ドラッグ中の誤クリック防止用

  // デザイン用
  rotation?: string; // 傾きのクラス（例: rotate-3, -rotate-2)
}

export default function BookCard({
  id,
  title,
  requiresAuth,
  coverImageUrl,
  disabled = false,
  isDragging = false,
  rotation = "rotate-0",
}: BookCardProps) {
  const router = useRouter();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleBookClick = async (e: React.MouseEvent) => {
    // ドラッグ中はクリックイベントを無視
    if (isDragging) {
      e.preventDefault();
      return;
    }
    // Linkの遷移を一旦止めて、アニメーションを走らせるためのstateをtrueにする
    e.preventDefault();

    if (requiresAuth) {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setShowLoginModal(true);
        return;
      }
    }

    // ズームアニメーション開始
    setIsTransitioning(true);

    // 0.8秒後（アニメーション完了のタイミング）で遷移
    setTimeout(() => {
      router.push(`/books/${id}`);
    }, 800);
  };

  // じゅんびちゅう（読めない本）は破線のプレースホルダーで表示
  if (disabled) {
    return (
      <div className={`flex flex-col gap-2.5 w-32 sm:w-44 ${rotation}`}>
        <div className="aspect-[3/4] w-32 sm:w-44 rounded-[3px] border-[1.5px] border-dashed border-khaki bg-washi/55 flex flex-col items-center justify-center gap-2">
          <span className="text-xl text-khaki select-none">＋</span>
          <span className="text-[11px] font-bold text-sand text-center leading-relaxed">
            あたらしい本を
            <br />
            じゅんびちゅう
          </span>
        </div>
        <span className="w-max text-[10px] font-bold tracking-wider text-sand border border-beige rounded-full px-2.5 py-0.5">
          じゅんびちゅう
        </span>
      </div>
    );
  }

  return (
    <>
      {/*ログインしていないユーザーがFavoriteボタンを押した場合、の時のみログインモーダル表示 */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          title="あそんでくれてありがとう！"
          description="ログインして、ほかのほんもよんでみよう"
        />
      )}

      <div className={`flex flex-col gap-2.5 w-32 sm:w-44 ${rotation}`}>
        <Link
          href={`/books/${id}`}
          className="block outline-none select-none appearance-none touch-none focus:outline-none focus-visible:outline-none"
          style={{ WebkitTapHighlightColor: "transparent" }}
          draggable={false}
          onClick={handleBookClick}
        >
          <div
            className={`relative aspect-[3/4] w-32 sm:w-44 rounded-[3px] shadow-[0_18px_30px_-12px_rgba(58,42,24,0.45),0_2px_5px_rgba(58,42,24,0.15)] transition-transform duration-300 ease-in ${!isTransitioning ? "hover:-translate-y-2 hover:shadow-xl/30 hover:scale-105" : "scale-105 -translate-y-2"}`}
          >
            {coverImageUrl ? (
              <Image
                src={coverImageUrl}
                alt={title}
                fill
                sizes="(max-width: 640px) 128px, 176px"
                className="object-cover rounded-[3px] pointer-events-none select-none"
                draggable={false} // 画像のドラッグを無効化
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sand font-klee font-semibold">
                No Image
              </div>
            )}
          </div>
        </Link>

        {/* バッジ + おきにいりボタン */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold tracking-wider text-caramel border border-beige rounded-full px-2.5 py-0.5 whitespace-nowrap">
            よめる｜日・英
          </span>
          <FavoriteButton bookId={id} />
        </div>

        {/* タイトル */}
        <span className="text-xs sm:text-[13px] font-black text-ink leading-relaxed">
          {title}
        </span>
      </div>

      {/* フェードアウト演出（リーダーの紙背景と同じ色にフェードしてつなげる） */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div
            className="fixed inset-0 z-[9999]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeInOut" }}
          >
            <div
              className="absolute inset-0 bg-paper"
              style={{
                backgroundImage:
                  "radial-gradient(rgba(58,42,24,0.05) 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
