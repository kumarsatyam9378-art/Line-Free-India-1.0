import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TaglineRevealProps {
  words: string[];
  className?: string;
}

export function TaglineReveal({ words, className }: TaglineRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={cn("flex flex-col items-center gap-4 z-10", className)}
    >
      <div className="overflow-hidden">
        <span className="flex gap-3 font-display text-3xl font-medium text-white/90 tracking-wider uppercase">
          {words.map((word, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: "100%" }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
                delay: index * 0.15
              }}
              className="inline-block"
            >
              {word}
            </motion.span>
          ))}
        </span>
      </div>

      <motion.div
        initial={{ width: 0 }}
        animate={{ width: "100%" }}
        transition={{
          duration: 0.8,
          ease: [0.22, 1, 0.36, 1],
          delay: 0.45
        }}
        className="h-[2px] bg-gradient-to-r from-primary to-accent rounded-full"
      />
    </motion.div>
  );
}