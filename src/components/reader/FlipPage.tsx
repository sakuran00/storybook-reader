"use client";

import { useEffect, useState, forwardRef } from "react";
import Image from "next/image";
import { Zen_Maru_Gothic } from "next/font/google";

const zenMaru = Zen_Maru_Gothic({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export interface FlipPageProps {
  imageSrc: string;
  textUrl?: string;
  audioUrl?: string;
}

const FlipPage = forwardRef<HTMLDivElement, FlipPageProps>(
  ({ imageSrc, textUrl, audioUrl }, ref) => {
    const [text, setText] = useState<string>("");
    const [loading, setLoading] = useState(!!textUrl);

    useEffect(() => {
      if (!textUrl) return;

      fetch(textUrl)
        .then((res) => res.text())
        .then((t) => setText(t))
        .finally(() => setLoading(false));
    }, [textUrl]);

    return (
      <div ref={ref} className="flip-page">
        {/* 画像（上） */}
        <div className="flip-page-image">
          <Image
            src={imageSrc}
            alt="Story page"
            fill
            className="object-contain"
            sizes="50vw"
          />
        </div>

        {/* テキストエリア（textUrlがある場合のみ表示） */}
        {textUrl && (
          <div className={`flip-page-text ${zenMaru.className}`}>
            {loading ? (
              <p className="text-gray-500 text-sm">読み込み中...</p>
            ) : (
              <>
                <pre className={`absolute mt-156 ml-5 w-[480px] whitespace-pre-wrap text-center text-gray-800 ${zenMaru.className}`}>
                  {text}
                </pre>
                {audioUrl && (
                  <div className="mt-3">
                    <audio controls className="w-full">
                      <source src={audioUrl} type="audio/mpeg" />
                    </audio>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    );
  },
);

FlipPage.displayName = "FlipPage";

export default FlipPage;
