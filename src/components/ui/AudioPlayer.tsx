"use client";

import { useRef, useState, useEffect } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

interface AudioPlayerProps {
  src: string;
  autoPlay?: boolean;
}

export default function AudioPlayer({ src, autoPlay = false }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  //リセット
  useEffect(() => {
    if(autoPlay && audioRef.current){
      // 少し遅延させて自動再生（ページめくりの余韻のため）
      const timer = setTimeout(() => {
        audioRef.current?.play().catch(() => {
          // 自動再生がブラウザにブロックされた場合は何もしない
          console.log("Autoplay blocked");
        });
      }, 800);
      return() => clearTimeout(timer);
    }
  }, [src, autoPlay]);

  //再生・一時停止の切り替え
  const togglePlay = () => {
    if (!audioRef.current) return;

    if(isPlaying){
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if(audioRef.current){
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      if (duration > 0 ){
        setProgress((current / duration ) * 100)
      }
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(100);
  };

  const handleReplay = () => {
    if(audioRef.current){
      audioRef.current.currentTime = 0;
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  return(
    <div 
      className="flex items-center gap-3 bg-pink-100/50 backdrop-blur-sm p-3 rounded-2xl shadow-sm border border-pink-100 max-w-sm mx-auto mt-4"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onMouseUp={(e) => e.stopPropagation()}
      onTouchStart={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
      onMouseMove={(e) => e.stopPropagation()}
      onMouseLeave={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      onPointerUp={(e) => e.stopPropagation()}
      onPointerMove={(e) => e.stopPropagation()}
      onPointerLeave={(e) => e.stopPropagation()}
    >
      <audio 
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* 再生/一時停止ボタン */}
      <button
        onClick={togglePlay}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-pink-400 text-white shadow hover:bg-pink-500 transition-all active:scale-95 flex-shrink-0"
        aria-label={isPlaying ? "一時停止" : "再生"}
      >
        {isPlaying ? (<Pause className="w-5 h-5 fill-current" />
        ) : (
          <Play className="w-5 h-5 fill-current ml-1" />
        )}
      </button>

      {/* プログレスバー */}
      <div className="flex-1 h-2 bg-pink-100 rounded-full overflow-hidden relative">
        <div 
          className="absolute top-0 left-0 h-full bg-pink-400 transition-all duration-300 ease-linear rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* リプレイボタン */}
      <button
        onClick={handleReplay}
        className="p-2 text-pink-300 hover:text-pink-500 transition-colors"
        aria-label="最初から再生"
      >
        <RotateCcw className="w-5 h-5" />
      </button>
    </div>      
  );
}