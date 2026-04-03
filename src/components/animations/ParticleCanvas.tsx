'use client';

import { useRef, useEffect, useCallback } from 'react';
import { AnimationPhase } from '@/hooks/useAnimationPhase';
import { cn } from '@/lib/utils';

interface Particle {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  size: number;
  color: string;
  velocityX: number;
  velocityY: number;
  angle: number;
  angularVelocity: number;
  opacity: number;
  targetX: number | null;
  targetY: number | null;
  chaos: number;
}

interface ParticleCanvasProps {
  phase: AnimationPhase;
  particleCount?: number;
  showConnections?: boolean;
  className?: string;
}

const CHAOS_COLORS = ['#FF3B5C', '#FF9500', '#FF6B35'];
const ORDER_COLORS = ['#00D4FF', '#7B2FFF', '#FFFFFF'];

export function ParticleCanvas({
  phase,
  particleCount = 150,
  showConnections = true,
  className,
}: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(null);
  const mouseRef = useRef({ x: null as number | null, y: null as number | null, radius: 150 });
  const dimensionsRef = useRef({ width: 0, height: 0 });

  const createParticle = useCallback((width: number, height: number, colors: string[]): Particle => {
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      baseX: Math.random() * width,
      baseY: Math.random() * height,
      size: Math.random() * 3 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
      velocityX: (Math.random() - 0.5) * 1,
      velocityY: (Math.random() - 0.5) * 1,
      angle: Math.random() * Math.PI * 2,
      angularVelocity: (Math.random() - 0.5) * 0.02,
      opacity: Math.random() * 0.5 + 0.5,
      targetX: null,
      targetY: null,
      chaos: Math.random(),
    };
  }, []);

  const phaseRef = useRef(phase);
  useEffect(() => {
     phaseRef.current = phase;
  }, [phase]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();

      dimensionsRef.current = {
        width: rect.width,
        height: rect.height
      };

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;

      ctx.scale(dpr, dpr);

      // Recreate particles on resize
      particlesRef.current = Array.from({ length: particleCount }, () =>
        createParticle(rect.width, rect.height, ORDER_COLORS)
      );
    };

    window.addEventListener('resize', resize);
    resize();

    let lastTime = performance.now();

    const render = (currentTime: number) => {
      const deltaTime = currentTime - lastTime;
      lastTime = currentTime;
      const dt = deltaTime / 16.67; // Normalize to 60fps

      const { width, height } = dimensionsRef.current;

      ctx.clearRect(0, 0, width, height);

      const particles = particlesRef.current;

      // Update Phase State
      const currentPhase = phaseRef.current;
      if (currentPhase === 'chaos') {
        particles.forEach(p => {
            if (p.chaos < 1) {
                p.color = CHAOS_COLORS[Math.floor(Math.random() * CHAOS_COLORS.length)];
                p.velocityX = (Math.random() - 0.5) * 3;
                p.velocityY = (Math.random() - 0.5) * 3;
                p.chaos = 1;
            }
        });
      } else if (currentPhase === 'transformation') {
          particles.forEach((p, i) => {
             if (p.chaos === 1) {
                setTimeout(() => {
                    p.color = '#00D4FF';
                    p.velocityX *= 0.5;
                    p.velocityY *= 0.5;
                    p.chaos = 0.5;
                }, i * 10);
             }
          });
      } else if (currentPhase === 'order' || currentPhase === 'logoReveal') {
          particles.forEach(p => {
              if (p.chaos > 0) {
                p.color = ORDER_COLORS[Math.floor(Math.random() * ORDER_COLORS.length)];
                p.velocityX = (Math.random() - 0.5) * 0.5;
                p.velocityY = (Math.random() - 0.5) * 0.5;
                p.chaos = 0;
              }
          });
      } else if (currentPhase === 'converge' || currentPhase === 'tagline' || currentPhase === 'complete') {
          const centerX = width / 2;
          const centerY = height / 2;
          particles.forEach((p, i) => {
              if (p.targetX === null) {
                  const angle = (i / particles.length) * Math.PI * 2;
                  const radius = 50 + Math.random() * 100;
                  p.targetX = centerX + Math.cos(angle) * radius;
                  p.targetY = centerY + Math.sin(angle) * radius;
              }
          });
      }


      // Draw Connections
      if (showConnections) {
        const maxDist = Math.min(150, width * 0.1);
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < maxDist) {
              const opacity = (1 - distance / maxDist) * 0.3;
              ctx.beginPath();
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.strokeStyle = currentPhase === 'chaos'
                ? `rgba(255, 59, 92, ${opacity})`
                : `rgba(0, 212, 255, ${opacity})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      }

      // Update and Draw Particles
      for (const p of particles) {
        // Update
        if (currentPhase === 'chaos') {
            p.angle += p.angularVelocity * p.chaos;
            p.velocityX += Math.sin(p.angle) * 0.1 * dt;
            p.velocityY += Math.cos(p.angle) * 0.1 * dt;
            p.velocityX += (Math.random() - 0.5) * 0.2 * dt;
            p.velocityY += (Math.random() - 0.5) * 0.2 * dt;
        } else if (currentPhase === 'transformation') {
            p.velocityX *= 0.98;
            p.velocityY *= 0.98;
            p.chaos *= 0.95;
        } else if (currentPhase === 'order' || currentPhase === 'logoReveal') {
            p.velocityX *= 0.99;
            p.velocityY *= 0.99;
        } else if (currentPhase === 'converge' || currentPhase === 'tagline' || currentPhase === 'complete') {
            if (p.targetX !== null && p.targetY !== null) {
                const dx = p.targetX - p.x;
                const dy = p.targetY - p.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance > 1) {
                  const force = Math.min(distance * 0.05, 5);
                  p.velocityX += (dx / distance) * force * dt;
                  p.velocityY += (dy / distance) * force * dt;
                }
                p.velocityX *= 0.92;
                p.velocityY *= 0.92;
            }
        } else {
             p.angle += p.angularVelocity;
             p.velocityX += Math.sin(p.angle) * 0.02 * dt;
             p.velocityY += Math.cos(p.angle) * 0.02 * dt;
        }

        // Apply mouse interaction
        if (mouseRef.current.x !== null && mouseRef.current.y !== null) {
            const dx = p.x - mouseRef.current.x;
            const dy = p.y - mouseRef.current.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < mouseRef.current.radius) {
                const force = (mouseRef.current.radius - dist) / mouseRef.current.radius;
                const angle = Math.atan2(dy, dx);
                p.velocityX += Math.cos(angle) * force * 0.5 * dt;
                p.velocityY += Math.sin(angle) * force * 0.5 * dt;
            }
        }

        p.x += p.velocityX * dt;
        p.y += p.velocityY * dt;

        // Boundaries
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        // Draw
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();

        if (p.size > 2) {
            ctx.shadowColor = p.color;
            ctx.shadowBlur = p.size * 3;
            ctx.fill();
            ctx.shadowBlur = 0;
        }
        ctx.globalAlpha = 1;
      }

      animationRef.current = requestAnimationFrame(render);
    };

    animationRef.current = requestAnimationFrame(render);

    const handleMouseMove = (e: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        mouseRef.current.x = e.clientX - rect.left;
        mouseRef.current.y = e.clientY - rect.top;
    };
    const handleMouseLeave = () => {
        mouseRef.current.x = null;
        mouseRef.current.y = null;
    }

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [particleCount, showConnections, createParticle]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("pointer-events-auto transition-opacity duration-500", className)}
      aria-hidden="true"
    />
  );
}