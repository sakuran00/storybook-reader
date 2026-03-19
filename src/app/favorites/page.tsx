import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/db/client";
import { BOOKS } from "@/data/books";
import BookCard from "@/components/book/BookCard";
import { redirect } from "next/navigation";

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
      <h1 className="text-3xl font-bold mb-10 text-amber-900 drop-shadow-sm">
        おきにいりのほん ({favoriteBooks.length}さつ)
      </h1>

      {favoriteBooks.length === 0 ? (
        <div className="text-center py-20 bg-white/50 rounded-lg shadow-sm">
          <p className="text-2xl font-semibold text-gray-600 mb-4">
            まだおきにいりのほんがありません
          </p>
          <p className="text-gray-500 font-semibold">
            ほんだなからハートマークをおして、おきにいりについかしてみましょう
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {favoriteBooks.map((book) => (
            <div key={book.id} className="flex justify-center">
              <BookCard
                {...book}
                coverImageUrl={book.cover}
                variant="cover"
                // 一覧ページでは傾けず、真っ直ぐ表示
                rotation="rotate-0"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
