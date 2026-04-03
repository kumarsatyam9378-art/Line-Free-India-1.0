import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CinematicIntroProps {
  onDone: () => void;
  durationMs?: number;
  skipEnabled?: boolean;
}

const SESSION_KEY = 'lfi_intro_seen_v2';

function getParticleCount() {
  if (typeof window === 'undefined') return 40;
  const cores = navigator.hardwareConcurrency || 4;
  if (cores <= 2) return 30;
  if (window.innerWidth < 768) return 45;
  return 70;
}

export default function CinematicIntro({ onDone, durationMs = 9000, skipEnabled = true }: CinematicIntroProps) {
  const [phase, setPhase] = useState(0);
  const [hidden, setHidden] = useState(false);
  const particles = useMemo(
    () => Array.from({ length: getParticleCount() }, (_, i) => ({ id: i, x: Math.random() * 100, y: Math.random() * 100, s: Math.random() * 2 + 1 })),
    [],
  );

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (sessionStorage.getItem(SESSION_KEY) === 'true' || reduced) {
      onDone();
      return;
    }

    const t1 = setTimeout(() => setPhase(1), 1000);
    const t2 = setTimeout(() => setPhase(2), 3000);
    const t3 = setTimeout(() => setPhase(3), 6000);
    const t4 = setTimeout(() => setPhase(4), 8000);
    const done = setTimeout(() => {
      sessionStorage.setItem(SESSION_KEY, 'true');
      setHidden(true);
      setTimeout(onDone, 450);
    }, durationMs);

    return () => [t1, t2, t3, t4, done].forEach(clearTimeout);
  }, [durationMs, onDone]);

  const skip = () => {
    sessionStorage.setItem(SESSION_KEY, 'true');
    setHidden(true);
    setTimeout(onDone, 220);
  };

  return (
    <AnimatePresence>
      {!hidden && (
        <motion.div
          className="fixed inset-0 z-[9999] overflow-hidden bg-[#050505]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(8px)' }}
          transition={{ duration: 0.45 }}
          aria-label="Line Free India intro animation"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(0,212,255,0.18),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(123,47,255,0.16),transparent_40%)]" />
          {particles.map((p) => (
            <motion.span
              key={p.id}
              className="absolute rounded-full bg-[#00D4FF]"
              style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.s, height: p.s }}
              animate={{ opacity: [0.15, 0.6, 0.15], y: [0, -18, 0] }}
              transition={{ duration: 3 + (p.id % 5), repeat: Infinity, ease: 'easeInOut' }}
            />
          ))}

          <motion.div className="absolute inset-0" initial={{ opacity: 0.25 }} animate={{ opacity: phase >= 1 ? 0.6 : 0.25 }}>
            {Array.from({ length: 8 }).map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-[1px] bg-gradient-to-r from-transparent via-orange-400 to-transparent"
                style={{ top: `${18 + i * 8}%`, width: '100%' }}
                animate={{ x: phase >= 2 ? ['-15%', '15%', '-15%'] : ['-5%', '5%', '-5%'], opacity: phase >= 2 ? [0.1, 0.8, 0.1] : [0.1, 0.4, 0.1] }}
                transition={{ duration: 2.3, repeat: Infinity, delay: i * 0.08 }}
              />
            ))}
          </motion.div>

          <motion.div
            className="absolute inset-y-0 left-[-30%] w-[35%] bg-gradient-to-r from-transparent via-[#00D4FF]/60 to-transparent blur-2xl"
            animate={{ x: phase >= 2 ? '420%' : '-10%', opacity: phase >= 2 ? [0, 1, 0] : 0 }}
            transition={{ duration: 2.6, ease: [0.22, 1, 0.36, 1] }}
          />

          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <motion.h1
              className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-[#00D4FF] via-white to-[#7B2FFF] bg-clip-text text-transparent"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ opacity: phase >= 3 ? 1 : 0.85, scale: phase >= 3 ? 1 : 0.94 }}
              transition={{ duration: 0.8 }}
            >
              LINE FREE INDIA
            </motion.h1>
            <motion.p
              className="mt-4 text-white/80 text-sm md:text-base tracking-[0.2em] uppercase"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: phase >= 4 ? 1 : 0, y: phase >= 4 ? 0 : 8 }}
              transition={{ duration: 0.6 }}
            >
              India Without Waiting
            </motion.p>
          </div>

          {skipEnabled && (
            <button
              type="button"
              onClick={skip}
              className="absolute right-4 top-4 rounded-full border border-white/20 px-4 py-1 text-xs text-white/80 backdrop-blur"
            >
              Skip
            </button>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
