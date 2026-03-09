"use client";

import { useRef, useState, useEffect } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";

interface AudioPlayerProps {
  src: string;
  autoPlay?: boolean;
}

// 秒数を0:00形式に変換する関数
const formatTime = (time: number) => {
  if (isNaN(time)) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

export default function AudioPlayer({
  src,
  autoPlay = false,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0〜100の割合で管理
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  // srcが変わるたびに再生状態をリセットして、autoPlayがtrueなら自動で再生する
  useEffect(() => {
    if (!audioRef.current) return;

    if (autoPlay) {
      audioRef.current.play().catch((err) => {
        console.warn("自動再生はブロックされました;", err);
        setIsPlaying(false);
      });
    } else {
      audioRef.current.pause();
    }
  }, [src, autoPlay]);

  // マウスやタッチでのドラッグ操作のイベントリスナー
  useEffect(() => {
    if (!isDragging) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (!progressBarRef.current || !audioRef.current) return;
      const rect = progressBarRef.current.getBoundingClientRect();
      //バーをはみ出しても0~1の間に収める
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const percentage = x / rect.width;

      setProgress(percentage * 100);
      setCurrentTime(percentage * duration);
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (!progressBarRef.current || !audioRef.current) return;

      const rect = progressBarRef.current.getBoundingClientRect();
      const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const percentage = x / rect.width;

      audioRef.current.currentTime = percentage * duration;
      setIsDragging(false);
    };

    //window全体でイベントを検知させる（バーからマウスがはみ出しても大丈夫なように）
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDragging, duration]);

  // 再生・一時停止の切り替え（直接Stateをいじらずaudio要素を操作する）
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(console.error);
    }
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    // ドラッグ中は、再生によるプログレスバーの更新を止める（つまみのがたつき防止）
    if (audio && audio.duration > 0 && !isDragging) {
      setProgress((audio.currentTime / audio.duration) * 100);
      setCurrentTime(audio.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  // プログレスバーをクリック・タッチしたときの処理
  const handlePointerDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsDragging(true);

    if (!progressBarRef.current || !audioRef.current) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const percentage = x / rect.width;

    const newTime = percentage * duration;

    setProgress(percentage * 100);
    setCurrentTime(newTime);

    audioRef.current.currentTime = newTime;
  };

  return (
    <div
      className="flex items-center w-full gap-4 max-w-md mx-auto mt-6 px-6 py-3 rounded-full bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-white/40 dark:border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.1)] transition-all duration-300 hover:bg-white/50 dark:hover:bg-black/50"
      onClick={(e) => e.stopPropagation()}
    >
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => {
          setIsPlaying(false);
          setProgress(100);
        }}
        // audio要素のイベントをトリガーにStateを更新する
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* 再生/一時停止ボタン */}
      <button
        onClick={togglePlay}
        className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-800 text-white dark:bg-white dark:text-slate-800 shadow-md hover:opacity-70 hover:shadow-lg transition-all active:scale-95 flex-shrink-0 cursor-pointer"
        aria-label={isPlaying ? "一時停止" : "再生"}
      >
        {isPlaying ? (
          <Pause className="w-5 h-5 fill-current" />
        ) : (
          <Play className="w-5 h-5 fill-current ml-1" />
        )}
      </button>

      {/* シークバーと時間のコンテナ */}
      <div className="flex-1 flex flex-col justify-center relative touch-none py-1">
        {/* プログレスバー (ドラッグ可能)*/}
        <div
          ref={progressBarRef}
          className="w-full h-2 bg-slate-300/50 dark:bg-slate-700/50 rounded-full relative cursor-pointer flex items-center group touch-none"
          onPointerDown={handlePointerDown}
        >
          {/* 伸びるバーの部分 */}
          <div
            className="
          absolute left-0 h-full bg-slate-700 dark:bg-slate-300 rounded-full 
          opacity-50 group-hover:opacity-100
          transition-all transform pointer-events-none duration-200 
          "
            style={{ width: `${progress}%` }}
          />
          {/* つまみの部分 */}
          <div
            className="
        absolute w-3 h-3 bg-slate-700 dark:bg-slate-300 rounded-full shadow-md 
        opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-[1.3]
        transition-all transform -translate-x-1/2 pointer-events-none
        duration-300 ease-out
        "
            style={{
              left: `${progress}%`,
              transitionProperty: isDragging ? "none" : "all",
            }}
          />
        </div>

        {/* 時間表示（現在時間/全体時間） */}
        <div className="flex justify-between text-[11px] tracking-widest text-slate-600 dark:text-slate-400 font-medium mt-1.5 px-0.5">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* リプレイボタン */}
      <button
        onClick={() => {
          if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play();
          }
        }}
        className="p-2 text-slate-500 hover:text-slate-800 transition-opacity duration-70 cursor-pointer"
        aria-label="最初から再生"
      >
        <RotateCcw className="w-5 h-5" />
      </button>
    </div>
  );
}
