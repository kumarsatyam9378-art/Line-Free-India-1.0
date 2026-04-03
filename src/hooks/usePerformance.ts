import { useState, useEffect } from 'react';

export function usePerformance() {
  const [config, setConfig] = useState({
    particleCount: 150,
    enableComplexEffects: true,
  });

  useEffect(() => {
    // Basic performance detection logic could go here
    // For now, return the high-end defaults
    setConfig({
      particleCount: 150,
      enableComplexEffects: true,
    });
  }, []);

  return config;
}