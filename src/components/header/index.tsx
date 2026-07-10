"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

// 受け取るProps
interface HeaderProps {
  isAuthenticated: boolean; // 認証状態
}

// UI構造
export default function Header({ isAuthenticated }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();

  // サインアウト処理
  const signoutHandler = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) console.log(error);
    router.push("/auth/signin");
    router.refresh();
  };

  // リーダー画面では絵本に集中できるようヘッダーを出さない（戻るリンクはページ側にある）
  if (pathname.startsWith("/books/")) return null;

  // ナビの共通スタイル（現在のページには下線をつける）
  const navClass = (active: boolean) =>
    `pb-1 border-b-[1.5px] transition-colors ${
      active
        ? "text-cocoa border-cocoa"
        : "text-sand border-transparent hover:text-cocoa"
    }`;

  return (
    <header className="sticky top-0 z-30 font-bold bg-gradient-to-b from-paper via-paper/90 to-transparent">
      <div className="flex items-start justify-between gap-3 px-4 pt-5 pb-3 sm:px-14 sm:pt-8">
        <Link href="/" className="cursor-pointer hover:opacity-70 transition-opacity shrink-0">
          <Image
            src="/logo.png"
            alt="Storybook Reader"
            width={190}
            height={42}
            loading="eager"
            className="w-28 sm:w-48 h-auto object-contain opacity-90"
          />
        </Link>

        <nav className="flex items-center gap-3 sm:gap-8 text-[11px] sm:text-[13px] pt-1 sm:pt-3 whitespace-nowrap">
          <Link href="/" className={navClass(pathname === "/")}>
            ほんだな
          </Link>
          <Link href="/favorites" className={navClass(pathname === "/favorites")}>
            おきにいり
          </Link>
          {!isAuthenticated ? (
            <>
              <Link
                href="/auth/signup"
                className="text-sand hover:text-cocoa transition-colors"
              >
                新規登録
              </Link>
              <Link
                href="/auth/signin"
                className="text-sand hover:text-cocoa transition-colors"
              >
                ログイン
              </Link>
            </>
          ) : (
            <button
              onClick={signoutHandler}
              className="text-sand hover:text-cocoa transition-colors cursor-pointer"
            >
              ログアウト
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
