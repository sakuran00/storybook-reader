"use client";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// 受け取るProps
interface HeaderProps {
  navItems?: { label: string; href: string }[]; // ナビゲーション項目
  isAuthenticated: boolean; // 認証状態
}

// UI構造
export default function Header({ isAuthenticated }: HeaderProps) {
  const router = useRouter();
  const supabase = createClient();

  // サインアウト処理
  const signoutHandler = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.log(error);
    router.push("/auth/signin");
    router.refresh();
  };

  return (
    <header
      className={`mx-auto pl-4 sticky top-0 z-30 text-shadow-sm backdrop-blur-sm bg-white/20 border-b border-white/20 font-zen-maru-gothic font-bold`}
    >
      <div className="flex items-center justify-between px-5 py-3 text-[11px] uppercase tracking-[0.18em] text-gray-800 sm:px-8 sm:text-sm">
        {!isAuthenticated ? (
          <>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="cursor-pointer hover:opacity-70 transition-opacity"
              >
                <div className="relative w-50 h-10 sm:w-80 sm:h-20 opacity-90">
                  <Image
                    src="/logo.png"
                    alt="Storybook Reader"
                    fill
                    className="object-contain"
                  />
                </div>
              </Link>
            </div>
            <div className="flex gap-3">
              <Button
                size="lg"
                className="rounded-full hover:bg-slate-800/60 mr-2"
                onClick={() => router.push("/auth/signup")}
              >
                新規作成
              </Button>
              <Button
                size="lg"
                className="rounded-full border border-gray-800 bg-slate-50 text-slate-800 hover:bg-slate-800 hover:text-white transition-colors mr-20"
                onClick={() => router.push("/auth/signin")}
              >
                ログイン
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="cursor-pointer hover:opacity-70 transition-opacity"
              >
                <div className="relative w-50 h-10 sm:w-80 sm:h-20 opacity-90">
                  <Image
                    src="/logo.png"
                    alt="Storybook Reader"
                    fill
                    className="object-contain"
                  />
                </div>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <nav className="font-semibold text-lg text-amber-950/50 hover:text-amber-950 hover:cursor-pointer font-zen-maru-gothic mr-5">
                <Link href="/favorites">
                  <span className="text-red-500/50 hover:text-red-500/70 mr-1">
                    ❤︎
                  </span>
                  FAVORITE
                  <span className="text-red-500/50 hover:text-red-500/70 ml-1">
                    ❤︎
                  </span>
                </Link>
              </nav>
              <Button
                size={"lg"}
                className="font-semibold rounded-full border border-amber-950/60 bg-slate-50 text-amber-950 hover:bg-amber-950/60 hover:text-white transition-colors mr-20"
                onClick={signoutHandler}
              >
                ログアウト
              </Button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
