import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TransformationWaveProps {
  className?: string;
}

export function TransformationWave({ className }: TransformationWaveProps) {
  return (
    <div className={cn("pointer-events-none flex items-center justify-center", className)}>
      <svg className="w-full h-full" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
        <defs>
          <linearGradient id="orderGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00D4FF" />
            <stop offset="100%" stopColor="#7B2FFF" />
          </linearGradient>
          <filter id="intenseGlow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="8" result="coloredBlur" />
            <feColorMatrix in="coloredBlur" type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 2 0" />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g>
          {[1, 2, 3].map((i) => (
            <motion.ellipse
              key={i}
              cx="960"
              cy="540"
              fill="none"
              stroke="url(#orderGradient)"
              strokeWidth={4 - i}
              filter="url(#intenseGlow)"
              initial={{ rx: 0, ry: 0, opacity: 1 - i * 0.25 }}
              animate={{
                rx: 1500,
                ry: 900,
                opacity: 0
              }}
              transition={{
                duration: 1.5,
                ease: [0.16, 1, 0.3, 1], // ease-expo-out equivalent
                delay: i * 0.15
              }}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}