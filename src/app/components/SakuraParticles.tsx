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
}

export default function SakuraParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationIdRef = useRef<number>();

  const createParticle = useCallback((canvas: HTMLCanvasElement): Particle => {
    const colors = [
      "rgba(248, 244, 240, ", // sakura-white
      "rgba(240, 230, 224, ", // sakura-pale
      "rgba(255, 200, 200, ", // light pink
      "rgba(201, 162, 39, ", // kin-kaku
      "rgba(255, 255, 255, ", // pure white
    ];

    return {
      x: Math.random() * canvas.width,
      y: -20,
      size: Math.random() * 4 + 2,
      speedX: Math.random() * 1 - 0.5,
      speedY: Math.random() * 1.5 + 0.5,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.05,
      opacity: Math.random() * 0.5 + 0.3,
      color: colors[Math.floor(Math.random() * colors.length)],
      swayAmplitude: Math.random() * 30 + 10,
      swayFrequency: Math.random() * 0.02 + 0.01,
      time: Math.random() * Math.PI * 2,
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);

    // 初始化粒子
    for (let i = 0; i < 50; i++) {
      const particle = createParticle(canvas);
      particle.y = Math.random() * canvas.height;
      particlesRef.current.push(particle);
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

      // 绘制樱花花瓣形状
      ctx.beginPath();
      ctx.moveTo(0, -size);
      ctx.bezierCurveTo(size * 0.5, -size * 0.5, size, 0, 0, size);
      ctx.bezierCurveTo(-size, 0, -size * 0.5, -size * 0.5, 0, -size);
      ctx.fill();

      // 花瓣纹理
      ctx.strokeStyle = color + (opacity * 0.5) + ")";
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, -size * 0.8);
      ctx.lineTo(0, size * 0.8);
      ctx.stroke();

      ctx.restore();
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle, index) => {
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
        if (particle.y > canvas.height + 20) {
          particlesRef.current[index] = createParticle(canvas);
        }
        if (particle.x < -20) particle.x = canvas.width + 20;
        if (particle.x > canvas.width + 20) particle.x = -20;
      });

      animationIdRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
    };
  }, [createParticle]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10"
      style={{ mixBlendMode: "screen" }}
    />
  );
}
