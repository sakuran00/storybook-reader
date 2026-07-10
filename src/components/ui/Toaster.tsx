"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, XCircle, X } from "lucide-react";

// ── 型定義 ───────────────────────────────────────────
type ToastType = "success" | "error";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void;
}

// ── Context ──────────────────────────────────────────
const ToastContext = createContext<ToastContextValue | null>(null);

// ── Provider ─────────────────────────────────────────
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const toast = useCallback((message: string, type: ToastType = "success") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);

    // 3秒後に自動で消す
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}

      {/* トースト表示エリア（画面下の中央・付箋風） */}
      <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[9999] flex flex-col items-center gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="pointer-events-auto"
            >
              {/* 傾きはmotionのtransformとぶつからないよう内側のdivにつける */}
              <div
                className={`
                  -rotate-2 flex items-center gap-3
                  px-5 py-3 rounded-[3px] text-sm font-klee font-semibold whitespace-nowrap
                  shadow-[0_12px_22px_-8px_rgba(58,42,24,0.35)]
                  ${
                    t.type === "success"
                      ? "bg-cream border border-butter text-ochre"
                      : "bg-[#fbeee6] border border-clay/40 text-clay"
                  }
                `}
              >
                {t.type === "success" ? (
                  <CheckCircle className="w-4 h-4 shrink-0 opacity-70" />
                ) : (
                  <XCircle className="w-4 h-4 shrink-0 opacity-70" />
                )}
                <span className="flex-1">{t.message}</span>
                <button
                  onClick={() => dismiss(t.id)}
                  className="ml-1 opacity-50 hover:opacity-100 transition-opacity"
                  aria-label="閉じる"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

// ── Hook ─────────────────────────────────────────────
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used inside <ToastProvider>");
  }
  return ctx;
}
