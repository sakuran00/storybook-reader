"use client";

import { useEffect, useState, useRef } from "react";
import { usePathname } from "next/navigation";

export default function SplashScreen() {
  const pathname = usePathname();

  // セッションストレージを利用して、ユーザーがすでにスプラッシュスクリーンを見たかどうかを判定
  const [visible, setVisible] = useState(() => {
    if (window.location.pathname.startsWith("/auth/")) {
      return false;
    }
    if (!sessionStorage.getItem("splashShown")) {
      sessionStorage.setItem("splashShown", "true");
      return true; // 初めて→表示
    }
    return false; // ２回目以降→非表示
  });

  const [fading, setFading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleEnded = () => {
    if (fading) return; // 2重実行を防ぐ（タップとonEndedの両方から呼ばれるため）
    setFading(true);
    setTimeout(() => {
      sessionStorage.setItem("splashDone", "true");
      window.dispatchEvent(new CustomEvent("splashDone"));
      setVisible(false);
    }, 1500);
  };

  // ソフトナビゲーションでauthページから/に来た場合に対応
  useEffect(() => {
    if (!pathname.startsWith("/auth/") && !visible) {
      if (!sessionStorage.getItem("splashShown")) {
        sessionStorage.setItem("splashShown", "true");
        setVisible(true);
      } else if (!sessionStorage.getItem("splashDone")) {
        sessionStorage.setItem("splashDone", "true");
        window.dispatchEvent(new CustomEvent("splashDone"));
      }
    }
  }, [pathname]);

  // 再生速度を設定
  useEffect(() => {
    if (visible && videoRef.current) {
      videoRef.current.playbackRate = 1.25;
      videoRef.current.play().catch(() => {
        handleEnded();
      });
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      onClick={handleEnded} // タップでスキップ
      className="fixed inset-0 z-[9999] bg-paper flex flex-col items-center justify-center gap-7 cursor-pointer"
    >
      <video
        ref={videoRef}
        src="/opening.mp4"
        autoPlay
        muted
        playsInline
        onEnded={handleEnded}
        style={{ width: "70vw", height: "70vh", objectFit: "contain" }}
      />
      <div className="text-sm font-bold text-sand tracking-[0.12em] font-zen-maru-gothic">
        タップでスキップ
      </div>
      <div
        className="absolute inset-0 bg-paper pointer-events-none"
        style={{
          opacity: fading ? 1 : 0,
          transition: "opacity 1.5s ease-out",
        }}
      />
    </div>
  );
}
