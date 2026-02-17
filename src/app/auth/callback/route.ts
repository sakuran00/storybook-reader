import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  // code取得
  const code = new URL(request.url).searchParams.get("code");

  // codeがなければサインインにリダイレクト
  if (!code) {
    return NextResponse.redirect(
      new URL("/auth/signin?error=no_code", request.url),
    );
  }

  try {
    //このコードを使ってセッション確立
    const supabase = await createClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("Exchange error:", error);
      return NextResponse.redirect(
        new URL("/auth/signin?error=exchange_failed", request.url),
      );
    }

    //成功したらホームにリダイレクト
    return NextResponse.redirect(new URL("/", request.url));
  } catch (error) {
    console.error("Callback error:", error);
    return NextResponse.redirect(
      new URL("/auth/signin?error=callback_error", request.url),
    );
  }
}
