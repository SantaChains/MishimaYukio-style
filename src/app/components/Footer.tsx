"use client";

import { motion } from "framer-motion";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative py-20 px-4 overflow-hidden">
      {/* 顶部渐变线 */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#C9A227]/30 to-transparent" />

      <div className="max-w-6xl mx-auto">
        {/* 主内容 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            className="text-6xl md:text-8xl font-bold mb-6"
            style={{
              fontFamily: "'Cinzel', serif",
              background:
                "linear-gradient(135deg, rgba(201, 162, 39, 0.3) 0%, rgba(248, 244, 240, 0.1) 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
            whileHover={{
              background:
                "linear-gradient(135deg, rgba(201, 162, 39, 0.6) 0%, rgba(248, 244, 240, 0.3) 100%)",
            }}
          >
            SantaChains
          </motion.div>

          <p
            className="text-[#F8F4F0]/40 text-sm tracking-[0.3em] mb-8"
            style={{ fontFamily: "'Noto Serif SC', serif" }}
          >
            三島由紀夫の美学を継承する
          </p>

          {/* 装饰分隔 */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="w-16 h-[1px] bg-gradient-to-r from-transparent to-[#C9A227]/30" />
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="w-3 h-3 border border-[#C9A227]/40 rotate-45"
            />
            <div className="w-16 h-[1px] bg-gradient-to-l from-transparent to-[#C9A227]/30" />
          </div>
        </motion.div>

        {/* 引用 */}
        <motion.blockquote
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <p
            className="text-lg text-[#F8F4F0]/50 italic leading-relaxed"
            style={{ fontFamily: "'Noto Serif SC', serif" }}
          >
            「人間は、美しさのために生き、美しさのために死ぬ」
          </p>
          <cite
            className="text-xs text-[#C9A227]/40 mt-4 block not-italic tracking-wider"
            style={{ fontFamily: "'Noto Serif SC', serif" }}
          >
            — 三島由紀夫
          </cite>
        </motion.blockquote>

        {/* 底部信息 */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-[#C9A227]/10"
        >
          <p
            className="text-xs text-[#F8F4F0]/30 tracking-wider"
            style={{ fontFamily: "'Noto Serif SC', serif" }}
          >
            © {currentYear} SantaChains. All rights reserved.
          </p>

          <div className="flex items-center gap-6">
            {["GitHub", "Twitter", "Mail"].map((link) => (
              <motion.a
                key={link}
                href="#"
                className="text-xs text-[#F8F4F0]/30 hover:text-[#C9A227]/70 transition-colors tracking-wider"
                style={{ fontFamily: "'Noto Serif SC', serif" }}
                whileHover={{ y: -2 }}
              >
                {link}
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>

      {/* 背景装饰 */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none">
        <div
          className="w-full h-full"
          style={{
            background:
              "radial-gradient(ellipse at center bottom, rgba(201, 162, 39, 0.05) 0%, transparent 60%)",
          }}
        />
      </div>
    </footer>
  );
}
