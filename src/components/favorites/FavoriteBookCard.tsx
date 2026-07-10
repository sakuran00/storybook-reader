"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Book } from "@/data/books";
import BookCard from "../book/BookCard";

interface booksProps {
  books: Book[];
}

// 本の傾き（つくえに置いた感じを出す）
const ROTATIONS = ["-rotate-3", "rotate-3", "-rotate-2"];

export default function FavoriteBookCard({ books }: booksProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.5, ease: "easeInOut" }}
      className="pt-10"
    >
      {books.length === 0 ? (
        // まだなにもないとき（付箋）
        <div className="mx-auto mt-10 w-72 -rotate-2 rounded-[4px] bg-cream border border-butter shadow-[0_14px_24px_-10px_rgba(58,42,24,0.3)] px-6 py-6">
          <p className="font-klee font-semibold text-[15px] text-ochre leading-loose text-center">
            まだなにもない つくえ。
            <br />
            ほんだなで ♡ をおすと
            <br />
            ここにあつまるよ
          </p>
          <Link
            href="/"
            className="block mx-auto mt-4 w-max border border-ochre text-ochre rounded-full px-6 py-2 text-[13px] font-black hover:bg-ochre/10 transition-colors"
          >
            ほんだなへいく
          </Link>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center sm:justify-start items-start gap-x-8 gap-y-12 sm:gap-x-20">
          {books.map((book, index) => (
            <div
              key={book.id}
              className={index % 2 === 1 ? "mt-10 sm:mt-16" : ""}
            >
              <BookCard
                {...book}
                coverImageUrl={book.cover}
                rotation={ROTATIONS[index % ROTATIONS.length]}
              />
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
