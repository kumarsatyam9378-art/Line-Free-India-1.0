export type HapticPattern = 'light' | 'medium' | 'success' | 'error' | 'burst' | 'selection';

const PATTERNS: Record<HapticPattern, number | number[]> = {
  light: 12,
  medium: 24,
  success: [18, 40, 18],
  error: [40, 70, 40, 70, 50],
  burst: [12, 30, 12, 30, 12],
  selection: 8,
};

export function triggerHaptic(pattern: HapticPattern = 'light') {
  if (typeof navigator === 'undefined' || !('vibrate' in navigator)) return;
  navigator.vibrate(PATTERNS[pattern]);
}
