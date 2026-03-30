import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  onSelect?: () => void;
  label: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'outline' | 'filled';
}

const variantStyles = {
  outline: {
    base: 'border border-[var(--color-border)] bg-transparent text-[var(--color-text)]',
    selected: 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary-light)]',
  },
  filled: {
    base: 'bg-[var(--color-card-2)] text-[var(--color-text)] border border-transparent',
    selected: 'bg-[var(--color-primary)] text-white shadow-md',
  },
};

export const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  (
    {
      className,
      selected = false,
      onSelect,
      label,
      leftIcon,
      rightIcon,
      variant = 'outline',
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        type="button"
        whileTap={{ scale: disabled ? 1 : 0.95 }}
        onClick={onSelect}
        disabled={disabled}
        className={twMerge(
          clsx(
            'inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap focus:outline-none',
            disabled && 'opacity-50 cursor-not-allowed',
            selected ? variantStyles[variant].selected : variantStyles[variant].base,
            className
          )
        )}
        {...props}
      >
        {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
        {label}
        {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
      </motion.button>
    );
  }
);

Chip.displayName = 'Chip';
