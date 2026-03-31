import React, { useEffect } from 'react';

export interface BusinessInfo {
  designTheme?: string;
  colorPrimary?: string;
  [key: string]: any;
}

export interface ThemeProviderProps {
  businessInfo?: BusinessInfo | null;
  children: React.ReactNode;
}

export default function ThemeProvider({ businessInfo, children }: ThemeProviderProps) {
  useEffect(() => {
    const root = document.documentElement;

    // Apply theme
    if (businessInfo?.designTheme) {
      root.setAttribute('data-theme', businessInfo.designTheme.replace('theme-', ''));
    } else {
      // Default fallback
      root.setAttribute('data-theme', 'retail');
    }

    // Apply optional primary color override
    if (businessInfo?.colorPrimary) {
      root.style.setProperty('--color-primary-override', businessInfo.colorPrimary);
    }

    // Cleanup on unmount
    return () => {
      root.removeAttribute('data-theme');
      root.style.removeProperty('--color-primary-override');
    };
  }, [businessInfo]);

  return <>{children}</>;
}
