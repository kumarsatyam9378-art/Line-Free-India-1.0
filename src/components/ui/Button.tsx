import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Spinner } from './Spinner';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'icon';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-primary-dark)] text-white border-none shadow-[0_4px_20px_rgba(108,99,255,0.5)] hover:shadow-[0_8px_30px_rgba(108,99,255,0.6)]',
  secondary: 'bg-transparent border border-[var(--color-primary)] text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10',
  ghost: 'bg-transparent border-none text-[var(--color-primary)] hover:bg-[var(--color-primary)]/10',
  danger: 'bg-[var(--color-danger)] text-white border-none shadow-[0_4px_20px_rgba(255,68,68,0.4)] hover:shadow-[0_8px_30px_rgba(255,68,68,0.5)]',
  success: 'bg-[var(--color-success)] text-white border-none shadow-[0_4px_20px_rgba(0,200,81,0.4)] hover:shadow-[0_8px_30px_rgba(0,200,81,0.5)]',
  icon: 'p-2 bg-transparent text-[var(--color-text)] hover:bg-white/10 rounded-full flex items-center justify-center',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-8 py-3.5 text-lg',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled,
      fullWidth = false,
      leftIcon,
      rightIcon,
      children,
      ...props
    },
    ref
  ) => {
    const isIconVariant = variant === 'icon';

    const baseClasses = twMerge(
      clsx(
        'inline-flex items-center justify-center gap-2 font-semibold transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed',
        !isIconVariant && 'rounded-[var(--border-radius-md,12px)]',
        fullWidth && 'w-full',
        variantStyles[variant],
        !isIconVariant && sizeStyles[size],
        className
      )
    );

    return (
      <motion.button
        ref={ref}
        className={baseClasses}
        disabled={disabled || loading}
        whileTap={{ scale: disabled || loading ? 1 : 0.95 }}
        {...props}
      >
        {loading ? (
          <Spinner size="sm" className={variant === 'secondary' || variant === 'ghost' ? 'text-[var(--color-primary)]' : 'text-white'} />
        ) : (
          <>
            {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
          </>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
