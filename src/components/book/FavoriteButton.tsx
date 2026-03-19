"use client";

import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import {
  addFavorite,
  removeFavorite,
  getFavoriteStatus,
} from "@/app/actions/favorite";
import { useToast } from "@/components/ui/Toaster";

interface FavoriteButtonProps {
  bookId: string;
}

export default function FavoriteButton({ bookId }: FavoriteButtonProps) {
  const [isFavorite, setIsFavorite] = useState(false); // ハートが赤いかどうか
  const [isLoading, setIsLoading] = useState(true); // 初期状態の確認が終わるまでローディング表示をするための状態
  const { toast } = useToast();

  // 初期状態の確認
  useEffect(() => {
    const checkStatus = async () => {
      // お気に入り状態の取得はサーバーに問い合わせる必要があるため、非同期関数を定義して実行する
      try {
        const status = await getFavoriteStatus(bookId);
        setIsFavorite(status);
      } catch (error) {
        console.error("failed to fetch favorite status:", error);
      } finally {
        setIsLoading(false); // 状態の確認が終わったらローディングを解除する
      }
    };

    checkStatus();
  }, [bookId]);

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    // e.preventDefault(): デフォルトのイベント（この場合はボタンのクリックによるページ遷移など）をキャンセルするためのメソッド
    // e.stopPropagation(): イベントのバブリング（親要素へのイベント伝播）を停止するためのメソッド
    e.preventDefault();
    e.stopPropagation();

    // クライアント側で状態を先に更新して、UIの応答性を向上させる
    const newStatus = !isFavorite;
    setIsFavorite(newStatus);

    try {
      if (newStatus) {
        // お気に入りに追加する処理を呼び出す
        const result = await addFavorite(bookId);
        if (result.success) {
          toast("お気に入りに追加しました", "success");
        } else {
          throw new Error(result.error);
        }
      } else {
        // お気に入りから削除する処理を呼び出す
        const result = await removeFavorite(bookId);
        if (result.success) {
          toast("お気に入りから削除しました", "success");
        } else {
          throw new Error(result.error);
        }
      }
    } catch (error) {
      // サーバー通信に失敗した場合
      console.error("Failed to toggle favorite:", error);
      setIsFavorite(!newStatus); // エラーが発生した場合、状態を元に戻す
      toast("操作に失敗しました。もう一度お試しください。", "error");
    }
  };

  if (isLoading) {
    return <div className="h-6 w-6 animate-pulse bg-gray-200 rounded-full" />;
  }

  // お気に入りの状態に応じて、ハートの色を変える
  return (
    <button
      onClick={handleToggleFavorite}
      className="p-2 rounded-full hover:bg-black/10 transition-colors"
      aria-label={isFavorite ? "お気に入りから削除" : "お気に入りに追加"}
    >
      <Heart
        className={`w-6 h-6 transition-colors cursor-pointer drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)] ${
          isFavorite
            ? "fill-red-500 text-red-500"
            : "fill-gray-200 text-gray-300"
        }`}
      />
    </button>
  );
}
