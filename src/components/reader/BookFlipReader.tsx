"use client";

import { useRef, useState, useCallback, ComponentType } from "react";
import HTMLFlipBook from "react-pageflip";
import FlipPage, { type FlipPageProps } from "./FlipPage";
import { Book } from "@/data/books";
import { Zen_Maru_Gothic } from "next/font/google";
import AudioPlayer from "@/components/ui/AudioPlayer";

const zenMaru = Zen_Maru_Gothic({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

// FlipPageの型を調整（ESLint対策でanyを使わない）
const FlipPageElement = FlipPage as unknown as ComponentType<FlipPageProps>;

interface BookFlipReaderProps {
  book: Book;
  lang: "ja" | "en";
}

export default function BookFlipReader({ book, lang }: BookFlipReaderProps) {
  // refの型を「何でも入る箱」にして、ESLintのチェックだけ外す
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const flipBookRef = useRef<any>(null);
  const [currentPage, setCurrentPage] = useState(0);

  //  イベントeの型を指定
  const handleFlip = useCallback((e: { data: number }) => {
    setCurrentPage(e.data);
  }, []);

  const handleNext = () => {
    // ここで「pageFlipという機能があるはず」と伝える
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().flipNext();
    }
  };

  const handlePrev = () => {
    if (flipBookRef.current) {
      flipBookRef.current.pageFlip().flipPrev();
    }
  };

  const totalPages = book.pages?.length || 0;

  //開いたページの音声URLを取得
  const getAudioUrl = () => {
    if (!book.pages) return undefined;

    const pageData = book.pages[currentPage];
    //見開き両ページを確認
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
    <div className={`space-y-6 ${zenMaru.className}`}>
      <div className="text-center text-sm text-gray-600">
        {currentPage + 1} / {totalPages}
      </div>

      <div>
        {/* 本の上に、全ページ共通のAudioPlayerを1つだけ配置 */}
        {currentAudioUrl && (
          <div className="relative z-10 flex justify-center">
            <AudioPlayer
              src={currentAudioUrl}
              autoPlay={true} //ページをめくったら自動で鳴らす
            />
          </div>
        )}

        <div>
          <HTMLFlipBook
            width={500}
            height={700}
            size="stretch"
            minWidth={315}
            maxWidth={1000}
            minHeight={400}
            maxHeight={1533}
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
                : lang === "ja" ? undefined : page.textEn;
              const isLastPage = i === (book.pages?.length || 0) - 1;

              return(
              <FlipPageElement
                key={`${i}-${lang}`}
                imageSrc={page.image}
                textUrl={currentTextUrl}
                isLastPage={isLastPage}
              />
            );
          })}
          </HTMLFlipBook>
        </div>

        <div className="flex items-center justify-between gap-4">
          <button
            onClick={handlePrev}
            disabled={currentPage === 0}
            className="rounded-full bg-gray-200 px-4 py-2 text-sm text-gray-800 disabled:opacity-50"
          >
            ← 前へ
          </button>
          <button
            onClick={handleNext}
            disabled={currentPage === totalPages - 1}
            className="rounded-full border border-gray-300 px-6 py-2 text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            次へ →
          </button>
        </div>
      </div>
    </div>
  );
}
