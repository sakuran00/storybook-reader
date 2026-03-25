"use client";

import { useEffect, useState, useRef } from "react";

export default function SplashScreen() {
  // セッションストレージを利用して、ユーザーがすでにスプラッシュスクリーンを見たかどうかを判定
  const [visible, setVisible] = useState(() => {
    if (!sessionStorage.getItem("splashShown")) {
      sessionStorage.setItem("splashShown", "true");
      return true; // 初めて→表示
    }
    return false; // ２回目以降→非表示
  });

  const [fading, setFading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleEnded = () => {
    setFading(true);
    setTimeout(() => {
      sessionStorage.setItem("splashDone", "true");
      window.dispatchEvent(new CustomEvent("splashDone"));
      setVisible(false);
    }, 1500);
  };

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
    <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center">
      <video
        ref={videoRef}
        src="/opening.mp4"
        autoPlay
        muted
        playsInline
        onEnded={handleEnded}
        style={{ width: "70vw", height: "70vh", objectFit: "contain" }}
      />
      <div
        className="absolute inset-0 bg-white pointer-events-none"
        style={{
          opacity: fading ? 1 : 0,
          transition: "opacity 1.5s ease-out",
        }}
      />
    </div>
  );
}
