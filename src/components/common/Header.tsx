"use client";

import { Zen_Maru_Gothic } from "next/font/google";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const zenMaru = Zen_Maru_Gothic({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

//受け取るPropsを決める
interface HeaderProps {
  title: string; //表示するタイトル
  navItems?: { label: string; href: string }[]; //ナビゲーション項目
}

//UI構造
export default function Header({ title, navItems = [] }: HeaderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  //サインアウト処理
  const signoutHandler = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.log(error);
    router.push("/auth/signin");
  };

  return (
    <header
      className={`mx-auto pl-4 sticky top-0 z-30 border-b border-gray-200 ${zenMaru.className}`}
    >
      <div className="flex items-center justify-between px-5 py-3 text-[11px] uppercase tracking-[0.18em] text-gray-800 sm:px-8 sm:text-xs">
        {!isAuthenticated ? (
          <>
            <div className="flex items-center gap-3">
              <span className="font-bold tracking-[0.36em] text-sm text-shadow-2xs">
                {title}
              </span>
            </div>
            <div className="flex gap-3">
              <Button size={"sm"} onClick={() => router.push("/auth/signup")}>
                サインアップ
              </Button>
              <Button size={"sm"} onClick={() => router.push("/auth/signin")}>
                サインイン
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <span className="font-semibold tracking-[0.36em]">{title}</span>
            </div>
            <div className="flex items-center gap-3">
              <nav className="font-bold text-gray-700 hover:text-gray-400 hover:cursor-pointer">
                お気に入り
              </nav>
              <Button onClick={signoutHandler} size={"sm"}>
                サインアウト
              </Button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
