"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Quote {
  id: number;
  content: string;
  context: string;
  date: string;
  tags: string[];
  color: string;
}

interface QuoteCardProps {
  quote: Quote;
  index: number;
}

export default function QuoteCard({ quote, index }: QuoteCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 60,
      filter: "blur(10px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.8,
        delay: index * 0.15,
        ease: [0.215, 0.61, 0.355, 1],
      },
    },
  };

  const colorMap: Record<string, string> = {
    gold: "from-[#C9A227]/20 to-[#C9A227]/5",
    crimson: "from-[#9B1B30]/20 to-[#9B1B30]/5",
    sea: "from-[#1a365d]/30 to-[#1a365d]/10",
    flame: "from-[#FF6B35]/20 to-[#FF6B35]/5",
    moon: "from-[#c0c0c0]/15 to-[#c0c0c0]/5",
  };

  const glowMap: Record<string, string> = {
    gold: "shadow-[0_0_60px_rgba(201,162,39,0.3)]",
    crimson: "shadow-[0_0_60px_rgba(155,27,48,0.3)]",
    sea: "shadow-[0_0_60px_rgba(26,54,93,0.4)]",
    flame: "shadow-[0_0_60px_rgba(255,107,53,0.3)]",
    moon: "shadow-[0_0_60px_rgba(192,192,192,0.2)]",
  };

  return (
    <motion.article
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 背景光晕 */}
      <motion.div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${colorMap[quote.color]} blur-2xl transition-opacity duration-500`}
        animate={{
          opacity: isHovered ? 1 : 0.5,
          scale: isHovered ? 1.05 : 1,
        }}
      />

      {/* 主卡片 */}
      <motion.div
        className={`relative p-8 md:p-10 rounded-2xl border border-[#C9A227]/10 backdrop-blur-sm overflow-hidden transition-all duration-500 ${
          isHovered ? glowMap[quote.color] : ""
        }`}
        style={{
          background:
            "linear-gradient(135deg, rgba(248, 244, 240, 0.03) 0%, rgba(10, 10, 10, 0.5) 100%)",
        }}
        whileHover={{ y: -8 }}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* 装饰角标 */}
        <div
          className={`absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 rounded-tl-2xl transition-colors duration-300 ${
            isHovered ? "border-[#C9A227]/60" : "border-[#C9A227]/20"
          }`}
        />
        <div
          className={`absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 rounded-br-2xl transition-colors duration-300 ${
            isHovered ? "border-[#C9A227]/60" : "border-[#C9A227]/20"
          }`}
        />

        {/* 日期 */}
        <motion.time
          className="text-xs tracking-[0.3em] text-[#C9A227]/50 block mb-6"
          animate={{ opacity: isHovered ? 1 : 0.7 }}
        >
          {quote.date}
        </motion.time>

        {/* 语录内容 */}
        <blockquote className="relative">
          {/* 引号装饰 */}
          <motion.span
            className="absolute -top-4 -left-2 text-6xl text-[#C9A227]/20 font-serif"
            animate={{
              opacity: isHovered ? 0.4 : 0.2,
              scale: isHovered ? 1.1 : 1,
            }}
          >
            "
          </motion.span>

          <p
            className="text-lg md:text-xl lg:text-2xl leading-relaxed text-[#F8F4F0]/90 font-light pl-6"
            style={{
              fontFamily: "'Noto Serif SC', serif",
              lineHeight: "1.8",
            }}
          >
            {quote.content}
          </p>

          <motion.span
            className="absolute -bottom-8 right-0 text-6xl text-[#C9A227]/20 font-serif rotate-180"
            animate={{
              opacity: isHovered ? 0.4 : 0.2,
              scale: isHovered ? 1.1 : 1,
            }}
          >
            "
          </motion.span>
        </blockquote>

        {/* 展开内容 */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.215, 0.61, 0.355, 1] }}
              className="overflow-hidden"
            >
              <div className="pt-6 mt-6 border-t border-[#C9A227]/10">
                <p
                  className="text-sm text-[#F8F4F0]/60 leading-relaxed"
                  style={{ fontFamily: "'Noto Serif SC', serif" }}
                >
                  {quote.context}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 标签 */}
        <div className="flex flex-wrap gap-2 mt-6">
          {quote.tags.map((tag, i) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * i }}
              className="px-3 py-1 text-xs tracking-wider text-[#C9A227]/70 border border-[#C9A227]/20 rounded-full hover:border-[#C9A227]/50 hover:text-[#C9A227] transition-colors cursor-pointer"
              style={{ fontFamily: "'Noto Serif SC', serif" }}
            >
              {tag}
            </motion.span>
          ))}
        </div>

        {/* 悬停提示 */}
        <motion.div
          className="absolute bottom-4 right-4 text-xs text-[#C9A227]/30"
          animate={{ opacity: isHovered ? 1 : 0 }}
        >
          {isExpanded ? "收起" : "展开"}
        </motion.div>
      </motion.div>
    </motion.article>
  );
}
