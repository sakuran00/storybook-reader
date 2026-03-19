"use client";

import { useRef, useState, useCallback, ComponentType, useEffect } from "react";
import HTMLFlipBook from "react-pageflip";
import FlipPage, { type FlipPageProps } from "./FlipPage";
import { Book } from "@/data/books";
import AudioPlayer from "@/components/ui/AudioPlayer";
import { SigninForm } from "@/components/signin";

// FlipPageの型を調整（ESLint対策でanyを使わない）
const FlipPageElement = FlipPage as unknown as ComponentType<FlipPageProps>;

interface BookFlipReaderProps {
  book: Book;
  lang: "ja" | "en";
  isAuthenticated: boolean | null; // ログイン状態を受け取る
}

export default function BookFlipReader({
  book,
  lang,
  isAuthenticated,
}: BookFlipReaderProps) {
  // refの型を「何でも入る箱」にして、ESLintのチェックだけ外す
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const flipBookRef = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false); // モーダル表示用のstate

  const totalPages = book.pages?.length || 0;

  // ログアウト状態（未認証）の時だけモーダルを出す
  useEffect(() => {
    const isAtEnd = currentPage >= totalPages - 2;

    // isAuthenticated === falseの条件追加
    if (isAtEnd && !showLoginModal && !isAuthenticated) {
      const timer = setTimeout(() => {
        setShowLoginModal(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentPage, totalPages, showLoginModal, isAuthenticated]);

  //  イベントeの型を指定
  const handleFlip = useCallback((e: { data: number }) => {
    setCurrentPage(e.data);
  }, []);

  // 開いたページの音声URLを取得
  const getAudioUrl = () => {
    if (!book.pages) return undefined;

    const pageData = book.pages[currentPage];
    // 見開き両ページを確認
    const nextPageData = book.pages[currentPage + 1];

    if (pageData && (pageData.audioJa || pageData.audioEn)) {
      return lang === "ja" ? pageData.audioJa : pageData.audioEn;
    }
    if (nextPageData && (nextPageData.audioJa || nextPageData.audioEn)) {
      return lang === "ja" ? nextPageData.audioJa : nextPageData.audioEn;
    }
    return undefined;
  };

  const currentAudioUrl = getAudioUrl();

  return (
    <div className={`items-center relative font-klee font-semibold`}>
      {/* showLoginModalがtrueの時のみログインモーダル表示 */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm animate-in fade-in duration-1000">
          <div className="relative w-full max-w-md p-4 animate-in slide-in-from-bottom-10 fade-in duration-700 delay-300 fill-mode-both">
            {/* メッセージ */}
            <div className="mb-4 text-center">
              <h2 className="text-2xl font-bold text-slate-800">
                最後まで読んでくれてありがとう！
              </h2>
              <p className="text-slate-600 mt-2">
                他の本もよみたくなったらログインしてね
              </p>
            </div>

            {/* サインインフォーム */}
            <div className="shadow-2xl rounded-xl overflow-hidden border border-slate-100">
              <SigninForm />
            </div>

            <div className="text-center mt-4">
              <button
                onClick={() => setShowLoginModal(false)}
                className="text-sm text-slate-500 hover:text-slate-800 underline underline-offset-4 transition-colors"
              >
                今はいい
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto rounded-md overflow-hidden ring-slate-900/10 ">
        <div className="text-center text-sm -mt-1 text-gray-600">
          {currentPage + 1} / {totalPages}
        </div>
        <HTMLFlipBook
          width={400}
          height={560}
          size="stretch"
          minWidth={280}
          maxWidth={800}
          minHeight={400}
          maxHeight={1120}
          maxShadowOpacity={0.5}
          showCover={true}
          mobileScrollSupport={true}
          ref={flipBookRef}
          onFlip={handleFlip}
          className="flipbook"
          style={{}}
          startPage={0}
          drawShadow={true}
          flippingTime={1000}
          usePortrait={true}
          startZIndex={0}
          autoSize={true}
          clickEventForward={true}
          useMouseEvents={true}
          swipeDistance={30}
          showPageCorners={true}
          disableFlipByClick={false}
        >
          {book.pages?.map((page, i) => {
            const isCoverJa = i === 0 && lang === "ja";
            const currentTextUrl = isCoverJa
              ? undefined
              : lang === "ja"
                ? undefined
                : page.textEn;
            const isLastPage = i === (book.pages?.length || 0) - 1;

            return (
              <FlipPageElement
                key={`${i}-${lang}`}
                imageSrc={page.image}
                textUrl={currentTextUrl}
                videoSrc={page.movie}
                posterSrc={page.image}
                isLastPage={isLastPage}
              />
            );
          })}
        </HTMLFlipBook>
      </div>
      {/* 本の下に、全ページ共通のAudioPlayerを1つだけ配置 */}
      <div>
        {currentAudioUrl && (
          <div className="flex flex-col items-center -mt-6 z-10 relative space-y-3">
            <AudioPlayer
              src={currentAudioUrl}
              autoPlay={true} // ページをめくったら自動で鳴らす
            />
          </div>
        )}
      </div>
    </div>
  );
}
