export type AnimationPhase = 'init' | 'chaos' | 'transformation' | 'logoReveal' | 'tagline' | 'complete';

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseAnimationPhaseProps {
  duration?: number;
  enabled?: boolean;
  onPhaseChange?: (phase: AnimationPhase) => void;
}

export function useAnimationPhase({
  duration = 10000,
  enabled = true,
  onPhaseChange
}: UseAnimationPhaseProps = {}) {
  const [currentPhase, setCurrentPhase] = useState<AnimationPhase>('init');
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const startTimeRef = useRef<number | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isCompleteRef = useRef(false);

  const timeline = useRef([
    { phase: 'init', start: 0, end: 1000 },
    { phase: 'chaos', start: 1000, end: 3000 },
    { phase: 'transformation', start: 3000, end: 6000 },
    { phase: 'logoReveal', start: 6000, end: 8000 },
    { phase: 'tagline', start: 8000, end: 9500 },
    { phase: 'complete', start: 9500, end: 10000 }
  ] as const).current;

  const onPhaseChangeRef = useRef(onPhaseChange);
  useEffect(() => {
     onPhaseChangeRef.current = onPhaseChange;
  }, [onPhaseChange]);

  const setPhase = useCallback((phase: AnimationPhase) => {
    setCurrentPhase(prev => {
      if (prev !== phase) {
        return phase;
      }
      return prev;
    });
  }, []);

  const tick = useCallback((timestamp: number) => {
    if (!startTimeRef.current) startTimeRef.current = timestamp;
    const elapsed = timestamp - startTimeRef.current;

    // Calculate progress (0 to 1)
    const currentProgress = Math.min(Math.max(elapsed / duration, 0), 1);

    // Using an updater function so setProgress doesn't trigger a new render if unchanged
    setProgress(prev => prev === currentProgress ? prev : currentProgress);

    // Determine current phase
    for (const item of timeline) {
      if (elapsed >= item.start && elapsed < item.end) {
        setPhase(item.phase as AnimationPhase);
        break;
      }
    }

    if (elapsed < duration) {
      animationFrameRef.current = requestAnimationFrame(tick);
    } else {
      if (!isCompleteRef.current) {
         isCompleteRef.current = true;
         setPhase('complete');
         setIsComplete(true);
      }
    }
  }, [duration, timeline, setPhase]);

  useEffect(() => {
    if (!enabled) {
      if (!isCompleteRef.current) {
         isCompleteRef.current = true;
         setPhase('complete');
         setIsComplete(true);
         setProgress(1);
      }
      return;
    }

    animationFrameRef.current = requestAnimationFrame(tick);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [enabled, tick]);

  const skip = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (!isCompleteRef.current) {
       isCompleteRef.current = true;
       setPhase('complete');
       setIsComplete(true);
       setProgress(1);
    }
  }, [setPhase]);

  return { currentPhase, progress, isComplete, skip };
}