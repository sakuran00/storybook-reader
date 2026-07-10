"use client";

import { motion } from "framer-motion";

interface countProps {
  count: number;
}

export default function FavoriteTitles({ count }: countProps) {
  return (
    <motion.h1
      className="font-klee font-semibold text-xl sm:text-2xl text-ink tracking-[0.14em] leading-relaxed"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.0, ease: "easeOut" }}
    >
      {count === 0
        ? "まだなにもない つくえ"
        : `おきにいりのほん（${count}さつ）`}
    </motion.h1>
  );
}
