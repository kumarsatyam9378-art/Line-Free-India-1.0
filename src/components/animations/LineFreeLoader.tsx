'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { ParticleCanvas } from './ParticleCanvas';
import { QueueVisualization } from './QueueVisualization';
import { TransformationWave } from './TransformationWave';
import { LogoReveal } from './LogoReveal';
import { TaglineReveal } from './TaglineReveal';
import { SkipButton } from './SkipButton';
import { useAnimationPhase, AnimationPhase } from '@/hooks/useAnimationPhase';
import { usePerformance } from '@/hooks/usePerformance';
import { useSoundEngine } from '@/hooks/useSoundEngine';
import { cn } from '@/lib/utils';

interface LoaderConfig {
  duration?: number;
  skipEnabled?: boolean;
  showOnlyOnce?: boolean;
  soundEnabled?: boolean;
  onPhaseChange?: (phase: AnimationPhase) => void;
}

interface LineFreeLoaderProps {
  onComplete: () => void;
  config?: LoaderConfig;
  className?: string;
}

const STORAGE_KEY = 'linefree_animation_shown';

export function LineFreeLoader({
  onComplete,
  config = {},
  className,
}: LineFreeLoaderProps) {
  const {
    duration = 10000,
    skipEnabled = true,
    showOnlyOnce = true,
    soundEnabled = true,
    onPhaseChange,
  } = config;

  // Hooks
  const prefersReducedMotion = useReducedMotion();
  const performanceConfig = usePerformance();
  const { play: playSound, toggle: toggleSound, isEnabled: isSoundEnabled } = useSoundEngine(soundEnabled);
  const playSoundRef = useRef(playSound);
  const isSoundEnabledRef = useRef(isSoundEnabled);

  useEffect(() => {
     playSoundRef.current = playSound;
     isSoundEnabledRef.current = isSoundEnabled;
  }, [playSound, isSoundEnabled]);

  // State
  const [isExiting, setIsExiting] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const hasCheckedStorage = useRef(false);

  // Check if animation was already shown
  useEffect(() => {
    if (hasCheckedStorage.current) return;
    hasCheckedStorage.current = true;

    if (showOnlyOnce && typeof window !== 'undefined') {
      try {
        const hasShown = sessionStorage.getItem(STORAGE_KEY);
        if (hasShown === 'true') {
          // Temporarily disable showOnlyOnce logic for testing if needed
          // onComplete();
          // return;
        }
      } catch (e) {
        // Storage not available
      }
    }
  }, [showOnlyOnce, onComplete]);

  // Animation phase management
  // Handle sound for each phase
  const onPhaseChangeRef = useRef(onPhaseChange);
  useEffect(() => {
     onPhaseChangeRef.current = onPhaseChange;
  }, [onPhaseChange]);

  const handlePhaseChange = useCallback((phase: AnimationPhase) => {
    if (onPhaseChangeRef.current) {
       onPhaseChangeRef.current(phase);
    }

    // Play sounds
    if (isSoundEnabledRef.current) {
      switch (phase) {
        case 'chaos':
          playSoundRef.current('chaos');
          break;
        case 'transformation':
          playSoundRef.current('whoosh');
          break;
        case 'logoReveal':
          playSoundRef.current('reveal');
          break;
        case 'tagline':
          playSoundRef.current('success');
          break;
      }
    }
  }, []);

  const {
    currentPhase,
    progress,
    isComplete,
    skip: skipAnimation,
  } = useAnimationPhase({
    duration,
    enabled: !prefersReducedMotion,
    onPhaseChange: handlePhaseChange
  });


  const isCompletingRef = useRef(false);

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const handleComplete = useCallback(() => {
    if (isCompletingRef.current) return;
    isCompletingRef.current = true;

    setIsExiting(true);

    // Mark as shown
    if (showOnlyOnce && typeof window !== 'undefined') {
      try {
        sessionStorage.setItem(STORAGE_KEY, 'true');
      } catch (e) {
        // Storage not available
      }
    }

    // Delay to allow exit animation
    setTimeout(() => {
      if (onCompleteRef.current) {
        onCompleteRef.current();
      }
    }, 800);
  }, [showOnlyOnce]);

  // Handle completion
  useEffect(() => {
    if (isComplete && !isExiting) {
       handleComplete();
    }
  }, [isComplete, isExiting, handleComplete]);

  const handleSkip = useCallback(() => {
    skipAnimation();
    handleComplete();
  }, [skipAnimation, handleComplete]);

  const handleToggleSound = useCallback(() => {
    const newState = toggleSound();
    setSoundOn(newState);
  }, [toggleSound]);

  // Keyboard shortcut for skip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && skipEnabled) {
        handleSkip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [skipEnabled, handleSkip]);

  // If reduced motion, show simplified version
  if (prefersReducedMotion) {
    return (
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={cn(
          'fixed inset-0 z-[9999] flex items-center justify-center bg-bg',
          className
        )}
      >
        <div className="text-center">
          <h1 className="font-display text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            LINE FREE INDIA
          </h1>
          <p className="text-xl text-white/70">India Without Waiting</p>
        </div>

        {skipEnabled && (
          <button
            onClick={handleSkip}
            className="absolute bottom-8 right-8 px-4 py-2 bg-white/5 rounded-full text-sm text-white"
          >
            Continue
          </button>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, filter: 'blur(8px)' }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'fixed inset-0 z-[9999] flex items-center justify-center flex-col bg-bg overflow-hidden',
        isExiting && 'pointer-events-none',
        className
      )}
      role="dialog"
      aria-label="Loading animation"
      aria-live="polite"
    >
      {/* Particle Background */}
      <ParticleCanvas
        phase={currentPhase}
        particleCount={performanceConfig.particleCount}
        showConnections={performanceConfig.enableComplexEffects}
        className="absolute inset-0"
      />

      {/* Ambient Glow Effects */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vmax] h-[60vmax] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(0,212,255,0.5)_0%,_transparent_70%)] blur-3xl opacity-40" style={{animation: 'ambientPulse 4s ease-in-out infinite'}} />
        <div className="absolute top-[60%] left-[60%] -translate-x-1/2 -translate-y-1/2 w-[40vmax] h-[40vmax] rounded-full bg-[radial-gradient(ellipse_at_center,_rgba(123,47,255,0.5)_0%,_transparent_70%)] blur-3xl opacity-40" style={{ animation: 'ambientPulse 4s ease-in-out infinite', animationDelay: '1s' }} />
      </motion.div>

      {/* Queue Visualization (Chaos Phase) */}
      <AnimatePresence>
        {(currentPhase === 'chaos' || currentPhase === 'transformation') && (
          <QueueVisualization
            phase={currentPhase}
            className="absolute inset-0"
          />
        )}
      </AnimatePresence>

      {/* Transformation Wave */}
      <AnimatePresence>
        {currentPhase === 'transformation' && (
          <TransformationWave className="absolute inset-0" />
        )}
      </AnimatePresence>

      {/* Logo Reveal */}
      <AnimatePresence>
        {(currentPhase === 'logoReveal' || currentPhase === 'tagline' || currentPhase === 'complete') && (
          <LogoReveal isActive={true} />
        )}
      </AnimatePresence>

      {/* Tagline */}
      <AnimatePresence>
        {(currentPhase === 'tagline' || currentPhase === 'complete') && (
          <TaglineReveal
            words={['India', 'Without', 'Waiting']}
            className="absolute bottom-[25%]"
          />
        )}
      </AnimatePresence>

      {/* Progress Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 z-10"
      >
        {/* Progress Bar */}
        <div className="w-[clamp(200px,30vw,300px)] h-0.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
            style={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>

        {/* Phase Indicators */}
        <div className="flex gap-3">
          {['init', 'chaos', 'transformation', 'logoReveal'].map((phase) => {
            const phases: AnimationPhase[] = ['init', 'chaos', 'transformation', 'logoReveal', 'tagline', 'complete'];
            const currentIndex = phases.indexOf(currentPhase);
            const phaseIndex = phases.indexOf(phase as AnimationPhase);

            const isActive = phaseIndex === currentIndex;
            const isCompleted = phaseIndex < currentIndex;

            return (
              <motion.span
                key={phase}
                className={cn(
                  'w-2 h-2 rounded-full transition-all duration-300',
                  isActive && 'bg-primary scale-125 shadow-[0_0_20px_rgba(0,212,255,0.5)]',
                  isCompleted && 'bg-green-400',
                  !isActive && !isCompleted && 'bg-white/20'
                )}
              />
            );
          })}
        </div>
      </motion.div>

      {/* Skip Button */}
      {skipEnabled && (
        <SkipButton
          onSkip={handleSkip}
          className="absolute bottom-8 right-8"
        />
      )}

      {/* Sound Toggle */}
      <motion.button
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        onClick={handleToggleSound}
        className="absolute top-8 right-8 w-11 h-11 flex items-center justify-center bg-white/5 border border-white/10 rounded-full text-white/70 hover:bg-white/10 hover:border-white/30 transition-colors z-20 backdrop-blur-md"
        aria-label="Toggle sound"
        aria-pressed={soundOn}
      >
        {soundOn ? (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
        ) : (
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        )}
      </motion.button>
    </motion.div>
  );
}