import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CinematicIntroProps {
  onDone: () => void;
  durationMs?: number;
  skipEnabled?: boolean;
}

const INTRO_KEY = 'lfi_intro_seen_v3';

function getParticleCount() {
  if (typeof window === 'undefined') return 30;
  const cores = navigator.hardwareConcurrency || 4;
  if (cores <= 2) return 24;
  if (window.innerWidth < 768) return 36;
  return 56;
}

export function shouldShowIntro() {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  return localStorage.getItem(INTRO_KEY) !== 'true';
}

export default function CinematicIntro({ onDone, durationMs = 4200, skipEnabled = true }: CinematicIntroProps) {
  const [phase, setPhase] = useState(0);
  const [hidden, setHidden] = useState(false);
  const particles = useMemo(
    () => Array.from({ length: getParticleCount() }, (_, i) => ({ id: i, x: Math.random() * 100, y: Math.random() * 100, s: Math.random() * 2 + 1 })),
    [],
  );

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 650);
    const t2 = setTimeout(() => setPhase(2), 1650);
    const t3 = setTimeout(() => setPhase(3), 2850);
    const done = setTimeout(() => {
      localStorage.setItem(INTRO_KEY, 'true');
      setHidden(true);
      setTimeout(onDone, 280);
    }, durationMs);

    return () => [t1, t2, t3, done].forEach(clearTimeout);
  }, [durationMs, onDone]);

  const skip = () => {
    localStorage.setItem(INTRO_KEY, 'true');
    setHidden(true);
    setTimeout(onDone, 140);
  };

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.div
          className="fixed inset-0 z-[9999] overflow-hidden bg-[#050505]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          aria-label="Line Free India intro animation"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,120,50,0.20),transparent_36%),radial-gradient(circle_at_80%_80%,rgba(0,212,255,0.18),transparent_42%)]" />

          {particles.map((p) => (
            <motion.span
              key={p.id}
              className="absolute rounded-full bg-[#00D4FF]"
              style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s }}
              animate={{ opacity: [0.2, 0.7, 0.2], y: [0, -14, 0] }}
              transition={{ duration: 2.3 + (p.id % 5), repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}

          <motion.div className="absolute inset-0" initial={{ opacity: 0.2 }} animate={{ opacity: phase >= 1 ? 0.6 : 0.2 }}>
            {Array.from({ length: 7 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-[1px] bg-gradient-to-r from-transparent via-orange-400/90 to-transparent"
                style={{ top: `${20 + i * 9}%`, width: '100%' }}
                animate={{ x: phase >= 2 ? ['-25%', '20%', '-25%'] : ['-8%', '8%', '-8%'] }}
                transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.07 }}
              />
            ))}
          </motion.div>

          <motion.div
            className="absolute inset-y-0 left-[-40%] w-[40%] bg-gradient-to-r from-transparent via-[#00D4FF]/75 to-transparent blur-2xl"
            animate={{ x: phase >= 2 ? '430%' : '-10%', opacity: phase >= 2 ? [0, 1, 0] : 0 }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <motion.h1
              className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-[#00D4FF] via-white to-[#7B2FFF] bg-clip-text text-transparent"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ opacity: phase >= 2 ? 1 : 0.85, scale: phase >= 2 ? 1 : 0.95 }}
              transition={{ duration: 0.55 }}
            >
              LINE FREE INDIA
            </motion.h1>
            <motion.p
              className="mt-3 text-white/85 text-xs md:text-sm tracking-[0.18em] uppercase"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: phase >= 3 ? 1 : 0, y: phase >= 3 ? 0 : 8 }}
              transition={{ duration: 0.45 }}
            >
              India Without Waiting
            </motion.p>
          </div>

          {skipEnabled && (
            <button type="button" onClick={skip} className="absolute right-4 top-4 rounded-full border border-white/20 px-4 py-1 text-xs text-white/80 backdrop-blur">
              Skip
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
