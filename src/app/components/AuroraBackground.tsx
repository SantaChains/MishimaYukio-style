"use client";

import { useEffect, useRef, useCallback } from "react";
import { motion } from "framer-motion";

export default function AuroraBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0.5, y: 0.5 });
  const animationIdRef = useRef<number | null>(null);
  const isVisibleRef = useRef(true);

  // 鼠标位置追踪
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      };
    };

    // 页面可见性检测 - 节省资源
    const handleVisibilityChange = () => {
      isVisibleRef.current = document.visibilityState === "visible";
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 如果页面不可见，跳过渲染
    if (!isVisibleRef.current) {
      animationIdRef.current = requestAnimationFrame(draw);
      return;
    }

    let time = 0;

    // 流体噪声函数 - 三层叠加创造自然流动
    const noise = (x: number, y: number, t: number) => {
      return (
        Math.sin(x * 0.01 + t) * Math.cos(y * 0.01 + t * 0.5) * 0.5 +
        Math.sin(x * 0.02 - t * 0.3) * Math.sin(y * 0.015 + t * 0.7) * 0.3 +
        Math.cos(x * 0.005 + y * 0.008 + t * 0.2) * 0.2
      );
    };

    const render = () => {
      time += 0.008;

      // 鼠标影响中心点
      const centerX = canvas.width * (0.5 + (mouseRef.current.x - 0.5) * 0.1);
      const centerY = canvas.height * (0.3 + (mouseRef.current.y - 0.5) * 0.1);

      // 创建渐变背景
      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        canvas.width * 0.5,
        canvas.height * 0.5,
        canvas.width * 0.8
      );

      gradient.addColorStop(0, "rgba(201, 162, 39, 0.15)");
      gradient.addColorStop(0.3, "rgba(155, 27, 48, 0.1)");
      gradient.addColorStop(0.6, "rgba(26, 54, 93, 0.15)");
      gradient.addColorStop(1, "rgba(10, 10, 10, 0)");

      ctx.fillStyle = "rgba(10, 10, 10, 0.03)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 绘制流动极光 - 根据屏幕尺寸调整步长
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      const skipPixels = window.innerWidth < 768 ? 6 : 4;

      for (let y = 0; y < canvas.height; y += skipPixels) {
        for (let x = 0; x < canvas.width; x += skipPixels) {
          const n = noise(x, y, time);
          const n2 = noise(x + 1000, y + 1000, time * 0.7);

          // 三岛美学色彩映射
          const r = Math.floor(201 + n * 100 + n2 * 50);
          const g = Math.floor(162 + n * 30 - n2 * 80);
          const b = Math.floor(39 + n2 * 100);
          const a = Math.abs(n) * 0.15;

          // 填充像素块
          for (let dy = 0; dy < skipPixels && y + dy < canvas.height; dy++) {
            for (let dx = 0; dx < skipPixels && x + dx < canvas.width; dx++) {
              const idx = ((y + dy) * canvas.width + (x + dx)) * 4;
              if (idx < data.length) {
                data[idx] = Math.min(255, Math.max(0, r));
                data[idx + 1] = Math.min(255, Math.max(0, g));
                data[idx + 2] = Math.min(255, Math.max(0, b));
                data[idx + 3] = Math.floor(a * 255);
              }
            }
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);

      // 叠加动态光晕效果 - 受鼠标影响
      const glowGradient = ctx.createRadialGradient(
        canvas.width * (0.3 + Math.sin(time) * 0.2 + (mouseRef.current.x - 0.5) * 0.1),
        canvas.height * (0.4 + Math.cos(time * 0.7) * 0.1 + (mouseRef.current.y - 0.5) * 0.1),
        0,
        canvas.width * 0.5,
        canvas.height * 0.5,
        canvas.width * 0.6
      );

      glowGradient.addColorStop(0, "rgba(255, 107, 53, 0.08)");
      glowGradient.addColorStop(0.5, "rgba(201, 162, 39, 0.05)");
      glowGradient.addColorStop(1, "rgba(10, 10, 10, 0)");

      ctx.fillStyle = glowGradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      animationIdRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize);

    const cleanup = draw();

    return () => {
      window.removeEventListener("resize", resize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      cleanup?.();
    };
  }, [draw]);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Canvas 流体背景 */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full will-change-transform"
        style={{ 
          filter: "blur(60px)",
          transform: "translateZ(0)",
        }}
      />

      {/* CSS 动画层 - 模糊光球 */}
      <motion.div
        className="absolute w-[800px] h-[800px] rounded-full will-change-transform"
        style={{
          background:
            "radial-gradient(circle, rgba(201, 162, 39, 0.3) 0%, rgba(155, 27, 48, 0.2) 40%, transparent 70%)",
          filter: "blur(80px)",
          left: "10%",
          top: "20%",
        }}
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -80, 60, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute w-[600px] h-[600px] rounded-full will-change-transform"
        style={{
          background:
            "radial-gradient(circle, rgba(26, 54, 93, 0.4) 0%, rgba(131, 56, 236, 0.2) 50%, transparent 70%)",
          filter: "blur(100px)",
          right: "5%",
          top: "30%",
        }}
        animate={{
          x: [0, -120, 80, 0],
          y: [0, 100, -60, 0],
          scale: [1, 0.8, 1.3, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute w-[500px] h-[500px] rounded-full will-change-transform"
        style={{
          background:
            "radial-gradient(circle, rgba(255, 107, 53, 0.25) 0%, rgba(201, 162, 39, 0.15) 50%, transparent 70%)",
          filter: "blur(90px)",
          left: "40%",
          bottom: "10%",
        }}
        animate={{
          x: [0, 60, -100, 0],
          y: [0, -120, 40, 0],
          scale: [1, 1.1, 0.85, 1],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* 金阁火焰效果层 */}
      <div
        className="absolute inset-0 opacity-30 will-change-transform"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(201, 162, 39, 0.2) 0%, transparent 50%)",
          animation: "kinkakuFlame 8s ease-in-out infinite",
        }}
      />

      {/* 噪点纹理层 */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  );
}
