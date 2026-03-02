"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/db/client";
import { revalidatePath } from "next/cache";

//お気に入りの追加
export async function addFavorite(bookId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  try {
    await prisma.favorite.create({
      data: {
        userId: user.id,
        bookId: bookId,
      },
    });

    //revalidatePath:お気に入り追加後, 次にアクセスされたら新しい情報を使って再生成するための関数
    revalidatePath("/"); //本棚ページのキャッシュを更新
    revalidatePath("/favorites"); //お気に入りページのキャッシュを更新
    return { success: true };
  } catch (error) {
    console.error("Failed to add favorite:", error);
    return { success: false, error: "Failed to add favorite" };
  }
}

//お気に入りの削除
export async function removeFavorite(bookId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized: ログインが必要です");
  }

  try {
    //複合ユニーク制約:複数のカラムの組み合わせが、テーブル内で一意であることを保証する制約
    // id（主キー）がわからなくても、userIdとbookIdの組み合わせで削除対象を一意に特定できる
    await prisma.favorite.delete({
      where: {
        userId_bookId: {
          //Prismaが自動生成する複合ユニーク制約の名前は、通常「カラム名1_カラム名2」の形式
          userId: user.id,
          bookId: bookId,
        },
      },
    });

    revalidatePath("/");
    revalidatePath("/favorites");
    return { success: true };
  } catch (error) {
    console.error("Failed to remove favorite:", error);
    return { success: false, error: "Failed to remove favorite" };
  }
}

// お気に入り状態の確認
export async function getFavoriteStatus(bookId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return false; //ログインしていなければ「お気に入りしていない」とみなす
  }

  const favorite = await prisma.favorite.findUnique({
    where: {
      userId_bookId: {
        userId: user.id,
        bookId: bookId,
      },
    },
  });

  return !!favorite; //favoriteが存在すればtrue、存在しなければfalseを返す
}
