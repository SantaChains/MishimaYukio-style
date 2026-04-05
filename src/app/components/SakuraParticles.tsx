"use client";

import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  color: string;
  swayAmplitude: number;
  swayFrequency: number;
  time: number;
  // 新增：鼠标交互相关
  originalSpeedY: number;
  mouseInfluence: number;
}

export default function SakuraParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationIdRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const isVisibleRef = useRef(true);
  const frameCountRef = useRef(0);

  const createParticle = useCallback((canvas: HTMLCanvasElement, initialY = false): Particle => {
    const colors = [
      "rgba(248, 244, 240, ", // sakura-white
      "rgba(240, 230, 224, ", // sakura-pale
      "rgba(255, 200, 200, ", // light pink
      "rgba(201, 162, 39, ", // kin-kaku
      "rgba(255, 255, 255, ", // pure white
    ];

    const speedY = Math.random() * 1.5 + 0.5;

    return {
      x: Math.random() * canvas.width,
      y: initialY ? Math.random() * canvas.height : -20,
      size: Math.random() * 4 + 2,
      speedX: Math.random() * 1 - 0.5,
      speedY: speedY,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.05,
      opacity: Math.random() * 0.5 + 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
      swayAmplitude: Math.random() * 30 + 10,
      swayFrequency: Math.random() * 0.02 + 0.01,
      time: Math.random() * Math.PI * 2,
      originalSpeedY: speedY,
      mouseInfluence: 0,
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

    // 鼠标追踪
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
        active: true,
      };
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    // 页面可见性检测
    const handleVisibilityChange = () => {
      isVisibleRef.current = document.visibilityState === "visible";
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.body.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // 根据屏幕尺寸调整粒子数量
    const getParticleCount = () => {
      const width = window.innerWidth;
      if (width < 768) return 30;
      if (width < 1024) return 40;
      return 50;
    };

    // 初始化粒子
    const particleCount = getParticleCount();
    for (let i = 0; i < particleCount; i++) {
      particlesRef.current.push(createParticle(canvas, true));
    }

    const drawPetal = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      rotation: number,
      color: string,
      opacity: number
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      ctx.globalAlpha = opacity;
      ctx.fillStyle = color + opacity + ")";

      // 绘制樱花花瓣形状 - 使用贝塞尔曲线
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.bezierCurveTo(size * 0.5, -size * 0.5, size, 0, 0, size);
      ctx.bezierCurveTo(-size, 0, -size * 0.5, -size * 0.5, 0, -size);
      ctx.fill();

      // 花瓣纹理线
      ctx.strokeStyle = color + (opacity * 0.5) + ")";
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, -size * 0.8);
      ctx.lineTo(0, size * 0.8);
      ctx.stroke();

      ctx.restore();
    };

    const animate = () => {
      frameCountRef.current++;

      // 如果页面不可见，降低渲染频率
      if (!isVisibleRef.current) {
        if (frameCountRef.current % 3 !== 0) {
          animationIdRef.current = requestAnimationFrame(animate);
          return;
        }
      }

      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

      particlesRef.current.forEach((particle, index) => {
        // 鼠标交互影响
        if (mouseRef.current.active) {
          const dx = mouseRef.current.x - particle.x;
          const dy = mouseRef.current.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const maxDistance = 150;

          if (distance < maxDistance) {
            const force = (1 - distance / maxDistance) * 0.02;
            particle.mouseInfluence = Math.min(particle.mouseInfluence + force, 0.5);
            particle.speedX += dx * force * 0.1;
            particle.speedY += dy * force * 0.1;
          } else {
            particle.mouseInfluence = Math.max(particle.mouseInfluence - 0.01, 0);
          }
        } else {
          particle.mouseInfluence = Math.max(particle.mouseInfluence - 0.01, 0);
        }

        // 恢复原始速度
        particle.speedY += (particle.originalSpeedY - particle.speedY) * 0.02;
        particle.speedX += (Math.sin(particle.time) * 0.5 - particle.speedX) * 0.02;

        // 更新位置
        particle.time += particle.swayFrequency;
        particle.x +=
          particle.speedX + Math.sin(particle.time) * particle.swayAmplitude * 0.02;
        particle.y += particle.speedY;
        particle.rotation += particle.rotationSpeed;

        // 绘制花瓣
        drawPetal(
          ctx,
          particle.x,
          particle.y,
          particle.size,
          particle.rotation,
          particle.color,
          particle.opacity
        );

        // 重置超出屏幕的粒子
        if (particle.y > canvas.height / dpr + 20) {
          particlesRef.current[index] = createParticle(canvas);
        }
        if (particle.x < -20) particle.x = canvas.width / dpr + 20;
        if (particle.x > canvas.width / dpr + 20) particle.x = -20;
      });

      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      document.body.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [createParticle]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 will-change-transform"
      style={{ 
        mixBlendMode: "screen",
        transform: "translateZ(0)",
      }}
    />
  );
}
