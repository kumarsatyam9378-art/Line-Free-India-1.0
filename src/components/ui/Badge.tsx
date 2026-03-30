import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export type BadgeVariant = 'primary' | 'success' | 'warning' | 'danger' | 'gold' | 'default';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

const variantStyles: Record<BadgeVariant, string> = {
  primary: 'badge-primary',
  success: 'badge-success',
  warning: 'badge-warning',
  danger: 'badge-danger',
  gold: 'badge-gold',
  default: 'bg-[var(--color-card-2)] text-[var(--color-text)]',
};

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={twMerge(
          clsx('badge', variantStyles[variant], className)
        )}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
