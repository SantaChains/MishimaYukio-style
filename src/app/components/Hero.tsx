"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const heroQuotes = [
  "美しいものは、燃えるものだ",
  "金閣は、永遠に美しい",
  "死と生の間で、美は輝く",
  "太陽と鉄、肉体の神殿",
];

export default function Hero() {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // 平滑滚动动画
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -100]);
  
  // 使用 spring 平滑滚动
  const smoothOpacity = useSpring(opacity, { stiffness: 100, damping: 30 });
  const smoothScale = useSpring(scale, { stiffness: 100, damping: 30 });
  const smoothY = useSpring(y, { stiffness: 100, damping: 30 });

  // 语录轮播
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % heroQuotes.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // 鼠标视差效果
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
      setMousePosition({ x: x * 20, y: y * 20 });
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const letterVariants = {
    hidden: { opacity: 0, y: 50, filter: "blur(10px)" },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        delay: i * 0.08,
        duration: 0.8,
        ease: [0.215, 0.61, 0.355, 1] as const,
      },
    }),
  };

  const nameLetters = "SantaChains".split("");

  return (
    <motion.section
      ref={containerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ opacity: smoothOpacity, scale: smoothScale }}
    >
      {/* 中央光晕 - 带鼠标视差 */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          className="w-[600px] h-[600px] rounded-full will-change-transform"
          style={{
            background:
              "radial-gradient(circle, rgba(201, 162, 39, 0.2) 0%, rgba(155, 27, 48, 0.1) 30%, transparent 60%)",
            filter: "blur(60px)",
            x: mousePosition.x * 0.5,
            y: mousePosition.y * 0.5,
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* 主要内容 - 带视差 */}
      <motion.div 
        className="relative z-20 text-center px-4 will-change-transform" 
        style={{ y: smoothY }}
      >
        {/* 副标题 - 日语 */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="text-[#C9A227]/60 text-sm md:text-base tracking-[0.5em] mb-8 font-light"
          style={{ 
            fontFamily: "'Noto Serif SC', serif",
            transform: `translate(${mousePosition.x * 0.2}px, ${mousePosition.y * 0.2}px)`,
          }}
        >
          三島由紀夫の美学
        </motion.p>

        {/* 主标题 - SantaChains */}
        <h1 className="relative mb-12">
          <div className="flex justify-center items-center flex-wrap">
            {nameLetters.map((letter, i) => (
              <motion.span
                key={i}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={letterVariants}
                className="inline-block text-6xl md:text-8xl lg:text-9xl font-bold tracking-tighter will-change-transform"
                style={{
                  fontFamily: "'Cinzel', serif",
                  background:
                    "linear-gradient(135deg, #C9A227 0%, #9B1B30 30%, #FF6B35 60%, #C9A227 100%)",
                  backgroundSize: "200% 200%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  textShadow: "0 0 80px rgba(201, 162, 39, 0.3)",
                  transform: `translate(${mousePosition.x * (0.1 + i * 0.02)}px, ${mousePosition.y * (0.1 + i * 0.02)}px)`,
                }}
                whileHover={{
                  scale: 1.15,
                  textShadow: "0 0 40px rgba(201, 162, 39, 0.8)",
                  transition: { duration: 0.2 },
                }}
              >
                {letter}
              </motion.span>
            ))}
          </div>

          {/* 装饰线 - 带发光动画 */}
          <motion.div
            className="absolute -bottom-4 left-1/2 h-[1px]"
            initial={{ width: 0, x: "-50%" }}
            animate={{ width: "60%", x: "-50%" }}
            transition={{ duration: 1.5, delay: 1.5 }}
            style={{
              background:
                "linear-gradient(90deg, transparent, #C9A227, #9B1B30, transparent)",
              boxShadow: "0 0 20px rgba(201, 162, 39, 0.5)",
            }}
          />
        </h1>

        {/* 动态语录 - 带 AnimatePresence 优化 */}
        <div className="h-20 flex items-center justify-center overflow-hidden">
          <motion.p
            key={currentQuote}
            initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -30, filter: "blur(10px)" }}
            transition={{ duration: 0.8, ease: [0.215, 0.61, 0.355, 1] }}
            className="text-xl md:text-2xl lg:text-3xl text-[#F8F4F0]/80 font-light tracking-wider absolute"
            style={{
              fontFamily: "'Noto Serif SC', serif",
              textShadow: "0 0 30px rgba(248, 244, 240, 0.2)",
            }}
          >
            {heroQuotes[currentQuote]}
          </motion.p>
        </div>

        {/* 滚动提示 - 增强动画 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center gap-2"
          >
            <span
              className="text-xs tracking-[0.3em] text-[#C9A227]/50"
              style={{ fontFamily: "'Noto Serif SC', serif" }}
            >
              SCROLL
            </span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-[#C9A227]/50 to-transparent" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* 角落装饰 - 带入场动画 */}
      <motion.div 
        className="absolute top-8 left-8 w-24 h-24 border-l border-t border-[#C9A227]/20"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 2 }}
      />
      <motion.div 
        className="absolute top-8 right-8 w-24 h-24 border-r border-t border-[#C9A227]/20"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 2.1 }}
      />
      <motion.div 
        className="absolute bottom-8 left-8 w-24 h-24 border-l border-b border-[#C9A227]/20"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 2.2 }}
      />
      <motion.div 
        className="absolute bottom-8 right-8 w-24 h-24 border-r border-b border-[#C9A227]/20"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 2.3 }}
      />
    </motion.section>
  );
}
