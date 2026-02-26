"use client";

import { Zen_Maru_Gothic } from "next/font/google";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

const zenMaru = Zen_Maru_Gothic({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

//受け取るProps
interface HeaderProps {
  title: string;
  navItems?: { label: string; href: string }[]; //ナビゲーション項目
  isAuthenticated: boolean; //認証状態
}

//UI構造
export default function Header({
  title,
  isAuthenticated,
}: HeaderProps) {
  const router = useRouter();
  const supabase = createClient();

  //サインアウト処理
  const signoutHandler = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.log(error);
    router.push("/auth/signin");
    router.refresh();
  };

  return (
    <header
      className={`mx-auto pl-4 sticky top-0 z-30 border-gray-200 ${zenMaru.className}`}
    >
      <div className="flex items-center justify-between px-5 py-3 text-[11px] uppercase tracking-[0.18em] text-gray-800 sm:px-8 sm:text-sm">
        {!isAuthenticated ? (
          <>
            <div className="flex items-center gap-3">
              <Link href="/" className="cursor-pointer hover:opacity-70 transition-opacity">
                <span className="font-bold tracking-[0.36em] text-sm text-shadow-2xs">
                  {title}
                </span>
              </Link>
            </div>
            <div className="flex gap-3">
              <Button size={"sm"} onClick={() => router.push("/auth/signup")}>
                新規作成
              </Button>
              <Button size={"sm"} onClick={() => router.push("/auth/signin")}>
                サインイン
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3">
              <Link href="/" className="cursor-pointer hover:opacity-70 transition-opacity">
                <span className="font-semibold tracking-[0.36em]">{title}</span>
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <nav className="font-bold text-gray-700 hover:text-gray-400 hover:cursor-pointer">
                <Link href="/favorites">お気に入り</Link>
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
