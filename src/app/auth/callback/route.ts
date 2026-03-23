import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/db/client";
import { Prisma } from "@prisma/client";

type AuthUserMeta = {
  nickname?: string;
};

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
    // このコードを使ってセッション確立
    const supabase = await createClient();

    const { error: exchangeError } =
      await supabase.auth.exchangeCodeForSession(code);
    if (exchangeError) {
      console.error("Exchange error:", exchangeError);
      return NextResponse.redirect(
        new URL("/auth/signin?error=exchange_failed", request.url),
      );
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user?.id || !user.email) {
      console.error("Get user error:", userError);
      return NextResponse.redirect(
        new URL("/auth/signin?error=user_fetch_failed", request.url),
      );
    }

    const meta = (user.user_metadata ?? {}) as AuthUserMeta;
    const nickName = meta.nickname?.trim() || user?.email.split("@")[0];
    const createData: Prisma.ProfileUncheckedCreateInput = {
      userId: user.id,
      nickName: nickName || null,
    };

    const updateData: Prisma.ProfileUpdateInput = {
      ...(nickName !== undefined ? { nickName } : {}),
    };
    
    await prisma.user.upsert({
      where: { id: user.id },
      create: { id: user.id, email: user.email },
      update: { email: user.email },
    });

    await prisma.profile.upsert({
      where: { userId: user.id },
      create: createData,
      update: updateData,
    });

    return NextResponse.redirect(new URL("/", request.url));
  } catch (error) {
    console.error("Callback error:", error);
    return NextResponse.redirect(
      new URL("/auth/signin?error=callback_error", request.url),
    );
  }
}
