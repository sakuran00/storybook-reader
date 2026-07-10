"use client";

import {
  useRef,
  useState,
  useCallback,
  ComponentType,
  useEffect,
  useMemo,
} from "react";
import HTMLFlipBook from "react-pageflip";
import FlipPage, { type FlipPageProps } from "./FlipPage";
import { Book } from "@/data/books";
import AudioPlayer from "@/components/ui/AudioPlayer";
import LoginModal from "../ui/LoginModal";

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
  const bookContainerRef = useRef<HTMLDivElement>(null);
  const [isOutsideClicked, setIsOutsideClicked] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(false); // モーダル表示用のstate
  const [isGrabbing, setIsGrabbing] = useState(false);

  // モバイル（640px未満）かどうかを画面幅から判定する
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => {
      setIsMobile(mq.matches);
      setCurrentPage(0); // 表示モードが変わったら最初のページに戻す
    };
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // 表示するページのリスト
  // モバイルは絵のページだけ（表紙 + 各見開きの絵）。文字ページはスキップして、
  // 音声だけは文字ページから絵のページに引き継ぐ
  const pages = useMemo(() => {
    if (!book.pages) return [];
    if (!isMobile) return book.pages;

    return book.pages
      .map((page, i) => {
        const next = book.pages?.[i + 1];
        return {
          ...page,
          audioJa: page.audioJa ?? next?.audioJa,
          audioEn: page.audioEn ?? next?.audioEn,
        };
      })
      .filter((page, i) => i === 0 || page.movie); // 表紙 or 絵（動画つき）のページだけ残す
  }, [book.pages, isMobile]);

  const totalPages = pages.length;

  // ログアウト状態（未認証）の時だけモーダルを出す
  useEffect(() => {
    const isAtEnd = isMobile
      ? currentPage >= totalPages - 1
      : Math.ceil((currentPage + 1) / 2) >= Math.floor(totalPages / 2);

    // isAuthenticated === falseの条件追加
    if (isAtEnd && !showLoginModal && !isAuthenticated) {
      const timer = setTimeout(() => {
        setShowLoginModal(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentPage, totalPages, showLoginModal, isAuthenticated, isMobile]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        bookContainerRef.current &&
        !bookContainerRef.current.contains(e.target as Node)
      ){
        setIsOutsideClicked(true);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return() => {
      document.removeEventListener("click", handleClickOutside);
    }
  }, [])

  //  イベントeの型を指定
  const handleFlip = useCallback((e: { data: number }) => {
    setCurrentPage(e.data);
    setIsOutsideClicked(false);
  }, []);

  // 開いたページの音声URLを取得
  const getAudioUrl = () => {
    if (!pages.length) return undefined;

    const pageData = pages[currentPage];

    // モバイルは1ページ表示なので、いま開いているページの音声だけを使う
    if (isMobile) {
      if (!pageData) return undefined;
      return lang === "ja" ? pageData.audioJa : pageData.audioEn;
    }

    // 見開き両ページを確認
    const nextPageData = pages[currentPage + 1];

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
    <div className="items-center relative font-klee font-semibold cursor-pointer">
      {/* showLoginModalがtrueの時のみログインモーダル表示 */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          title="最後まで読んでくれてありがとう！"
          description="他の本も読みたくなったらログインしてね"
        />
      )}

      <div 
        ref={bookContainerRef} 
        className={`mx-auto rounded-md overflow-hidden ring-slate-900/10 ${isGrabbing ? "cursor-grabbing" : "cursor-grab" }`}
        onMouseDown={() => setIsGrabbing(true)}
        onMouseUp={() => setIsGrabbing(false)}
        onMouseLeave={() => setIsGrabbing(false)} 
        
        >
        <div className="text-center text-sm -mt-1 text-taupe">
          {isMobile
            ? currentPage === 0
              ? "ひょうし"
              : `${currentPage} / ${totalPages - 1}`
            : `${Math.ceil((currentPage + 1) / 2)} / ${Math.floor(totalPages / 2)}`}
        </div>
        <HTMLFlipBook
          // ページ構成が変わったとき（モバイル⇔デスクトップ）は作り直す
          key={isMobile ? "mobile" : "desktop"}
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
          {pages.map((page, i) => {
            const isCoverJa = i === 0 && lang === "ja";
            const currentTextUrl = isCoverJa
              ? undefined
              : lang === "ja"
                ? undefined
                : page.textEn;
            const isLastPage = i === pages.length - 1;

            return (
              <FlipPageElement
                key={`${i}-${lang}`}
                imageSrc={page.image}
                textUrl={currentTextUrl}
                videoSrc={page.movie}
                posterSrc={page.image}
                isLastPage={isLastPage}
                shouldPlay={isOutsideClicked && (i === currentPage || i === currentPage + 1)}
              />
            );
          })}
        </HTMLFlipBook>
      </div>
      {/* 本の下に、全ページ共通のAudioPlayerを1つだけ配置 */}
      {/* モバイルでは見切れないように画面下に固定する */}
      <div>
        {currentAudioUrl && (
          <div className="fixed bottom-4 inset-x-4 z-30 sm:relative sm:inset-x-auto sm:bottom-auto sm:z-10 sm:flex sm:flex-col sm:items-center sm:-mt-6 sm:space-y-3">
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
