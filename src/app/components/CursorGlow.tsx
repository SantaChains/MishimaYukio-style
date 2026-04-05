"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CursorGlow() {
  const [isVisible, setIsVisible] = useState(false);
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  const springConfig = { damping: 25, stiffness: 200 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", moveCursor);
    document.body.addEventListener("mouseleave", handleMouseLeave);
    document.body.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
      document.body.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [cursorX, cursorY, isVisible]);

  return (
    <>
      {/* 主光晕 */}
      <motion.div
        className="fixed pointer-events-none z-50 mix-blend-screen"
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          opacity: isVisible ? 1 : 0,
          scale: isVisible ? 1 : 0.5,
        }}
        transition={{ duration: 0.3 }}
      >
        <div
          className="w-64 h-64 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(201, 162, 39, 0.15) 0%, rgba(155, 27, 48, 0.08) 40%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
      </motion.div>

      {/* 次光晕 - 延迟跟随 */}
      <motion.div
        className="fixed pointer-events-none z-40 mix-blend-screen"
        style={{
          x: useSpring(cursorX, { damping: 30, stiffness: 100 }),
          y: useSpring(cursorY, { damping: 30, stiffness: 100 }),
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          opacity: isVisible ? 0.6 : 0,
        }}
        transition={{ duration: 0.5 }}
      >
        <div
          className="w-96 h-96 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(26, 54, 93, 0.1) 0%, transparent 60%)",
            filter: "blur(60px)",
          }}
        />
      </motion.div>

      {/* 核心光点 */}
      <motion.div
        className="fixed pointer-events-none z-50"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          opacity: isVisible ? 1 : 0,
        }}
      >
        <div
          className="w-2 h-2 rounded-full bg-[#C9A227]/50"
          style={{
            boxShadow: "0 0 20px rgba(201, 162, 39, 0.5)",
          }}
        />
      </motion.div>
    </>
  );
}
