"use client";

import { useRef, useState, MouseEvent as ReactMouseEvent } from "react";

export function useDragScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // マウスをクリックした時
  const onMouseDown = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    setIsDragging(true);
    //コンテナの左端を基準としたクリック位置のX座標を保存
    setStartX(e.pageX - ref.current.offsetLeft);
    // クリックした瞬間のスクロール位置を保存
    setScrollLeft(ref.current.scrollLeft);
  };

  // マウスがコンテナから外れたとき
  const onMouseLeave = () => {
    setIsDragging(false);
  };

  // マウスクリックを離したとき
  const onMouseUp = () => {
    setIsDragging(false);
  };

  // マウスを動かしている時
  const onMouseMove = (e: ReactMouseEvent<HTMLDivElement>) => {
    if (!isDragging || !ref.current) return;
    e.preventDefault(); //テキスト選択などのデフォルトの挙動を防ぐ

    // 現在のマウスのX座標
    const x = e.pageX - ref.current.offsetLeft;
    //　クリックした位置からの移動距離を計算（*1.5はスクロール速度の調整用）
    const walk = (x - startX) * 1.5;
    //　実際のスクロール位置を更新
    ref.current.scrollLeft = scrollLeft - walk;
  };

  return {
    ref,
    onMouseDown,
    onMouseLeave,
    onMouseUp,
    onMouseMove,
    isDragging,
  };
}
