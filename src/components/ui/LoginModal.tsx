"use client";

import { SigninForm } from "../signin";
import { createPortal } from "react-dom";

interface LoginModalProps{
  onClose: () => void; // モーダルを閉じるための関数を受け取る
  title: string; // モーダルのタイトル
  description?: string; // モーダルの説明文
}

export default function LoginModal({ onClose, title, description }: LoginModalProps) {
  return createPortal(
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm animate-in fade-in duration-1000 font-klee"
      onClick={(e) => {
        e.stopPropagation(); // モーダルの内側をクリックしてもイベントが親に伝わらないようにする
        onClose(); // モーダルの外側をクリックしたときにモーダルを閉じる
      }}
    >
      <div className="relative w-full max-w-md p-4 animate-in slide-in-from-bottom-10 fade-in duration-700 delay-300 fill-mode-both">
        {/* メッセージ */}
        <div className="mb-4 text-center">
          <h2 className="text-2xl font-bold text-slate-800">
            {title}
          </h2>
          {description && (
            <p className="text-slate-600 mt-2">
              {description}
            </p>
          )}
        </div>

        {/* サインインフォーム */}
        <div className="shadow-2xl rounded-xl overflow-hidden border border-slate-100">
          <SigninForm />
        </div>

        <div className="text-center mt-4">
          <button
            onClick={ onClose }
            className="text-sm text-slate-500 hover:text-slate-800 underline underline-offset-4 transition-colors cursor-pointer"
          >
            今はいい
          </button>
        </div>
      </div>
    </div>,
    document.body // モーダルをbody直下にレンダリングする
  );
}