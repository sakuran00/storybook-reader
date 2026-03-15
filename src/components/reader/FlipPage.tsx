"use client";

import { useEffect, useState, forwardRef, useRef } from "react";
import { Zen_Maru_Gothic } from "next/font/google";
import Image from "next/image";
import { Button } from "../ui/button";


const zenMaru = Zen_Maru_Gothic({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export interface FlipPageProps {
  imageSrc: string;
  textUrl?: string;
  videoSrc?: string;
  posterSrc?: string;
  isLastPage?: boolean;
}

const FlipPage = forwardRef<HTMLDivElement, FlipPageProps>(
  ({ imageSrc, textUrl, videoSrc, posterSrc, isLastPage }, ref) => {
    const [text, setText] = useState<string>("");
    const [loading, setLoading] = useState(!!textUrl);
    const videoRef = useRef<HTMLVideoElement>(null);
    const playPromiseRef = useRef<Promise<void> | null>(null);

    const handlePlay = () => {
      if (videoRef.current){
        playPromiseRef.current = videoRef.current.play().catch(() => {})
      }
    };

    const handleEnded = () => {
      if (playPromiseRef.current) {
        playPromiseRef.current.then(() => {
          videoRef.current?.pause();
        });
        playPromiseRef.current = null;
      } else if (videoRef.current) {
        videoRef.current.pause();
      }
    };

    useEffect(() => {
      if (!textUrl) return;

      fetch(textUrl)
        .then((res) => res.text())
        .then((t) => setText(t))
        .finally(() => setLoading(false));
    }, [textUrl]);

    return (
      <div ref={ref} className="flip-page relative">
        {/* 画像（上） */}
        {videoSrc ? (
          <video
          ref={videoRef}
          src={videoSrc}
          poster={posterSrc}
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
          muted
          playsInline
          controls={false}
          onMouseEnter={handlePlay}
          onMouseLeave={handleEnded}
          />
        ):(
          <div className="flip-page-image">
          <Image
            src={imageSrc}
            style={{ width: "100%", height: "100%", objectFit: "contain" }}
            alt="Story page"
            fill
            className="object-contain"
            sizes="50vw"
          />
        </div>
        )}
        

        {/* テキストエリア（textUrlがある場合のみ表示） */}
        {textUrl && (
          <div className={`flip-page-text ${zenMaru.className}`}>
            {loading ? (
              <p className="text-gray-500 text-sm">読み込み中...</p>
            ) : (
              <div className="relative mt-110 ml-5 mr-5 flex flex-col items-center">
                <pre
                  className={`whitespace-pre-wrap text-center text-2xl text-gray-800 font-bold bg-white/50 backdrop-blur-sm p-4 rounded-xl ${zenMaru.className}`}
                >
                  {text}
                </pre>
              </div>
            )}
          </div>
        )}

        {/* 最終ページだけ表示するボタン */}
        {isLastPage && (
          <div className="absolute top-[60%] left-0 right-0 flex justify-center z-50">
            <Button
              onClick={() => window.location.reload()}
              className="px-8 py-6 bg-white/90 text-slate-700 border-2 border-slate-500 rounded-full font-bold shadow-xl hover:bg-slate-50 hover:scale-105 transition-all text-md"
            >
              最初から読む
            </Button>
          </div>
        )}
      </div>
    );
  },
);

FlipPage.displayName = "FlipPage";

export default FlipPage;
