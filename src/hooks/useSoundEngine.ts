import { useState, useCallback, useRef, useEffect } from 'react';

export function useSoundEngine(initialEnabled = true) {
  const [isEnabled, setIsEnabled] = useState(initialEnabled);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    if (isEnabled && !audioContextRef.current) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          audioContextRef.current = new AudioContextClass();
        }
      } catch (e) {
        console.warn('AudioContext not supported', e);
      }
    }
  }, [isEnabled]);

  const toggle = useCallback(() => {
    setIsEnabled(prev => !prev);
    return !isEnabled;
  }, [isEnabled]);

  const play = useCallback((soundType: 'chaos' | 'whoosh' | 'reveal' | 'success') => {
    if (!isEnabled || !audioContextRef.current) return;

    // Resume audio context if suspended
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }

    // Simple synth implementations for the sounds instead of loading files
    const ctx = audioContextRef.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    switch (soundType) {
      case 'chaos':
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, now);
        osc.frequency.linearRampToValueAtTime(800, now + 0.5);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.1, now + 0.1);
        gain.gain.linearRampToValueAtTime(0, now + 2);
        osc.start(now);
        osc.stop(now + 2);
        break;
      case 'whoosh':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 1);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.2, now + 0.1);
        gain.gain.linearRampToValueAtTime(0, now + 1);
        osc.start(now);
        osc.stop(now + 1);
        break;
      case 'reveal':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now); // A4
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.2, now + 0.1);
        gain.gain.linearRampToValueAtTime(0, now + 2);

        // Add a harmony
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(554.37, now); // C#5
        gain2.gain.setValueAtTime(0, now);
        gain2.gain.linearRampToValueAtTime(0.15, now + 0.2);
        gain2.gain.linearRampToValueAtTime(0, now + 2);

        osc.start(now);
        osc.stop(now + 2);
        osc2.start(now);
        osc2.stop(now + 2);
        break;
      case 'success':
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(523.25, now); // C5
        osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
        osc.frequency.setValueAtTime(1046.50, now + 0.3); // C6

        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.2, now + 0.1);
        gain.gain.setValueAtTime(0.2, now + 0.4);
        gain.gain.linearRampToValueAtTime(0, now + 1);

        osc.start(now);
        osc.stop(now + 1);
        break;
    }
  }, [isEnabled]);

  return { isEnabled, toggle, play };
}