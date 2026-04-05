"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import QuoteCard from "./QuoteCard";
import { quotes } from "../data/quotes";

const filters = [
  { key: "all", label: "すべて" },
  { key: "gold", label: "金閣" },
  { key: "crimson", label: "紅蓮" },
  { key: "sea", label: "深海" },
  { key: "flame", label: "焔" },
  { key: "moon", label: "月華" },
];

export default function QuotesSection() {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredQuotes = useMemo(() => {
    if (activeFilter === "all") return quotes;
    return quotes.filter((quote) => quote.color === activeFilter);
  }, [activeFilter]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <section className="relative py-32 px-4 sm:px-6 lg:px-8">
      {/* 区域标题 */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl mx-auto text-center mb-20"
      >
        <motion.span
          className="text-xs tracking-[0.5em] text-[#C9A227]/50 block mb-4"
          style={{ fontFamily: "'Noto Serif SC', serif" }}
        >
          COLLECTION
        </motion.span>
        <h2
          className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6"
          style={{
            fontFamily: "'Cinzel', serif",
            background:
              "linear-gradient(135deg, #C9A227 0%, #F8F4F0 50%, #9B1B30 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          語録
        </h2>
        <p
          className="text-[#F8F4F0]/60 text-lg max-w-2xl mx-auto"
          style={{ fontFamily: "'Noto Serif SC', serif" }}
        >
          言葉は、血に変わる。ここに集う断片は、三島由紀夫の美学の残照。
        </p>
      </motion.div>

      {/* 过滤器 */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="flex flex-wrap justify-center gap-3 mb-16"
      >
        {filters.map((filter) => (
          <motion.button
            key={filter.key}
            onClick={() => setActiveFilter(filter.key)}
            className={`px-6 py-2 text-sm tracking-wider rounded-full border transition-all duration-300 ${
              activeFilter === filter.key
                ? "bg-[#C9A227]/20 border-[#C9A227]/60 text-[#C9A227]"
                : "border-[#C9A227]/20 text-[#C9A227]/50 hover:border-[#C9A227]/40 hover:text-[#C9A227]/70"
            }`}
            style={{ fontFamily: "'Noto Serif SC', serif" }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {filter.label}
          </motion.button>
        ))}
      </motion.div>

      {/* 语录网格 */}
      <motion.div
        key={activeFilter}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8"
      >
        {filteredQuotes.map((quote, index) => (
          <QuoteCard key={quote.id} quote={quote} index={index} />
        ))}
      </motion.div>

      {/* 底部装饰 */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.5 }}
        className="max-w-4xl mx-auto mt-24 flex items-center justify-center gap-8"
      >
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#C9A227]/30 to-transparent" />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border border-[#C9A227]/30 rounded-full flex items-center justify-center"
        >
          <div className="w-2 h-2 bg-[#C9A227]/50 rounded-full" />
        </motion.div>
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#C9A227]/30 to-transparent" />
      </motion.div>
    </section>
  );
}
