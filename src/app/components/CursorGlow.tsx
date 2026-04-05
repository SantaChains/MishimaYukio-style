"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export default function CursorGlow() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 200 };
  const slowSpringConfig = { damping: 30, stiffness: 100 };
  
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);
  const slowXSpring = useSpring(cursorX, slowSpringConfig);
  const slowYSpring = useSpring(cursorY, slowSpringConfig);

  // 点击波纹效果
  const addRipple = useCallback((x: number, y: number) => {
    const id = Date.now();
    setRipples((prev) => [...prev, { id, x, y }]);
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== id));
    }, 1000);
  }, []);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);
    const handleClick = (e: MouseEvent) => addRipple(e.clientX, e.clientY);

    // 检测悬停在可交互元素上
    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = 
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        !!target.closest("button") ||
        !!target.closest("a") ||
        target.classList.contains("cursor-pointer") ||
        target.closest("[role='button']") !== null;
      setIsHovering(isInteractive);
    };

    window.addEventListener("mousemove", moveCursor, { passive: true });
    window.addEventListener("mousemove", handleElementHover, { passive: true });
    window.addEventListener("click", handleClick);
    document.body.addEventListener("mouseleave", handleMouseLeave);
    document.body.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      window.removeEventListener("mousemove", handleElementHover);
      window.removeEventListener("click", handleClick);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
      document.body.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [cursorX, cursorY, isVisible, addRipple]);

  return (
    <>
      {/* 主光晕 - 金色 */}
      <motion.div
        className="fixed pointer-events-none z-50 mix-blend-screen will-change-transform"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          opacity: isVisible ? (isHovering ? 0.8 : 1) : 0,
          scale: isVisible ? (isHovering ? 1.5 : 1) : 0.5,
        }}
        transition={{ duration: 0.3 }}
      >
        <div
          className="w-64 h-64 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(201, 162, 39, 0.2) 0%, rgba(155, 27, 48, 0.1) 40%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
      </motion.div>

      {/* 次光晕 - 深海蓝 - 延迟跟随 */}
      <motion.div
        className="fixed pointer-events-none z-40 mix-blend-screen will-change-transform"
        style={{
          x: slowXSpring,
          y: slowYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          opacity: isVisible ? 0.6 : 0,
          scale: isVisible ? 1.2 : 0.8,
        }}
        transition={{ duration: 0.5 }}
      >
        <div
          className="w-96 h-96 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(26, 54, 93, 0.15) 0%, transparent 60%)",
            filter: "blur(60px)",
          }}
        />
      </motion.div>

      {/* 核心光点 */}
      <motion.div
        className="fixed pointer-events-none z-50 will-change-transform"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isHovering ? 0.5 : 1,
        }}
        transition={{ duration: 0.2 }}
      >
        <div
          className="w-2 h-2 rounded-full bg-[#C9A227]"
          style={{
            boxShadow: isHovering 
              ? "0 0 30px rgba(201, 162, 39, 0.8), 0 0 60px rgba(201, 162, 39, 0.4)"
              : "0 0 20px rgba(201, 162, 39, 0.5)",
            transition: "box-shadow 0.3s ease",
          }}
        />
      </motion.div>

      {/* 点击波纹效果 */}
      {ripples.map((ripple) => (
        <motion.div
          key={ripple.id}
          className="fixed pointer-events-none z-40"
          style={{
            left: ripple.x,
            top: ripple.y,
            translateX: "-50%",
            translateY: "-50%",
          }}
          initial={{ width: 0, height: 0, opacity: 0.8 }}
          animate={{ width: 100, height: 100, opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <div
            className="w-full h-full rounded-full border-2 border-[#C9A227]/50"
            style={{
              boxShadow: "0 0 20px rgba(201, 162, 39, 0.3)",
            }}
          />
        </motion.div>
      ))}

      {/* 悬停状态指示器 */}
      <motion.div
        className="fixed pointer-events-none z-45 will-change-transform"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          opacity: isVisible && isHovering ? 0.5 : 0,
          scale: isHovering ? 1 : 0.5,
        }}
        transition={{ duration: 0.2 }}
      >
        <div
          className="w-12 h-12 rounded-full border border-[#C9A227]/30"
          style={{
            boxShadow: "0 0 15px rgba(201, 162, 39, 0.2)",
          }}
        />
      </motion.div>
    </>
  );
}
