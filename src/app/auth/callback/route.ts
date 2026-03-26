import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { prisma } from "@/db/client";
import { Prisma } from "@prisma/client";

type AuthUserMeta = {
  nickname?: string;
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/";

  if (!code) {
    return NextResponse.redirect(
      new URL("/auth/signin?error=no_code", request.url),
    );
  }

  const redirectTo = new URL(next, request.url);
  let response = NextResponse.redirect(redirectTo);

  try {
    // ミドルウェアと同じパターンでレスポンスに直接Cookieをセット
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) =>
              request.cookies.set(name, value),
            );
            response = NextResponse.redirect(redirectTo);
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options),
            );
          },
        },
      },
    );

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
      where: { email: user.email },
      create: { id: user.id, email: user.email },
      update: { email: user.email },
    });

    await prisma.profile.upsert({
      where: { userId: user.id },
      create: createData,
      update: updateData,
    });

    return response;
  } catch (error) {
    console.error("Callback error:", error);
    return NextResponse.redirect(
      new URL("/auth/signin?error=callback_error", request.url),
    );
  }
}
