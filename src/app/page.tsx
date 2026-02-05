"use client";
import { BOOKS } from "@/data/books";
import BookCard from "@/components/book/BookCard";
import { Zen_Kaku_Gothic_New, Zen_Maru_Gothic } from "next/font/google";

const zenKaku = Zen_Kaku_Gothic_New({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

const zenMaru = Zen_Maru_Gothic({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

type FilterType = "all" | "available" | "unavailable";

export default function Home() {
  return (
    <div className={`mx-auto max-w-7xl px-4 py-8 ${zenMaru.className}`}>
      <h1 className="mb-2 text-3xl font-bold">本棚</h1>
      <p className="mb-6 text-gray-600">読みたい絵本を選んでね</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {BOOKS.map((book) => (
          <BookCard
            key={book.id}
            id={book.id}
            title={book.title}
            subtitle={book.subtitle}
            author={book.author}
            coverImageUrl={book.cover}
            disabled={book.status === "unavailable"}
          />
        ))}
      </div>
    </div>
  );
}
