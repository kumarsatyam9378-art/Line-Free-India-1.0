import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LogoRevealProps {
  isActive: boolean;
  className?: string;
}

export function LogoReveal({ isActive, className }: LogoRevealProps) {
  if (!isActive) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        opacity: { duration: 1.2, ease: [0.22, 1, 0.36, 1] },
        scale: { duration: 1.2, ease: [0.34, 1.56, 0.64, 1] } // ease-back-out
      }}
      className={cn("absolute z-10 flex items-center justify-center", className)}
    >
      <div className="relative flex items-center justify-center">
        <div className="relative z-10">
          <svg className="w-[clamp(280px,50vw,500px)] h-auto overflow-visible" viewBox="0 0 400 120" fill="none">
            <defs>
              <linearGradient id="orderGradientLogo" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00D4FF" />
                <stop offset="100%" stopColor="#7B2FFF" />
              </linearGradient>
            </defs>
            <motion.text
              x="200"
              y="50"
              textAnchor="middle"
              className="font-display font-bold text-5xl tracking-[0.15em]"
              fill="#FFFFFF"
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
            >
              LINE FREE
            </motion.text>
            <motion.text
              x="200"
              y="100"
              textAnchor="middle"
              className="font-display font-bold text-4xl tracking-[0.3em]"
              fill="url(#orderGradientLogo)"
              initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            >
              INDIA
            </motion.text>
          </svg>
        </div>

        {/* Glow Effect */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0.8] }}
          transition={{ duration: 2, times: [0, 0.5, 1] }}
          className="absolute inset-[-50%] bg-[radial-gradient(ellipse_at_center,_rgba(108,99,255,0.5)_0%,_transparent_70%)] blur-3xl -z-10 animate-glow-pulse"
        />
      </div>
    </motion.div>
  );
}