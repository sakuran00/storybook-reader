"use client";

import { useEffect, useState } from "react";


export default function SplashScreen(){
  //セッションストレージを利用して、ユーザーがすでにスプラッシュスクリーンを見たかどうかを判定
  const[ visible, setVisible ] = useState(() => {
    if(!sessionStorage.getItem("splashShown")){
      sessionStorage.setItem("splashShown", "true");
      return true; // 初めて→表示
    }
    return false; // ２回目以降→非表示
  });

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 5000);
    return() => clearTimeout(timer);
  }, []);

  if(!visible) return null;

  return(
    <div className="fixed inset-0 z-[9999] bg-[#f4f0e8] flex items-center justify-center">
      <video 
        src="/opening.mp4"
        autoPlay
        muted
        playsInline
        width="100%"
        className="w-full h-full object-contain"
        />
    </div>
  )
}