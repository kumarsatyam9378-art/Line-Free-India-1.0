import React, { useEffect } from 'react';

export interface BusinessInfo {
  designTheme?: string;
  colorPrimary?: string;
  [key: string]: any;
}

interface ThemeProviderProps {
  businessInfo?: BusinessInfo;
  children: React.ReactNode;
}

export function ThemeProvider({ businessInfo, children }: ThemeProviderProps) {
  useEffect(() => {
    const root = document.documentElement;

    // Apply theme
    if (businessInfo?.designTheme) {
      root.setAttribute('data-theme', businessInfo.designTheme.toLowerCase());
    } else {
      // Default fallback
      root.removeAttribute('data-theme');
    }

    // Apply optional primary color override
    if (businessInfo?.colorPrimary) {
      root.style.setProperty('--color-primary', businessInfo.colorPrimary);
    }

    // Cleanup on unmount
    return () => {
      root.removeAttribute('data-theme');
      root.style.removeProperty('--color-primary');
    };
  }, [businessInfo?.designTheme, businessInfo?.colorPrimary]);

  return <>{children}</>;
}
