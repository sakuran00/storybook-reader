"use client";

import { BOOKS } from "@/data/books";
import BookCard from "@/components/book/BookCard";
import { useDragScroll } from "@/hooks/useDragScroll";
import { motion, Variants } from "framer-motion";
import { useState, useMemo, useEffect, useRef } from "react";
import { Search, Move, Hand } from "lucide-react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import LoginModal from "@/components/ui/LoginModal";

// 本の傾き（つくえに置いた感じを出す）
const ROTATIONS = ["-rotate-3", "rotate-3", "-rotate-2"];

// 親と子のアニメーション設定（variant）を定義
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

type StatusFilter = "all" | "available" | "favorite";

export default function Home() {
  const router = useRouter();
  const { ref, onMouseDown, onMouseLeave, onMouseUp, onMouseMove, isDragging } =
    useDragScroll();

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [splashDone, setSplashDone] = useState(() => {
    if (typeof window === "undefined") return false;
    const done = sessionStorage.getItem("splashDone") === "true";
    const shown = sessionStorage.getItem("splashShown") === "true";
    if (shown && !done) sessionStorage.setItem("splashDone", "true");
    return done || shown;
  });

  useEffect(() => {
    // スプラッシュ終了イベント後に表示
    const handler = () => {
      sessionStorage.setItem("splashDone", "true");
      setSplashDone(true);
    };
    window.addEventListener("splashDone", handler);
    return () => window.removeEventListener("splashDone", handler);
  }, []);

  // ドラッグガイド（入場時に中央でふわっと出て、しばらくすると消える）
  const [guideVisible, setGuideVisible] = useState(false);
  const guideDismissed = useRef(false); // 一度操作したら再表示しない
  const dismissGuide = () => {
    guideDismissed.current = true;
    setGuideVisible(false);
  };
  useEffect(() => {
    if (!splashDone) return;
    const showTimer = setTimeout(() => {
      if (!guideDismissed.current) setGuideVisible(true);
    }, 1200);
    const hideTimer = setTimeout(() => setGuideVisible(false), 5500);
    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [splashDone]);

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

  // 「きょうのひとこと」などの飾りは、しぼりこみ中は出さない
  const showExtras = statusFilter === "all" && searchQuery.trim() === "";

  // フィルタタブの共通スタイル
  const tabClass = (active: boolean) =>
    `pb-0.5 border-b-[1.5px] text-xs font-bold cursor-pointer transition-colors ${
      active ? "text-ink border-ink" : "text-sand border-transparent hover:text-cocoa"
    }`;

  return (
    <div className="relative font-bold">
      {/*ログインしていないユーザーがFavoriteボタンを押した場合、の時のみログインモーダル表示 */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          title="あそんでくれてありがとう！"
          description="ログインして、おきにいりのほんをみつけよう"
        />
      )}

      {/* タイトル（デスクトップ：縦書き / モバイル：横書き） */}
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.0, ease: "easeOut" }}
        className="font-klee font-semibold text-ink z-10 px-6 pt-1 text-xl tracking-[0.14em] leading-relaxed sm:absolute sm:left-14 sm:top-6 sm:px-0 sm:pt-0 sm:text-[26px] sm:tracking-[0.24em] sm:whitespace-nowrap sm:[writing-mode:vertical-rl] sm:pointer-events-none"
      >
        きょうは、
        <br className="sm:hidden" />
        どのおはなしにする？
      </motion.h1>
      <p className="sm:hidden px-6 pt-2 text-[11px] text-sand">
        したに スクロールして さがしてね ↓
      </p>

      {/* ドラッグのヒント（デスクトップのみ） */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.5 }}
        className="hidden sm:flex absolute left-24 top-115 items-center gap-2.5 pointer-events-none z-10"
      >
        <div className="w-11 h-11 rounded-full border-[1.5px] border-fawn flex items-center justify-center">
          <Move className="w-4.5 h-4.5 text-taupe" strokeWidth={1.6} />
        </div>
        <div className="text-xs text-sand leading-relaxed">
          ドラッグして
          <br />
          つくえの上をさがしてね
        </div>
      </motion.div>

      {/* つくえの上（本エリア） */}
      {filteredBooks.length > 0 ? (
        <div
          ref={ref}
          onMouseDown={(e) => {
            dismissGuide(); // 操作が始まったらガイドを消す
            onMouseDown(e);
          }}
          onTouchStart={dismissGuide}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
          className="overflow-x-auto sm:cursor-grab sm:active:cursor-grabbing pb-2 [scrollbar-width:none]"
        >
          <motion.div
            // 親要素にvariantsを設定して、初期状態(hidden)と目標状態(show)を指定
            variants={containerVariants}
            initial="hidden"
            animate={splashDone ? "show" : "hidden"}
            className="flex flex-wrap justify-center items-start gap-x-6 gap-y-10 px-5 pt-8 pb-6 select-none sm:flex-nowrap sm:justify-start sm:min-w-max sm:gap-x-20 sm:pl-70 sm:pr-40 sm:pt-20 sm:pb-10"
          >
            {filteredBooks.map((book, index) => (
              <motion.div
                // 子供要素をmotion.divで囲み、variantsを適用
                key={book.id}
                variants={itemVariants}
                className={index % 2 === 1 ? "mt-10 sm:mt-24" : ""}
              >
                <BookCard
                  {...book}
                  coverImageUrl={book.cover}
                  disabled={book.status === "unavailable"}
                  isDragging={isDragging} // ドラッグ中の誤クリック防止用に渡す
                  rotation={ROTATIONS[index % ROTATIONS.length]}
                />
              </motion.div>
            ))}

            {/* きょうのひとこと（メモ） */}
            {showExtras && (
              <motion.div
                variants={itemVariants}
                className="w-44 shrink-0 rotate-6 mt-4 sm:mt-40 rounded-[4px] bg-washi border border-linen shadow-[0_10px_18px_-8px_rgba(58,42,24,0.3)] px-4 py-3.5"
              >
                <div className="font-klee font-semibold text-[13px] text-cocoa leading-loose">
                  きょうのひとこと
                </div>
                <div className="font-klee text-xs text-taupe leading-relaxed">
                  「ぴこ」といっしょに
                  <br />
                  ぼうけんのつづきを
                  <br />
                  よもうね
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      ) : (
        // みつからなかったとき（付箋）
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mx-auto mt-16 sm:mt-40 w-56 -rotate-2 rounded-[4px] bg-cream border border-butter shadow-[0_10px_18px_-8px_rgba(58,42,24,0.3)] px-5 py-4 font-klee font-semibold text-[13px] text-ochre leading-loose"
        >
          みつからなかったよ。
          <br />
          ことばをかえて
          <br />
          さがしてみてね
        </motion.div>
      )}

      {/* ドラッグガイド（デスクトップのみ・入場時に中央で波紋つきで表示） */}
      <div
        className={`hidden sm:block fixed left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none transition-opacity duration-700 ${
          guideVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="relative w-[104px] h-[104px]">
          {/* 波紋（内側と外側で少しタイミングをずらす） */}
          <span className="absolute left-1/2 top-1/2 w-20 h-20 rounded-full bg-ink/15 animate-drag-ripple" />
          <span
            className="absolute left-1/2 top-1/2 w-40 h-40 rounded-full bg-ink/10 animate-drag-ripple"
            style={{ animationDelay: "0.45s" }}
          />
          {/* 手のアイコン */}
          <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-washi border border-linen shadow-[0_10px_24px_-8px_rgba(58,42,24,0.4)] flex items-center justify-center">
            <Hand className="w-6 h-6 text-cocoa" strokeWidth={1.6} />
          </span>
        </div>
      </div>

      {/* フッター */}
      <div className="hidden sm:block fixed left-14 bottom-8 z-10 text-[11px] tracking-[0.18em] text-fawn pointer-events-none">
        STORYBOOK READER — えほんの つくえ
      </div>
      <div className="sm:hidden text-center text-[10px] tracking-[0.18em] text-fawn pt-6 pb-40">
        STORYBOOK READER — えほんの つくえ
      </div>

      {/* 検索・フィルターエリア（画面下に固定） */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
        className="fixed bottom-6 left-4 right-4 sm:left-auto sm:right-14 sm:bottom-8 z-20 flex flex-col sm:flex-row items-center gap-2.5 sm:gap-5"
      >
        {/* ステータスフィルター */}
        <div className="order-1 sm:order-2 flex gap-5 bg-paper/90 sm:bg-transparent rounded-full px-4 py-1.5 sm:p-0">
          <button
            onClick={() => setStatusFilter("all")}
            className={tabClass(statusFilter === "all")}
          >
            すべて
          </button>
          <button
            onClick={() => setStatusFilter("available")}
            className={tabClass(statusFilter === "available")}
          >
            よめる
          </button>
          <button
            onClick={async () => {
              const supabase = createClient();
              const {
                data: { user },
              } = await supabase.auth.getUser();
              if (!user) {
                setShowLoginModal(true);
              } else {
                router.push("/favorites");
              }
            }}
            className={tabClass(false)}
          >
            おきにいり
          </button>
        </div>

        {/* 検索ボックス */}
        <div className="order-2 sm:order-1 relative w-full sm:w-44">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-sand pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="さがす"
            className="w-full pl-9 pr-4 py-2.5 sm:py-2 rounded-full border-[1.5px] border-beige bg-washi/95 text-[13px] sm:text-xs font-bold text-ink placeholder:text-sand focus:outline-none focus:border-fawn shadow-[0_10px_24px_-8px_rgba(58,42,24,0.2)]"
          />
        </div>
      </motion.div>
    </div>
  );
}
