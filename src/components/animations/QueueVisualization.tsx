import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AnimationPhase } from '@/hooks/useAnimationPhase';

interface QueueVisualizationProps {
  phase: AnimationPhase;
  className?: string;
}

export function QueueVisualization({ phase, className }: QueueVisualizationProps) {
  const isChaos = phase === 'chaos' || phase === 'transformation';

  if (!isChaos) return null;

  // Create an array of lines to animate
  const lines = Array.from({ length: 15 });

  return (
    <div className={cn("pointer-events-none", className)}>
      <svg className="w-full h-full" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="chaosGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF3B5C" />
            <stop offset="50%" stopColor="#FF9500" />
            <stop offset="100%" stopColor="#FF3B5C" />
          </linearGradient>
          <filter id="glowFilter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === 'chaos' ? 1 : 0 }}
          transition={{ duration: 1 }}
        >
          {lines.map((_, i) => {
            // Generate some random chaotic paths
            const startX = Math.random() * 1920;
            const startY = Math.random() * 1080;

            let d = `M ${startX} ${startY}`;
            for(let j=0; j<5; j++) {
              d += ` C ${Math.random() * 1920},${Math.random() * 1080} ${Math.random() * 1920},${Math.random() * 1080} ${Math.random() * 1920},${Math.random() * 1080}`;
            }

            return (
              <motion.path
                key={i}
                d={d}
                fill="none"
                stroke="url(#chaosGradient)"
                strokeWidth="2"
                strokeLinecap="round"
                filter="url(#glowFilter)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{
                  pathLength: [0, 1, 1],
                  opacity: [0, 1, 0.5],
                  pathOffset: [0, 0, 1]
                }}
                transition={{
                  duration: 4,
                  ease: "easeInOut",
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            );
          })}
        </motion.g>
      </svg>
    </div>
  );
}