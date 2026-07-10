"use client";

import { SigninForm } from "../signin";
import { createPortal } from "react-dom";

interface LoginModalProps {
  onClose: () => void; // モーダルを閉じるための関数を受け取る
  title: string; // モーダルのタイトル
  description?: string; // モーダルの説明文
}

export default function LoginModal({
  onClose,
  title,
  description,
}: LoginModalProps) {
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-paper/70 backdrop-blur-[2px] animate-in fade-in duration-500"
      onClick={onClose} // モーダルの外側をクリックしたときにモーダルを閉じる
    >
      <div
        className="relative w-full max-w-md p-4 -rotate-1 animate-in slide-in-from-bottom-10 fade-in duration-700 delay-300 fill-mode-both"
        onClick={(e) => e.stopPropagation()} // モーダルの内側をクリックしてもイベントが親に伝わらないようにする
      >
        {/* メッセージ */}
        <div className="mb-4 text-center">
          <h2 className="font-klee font-semibold text-xl sm:text-2xl text-ink tracking-wide">
            {title}
          </h2>
          {description && (
            <p className="text-sm text-sand font-bold mt-2 leading-relaxed">
              {description}
            </p>
          )}
        </div>

        {/* サインインフォーム */}
        <SigninForm />

        <div className="text-center mt-4">
          <button
            onClick={onClose}
            className="text-sm font-bold text-sand hover:text-cocoa underline underline-offset-4 transition-colors cursor-pointer"
          >
            今はいい
          </button>
        </div>
      </div>
    </div>,
    document.body, // モーダルをbody直下にレンダリングする
  );
}
