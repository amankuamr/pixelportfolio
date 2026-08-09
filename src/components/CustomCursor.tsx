"use client";

import { useEffect, useRef, useState } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  color: string;
}

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const particlesRef = useRef<Particle[]>([]);
  const [particles, setParticles] = useState<Particle[]>([]);
  const rafRef = useRef<number>(0);
  const particleIdRef = useRef(0);

  useEffect(() => {
    let mouseX = -100;
    let mouseY = -100;
    let lastEmitX = -100;
    let lastEmitY = -100;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const colors = ["#D9FF00", "#22c55e", "#3b82f6", "#ef4444", "#ffffff"];

    const emitParticles = () => {
      const dx = mouseX - lastEmitX;
      const dy = mouseY - lastEmitY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 8) {
        const count = Math.min(3, Math.floor(dist / 8));
        const newParticles: Particle[] = [];

        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 0.3 + Math.random() * 0.7;
          newParticles.push({
            id: particleIdRef.current++,
            x: mouseX + (Math.random() - 0.5) * 6,
            y: mouseY + (Math.random() - 0.5) * 6,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 0,
            maxLife: 20 + Math.random() * 15,
            size: 1 + Math.random() * 2,
            color: colors[Math.floor(Math.random() * colors.length)],
          });
        }

        particlesRef.current = [...particlesRef.current, ...newParticles].slice(-60);
        lastEmitX = mouseX;
        lastEmitY = mouseY;
      }
    };

    const updateParticles = () => {
      particlesRef.current = particlesRef.current
        .map((p) => ({
          ...p,
          x: p.x + p.vx,
          y: p.y + p.vy,
          life: p.life + 1,
        }))
        .filter((p) => p.life < p.maxLife);

      setParticles([...particlesRef.current]);
    };

    const updateCursor = () => {
      setPosition({ x: mouseX, y: mouseY });
      emitParticles();
      updateParticles();
      rafRef.current = requestAnimationFrame(updateCursor);
    };

    document.addEventListener("mousemove", handleMouseMove, { passive: true });
    rafRef.current = requestAnimationFrame(updateCursor);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 pointer-events-none z-[9999]">
      <div
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          willChange: "transform",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/cursors/main.png"
          alt=""
          className="select-none"
          style={{
            width: 24,
            height: 24,
            imageRendering: "crisp-edges",
            pointerEvents: "none",
            transform: "translate(-50%, -50%)",
          }}
          draggable={false}
        />
      </div>

      {particles.map((p) => {
        const opacity = 1 - p.life / p.maxLife;
        return (
          <div
            key={p.id}
            className="absolute pointer-events-none"
            style={{
              left: p.x,
              top: p.y,
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              opacity,
              imageRendering: "crisp-edges",
              transform: "translate(-50%, -50%)",
            }}
          />
        );
      })}
    </div>
  );
}
