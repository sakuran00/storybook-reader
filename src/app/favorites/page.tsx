import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/db/client";
import { BOOKS } from "@/data/books";
import { redirect } from "next/navigation";
import FavoriteTitles from "@/components/favorites/FavoriteTitles";
import FavoriteBookCard from "@/components/favorites/FavoriteBookCard";

export default async function FavoritePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/"); // ログインしていない場合はトップへ
  }

  // DBからお気に入りデータを取得（BookのリレーションはPrismaレベルで設定しているため、includeでBookの情報も一緒に取得できる）
  // findMany:条件に合うレコードを複数取得するPrismaのメソッド
  const favorites = await prisma.favorite.findMany({
    where: {
      userId: user.id, // ログイン中のユーザーIDに一致するものだけ
    },
    // bookIdを取得
    select: {
      bookId: true,
    },
    // 並び順（新しい順）
    orderBy: {
      createdAt: "desc",
    },
  });

  // お気に入りIDリスト
  const favoriteBookIds = favorites.map((f: { bookId: string }) => f.bookId);

  // マスタデータ(BOOKS)から該当する本だけをフィルタリング
  const favoriteBooks = BOOKS.filter((book) =>
    favoriteBookIds.includes(book.id),
  );

  // お気に入りの本がない場合の表示
  return (
    <div
      className={`mx-auto max-w-7xl px-4 py-8 pt-24 font-semibold font-klee`}
    >
      < FavoriteTitles count={favoriteBooks.length} />
      < FavoriteBookCard books={favoriteBooks} />
    </div>
  );
}
