import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  variant?: 'default' | 'premium' | 'glass';
}

const variantStyles = {
  default: 'bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl shadow-sm',
  premium: 'premium-card',
  glass: 'glass-card rounded-2xl',
};

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={twMerge(
          clsx('overflow-hidden', variantStyles[variant], className)
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
