import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SkipButtonProps {
  onSkip: () => void;
  className?: string;
}

export function SkipButton({ onSkip, className }: SkipButtonProps) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onSkip}
      className={cn(
        "flex items-center gap-2 px-4 py-3 bg-white/5 border border-white/10 rounded-full text-white/70 font-body text-sm font-medium cursor-pointer z-20 backdrop-blur-md transition-colors hover:bg-white/10 hover:border-white/30 hover:text-white focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2",
        className
      )}
      aria-label="Skip animation"
    >
      <span className="tracking-wide">Skip</span>
      <span className="hidden sm:inline-block px-2 py-1 bg-white/10 rounded text-xs font-mono opacity-70">ESC</span>
      <svg className="w-4 h-4 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 4l10 8-10 8V4z" />
        <line x1="19" y1="5" x2="19" y2="19" />
      </svg>
    </motion.button>
  );
}