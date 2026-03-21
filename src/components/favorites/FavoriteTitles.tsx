"use client";

import { motion } from "framer-motion";

interface countProps {
  count: number;
}

export default function FavoriteTitles({ count }: countProps) {
  return (
    <motion.h1
      className="text-3xl font-bold mb-10 text-amber-950 drop-shadow-sm"
      initial={{ opacity: 0, y: -30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.0, ease: "easeOut" }}
    >
      <span className="text-amber-700/50 select-none mr-2">✦</span>
      おきにいりのほん ({count}さつ)
      <span className="text-amber-700/50 select-none ml-2">✦</span>
    </motion.h1>
  );
}
