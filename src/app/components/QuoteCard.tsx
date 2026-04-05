"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";

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
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D 倾斜效果
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"]);
  const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
  const glareY = useTransform(mouseYSpring, [-0.5, 0.5], ["0%", "100%"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

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
        ease: [0.215, 0.61, 0.355, 1] as const,
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

  const borderColorMap: Record<string, string> = {
    gold: "border-[#C9A227]/60",
    crimson: "border-[#9B1B30]/60",
    sea: "border-[#1a365d]/60",
    flame: "border-[#FF6B35]/60",
    moon: "border-[#c0c0c0]/60",
  };

  return (
    <motion.article
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      className="relative group"
      style={{ perspective: "1000px" }}
    >
      {/* 背景光晕 */}
      <motion.div
        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${colorMap[quote.color]} blur-2xl transition-opacity duration-500`}
        animate={{
          opacity: isHovered ? 1 : 0.5,
          scale: isHovered ? 1.05 : 1,
        }}
      />

      {/* 主卡片 - 3D 倾斜 */}
      <motion.div
        ref={cardRef}
        className={`relative p-8 md:p-10 rounded-2xl border border-[#C9A227]/10 backdrop-blur-sm overflow-hidden transition-all duration-500 cursor-pointer ${
          isHovered ? glowMap[quote.color] : ""
        }`}
        style={{
          background:
            "linear-gradient(135deg, rgba(248, 244, 240, 0.03) 0%, rgba(10, 10, 10, 0.5) 100%)",
          rotateX: isHovered ? rotateX : 0,
          rotateY: isHovered ? rotateY : 0,
          transformStyle: "preserve-3d",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => setIsExpanded(!isExpanded)}
        whileHover={{ y: -8 }}
        transition={{ duration: 0.3 }}
      >
        {/* 光泽效果 */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.1) 0%, transparent 50%)`,
            opacity: isHovered ? 1 : 0,
          }}
        />

        {/* 装饰角标 */}
        <motion.div
          className={`absolute top-0 left-0 w-16 h-16 border-l-2 border-t-2 rounded-tl-2xl transition-colors duration-300 ${
            isHovered ? borderColorMap[quote.color] : "border-[#C9A227]/20"
          }`}
          style={{ transform: "translateZ(20px)" }}
        />
        <motion.div
          className={`absolute bottom-0 right-0 w-16 h-16 border-r-2 border-b-2 rounded-br-2xl transition-colors duration-300 ${
            isHovered ? borderColorMap[quote.color] : "border-[#C9A227]/20"
          }`}
          style={{ transform: "translateZ(20px)" }}
        />

        {/* 日期 */}
        <motion.time
          className="text-xs tracking-[0.3em] text-[#C9A227]/50 block mb-6"
          animate={{ opacity: isHovered ? 1 : 0.7 }}
          style={{ transform: "translateZ(10px)" }}
        >
          {quote.date}
        </motion.time>

        {/* 语录内容 */}
        <blockquote className="relative" style={{ transform: "translateZ(30px)" }}>
          {/* 引号装饰 */}
          <motion.span
            className="absolute -top-4 -left-2 text-6xl text-[#C9A227]/20 font-serif"
            animate={{
              opacity: isHovered ? 0.4 : 0.2,
              scale: isHovered ? 1.1 : 1,
              rotate: isHovered ? -5 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            &ldquo;
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
              rotate: isHovered ? 175 : 180,
            }}
            transition={{ duration: 0.3 }}
          >
            &ldquo;
          </motion.span>
        </blockquote>

        {/* 展开内容 */}
        <AnimatePresence mode="wait">
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.215, 0.61, 0.355, 1] }}
              className="overflow-hidden"
            >
              <motion.div 
                className="pt-6 mt-6 border-t border-[#C9A227]/10"
                initial={{ y: -10 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <p
                  className="text-sm text-[#F8F4F0]/60 leading-relaxed"
                  style={{ fontFamily: "'Noto Serif SC', serif" }}
                >
                  {quote.context}
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 标签 */}
        <div className="flex flex-wrap gap-2 mt-6" style={{ transform: "translateZ(20px)" }}>
          {quote.tags.map((tag, i) => (
            <motion.span
              key={tag}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * i }}
              whileHover={{ 
                scale: 1.1, 
                backgroundColor: "rgba(201, 162, 39, 0.1)",
              }}
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
          style={{ transform: "translateZ(20px)" }}
        >
          {isExpanded ? "收起" : "展开"}
        </motion.div>
      </motion.div>
    </motion.article>
  );
}
