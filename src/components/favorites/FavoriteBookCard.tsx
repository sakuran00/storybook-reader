"use client";

import { motion } from "framer-motion";
import { Book } from "@/data/books";
import BookCard from "../book/BookCard";

interface booksProps {
  books: Book[];
}

export default function FavoriteBookCard({ books }: booksProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className="mx-auto max-w-7xl px-4 py-8 pt-24 font-semibold font-klee"
    >
      {books.length === 0 ? (
        <div className="text-center py-20 bg-white/50 rounded-lg shadow-sm">
          <p className="text-2xl font-semibold text-gray-600 mb-4">
            まだおきにいりのほんがありません
          </p>
          <p className="text-gray-500 font-semibold">
            ほんだなから[❤︎]をおして、おきにいりについかしてみましょう
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {books.map((book) => (
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
    </motion.div>
  );
}
