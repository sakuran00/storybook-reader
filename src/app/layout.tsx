import type { Metadata } from "next";
import { Geist, Geist_Mono, Klee_One, Zen_Maru_Gothic } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { createClient } from "@/lib/supabase/server";
import { ToastProvider } from "@/components/ui/Toaster";
import SplashScreenWrapper from "@/components/SplashScreen/ClientWrapper";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const kleeOne = Klee_One({
  weight: ["400", "600"],
  variable: "--font-klee",
  display: "swap",
});

const zenMaruGothic = Zen_Maru_Gothic({
  weight: ["400"],
  variable: "--font-zen-maru-gothic",
  display: "swap",
});



export const metadata: Metadata = {
  title: "Storybook Reader",
  description: "絵本読み聞かせアプリ",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${kleeOne.variable} ${zenMaruGothic.variable} antialiased`}
      >
        <ToastProvider>
          <SplashScreenWrapper/>
          <Header isAuthenticated={!!user} />
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
