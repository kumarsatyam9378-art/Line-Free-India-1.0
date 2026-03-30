import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'warning' | 'danger';
}

const sizeClasses = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-4',
};

const colorClasses = {
  primary: 'bg-[var(--color-primary)]',
  success: 'bg-[var(--color-success)]',
  warning: 'bg-[var(--color-warning)]',
  danger: 'bg-[var(--color-danger)]',
};

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      value,
      max = 100,
      showLabel = false,
      size = 'md',
      color = 'primary',
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

    return (
      <div className={twMerge(clsx('w-full flex flex-col gap-1.5', className))} {...props} ref={ref}>
        {showLabel && (
          <div className="flex justify-between items-center text-xs text-[var(--color-text-dim)] font-medium px-0.5">
            <span>{Math.round(percentage)}%</span>
            <span>{max}</span>
          </div>
        )}
        <div className={clsx('w-full bg-[var(--color-card-2)] rounded-full overflow-hidden', sizeClasses[size])}>
          <div
            className={clsx('h-full transition-all duration-500 ease-out rounded-full', colorClasses[color])}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  }
);

Progress.displayName = 'Progress';
