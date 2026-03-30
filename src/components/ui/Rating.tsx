import React from 'react';
import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface RatingProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onChange?: (value: number) => void;
}

const sizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-xl',
};

export const Rating = React.forwardRef<HTMLDivElement, RatingProps>(
  (
    { className, value, max = 5, readOnly = true, size = 'md', onChange, ...props },
    ref
  ) => {
    const stars = Array.from({ length: max }, (_, index) => {
      const starValue = index + 1;

      const isHalf = value > index && value < starValue;
      const isFull = value >= starValue;

      return (
        <span
          key={index}
          className={clsx(
            'inline-block',
            !readOnly && 'cursor-pointer transition-transform hover:scale-110'
          )}
          onClick={() => {
            if (!readOnly && onChange) {
              onChange(starValue);
            }
          }}
        >
          {isFull ? (
            <FaStar className="star filled text-[var(--color-gold)]" />
          ) : isHalf ? (
            <FaStarHalfAlt className="star half text-[var(--color-gold)]" />
          ) : (
            <FaRegStar className="star text-[var(--color-border)]" />
          )}
        </span>
      );
    });

    return (
      <div
        ref={ref}
        className={twMerge(
          clsx('flex items-center gap-1', sizeClasses[size], className)
        )}
        {...props}
      >
        {stars}
      </div>
    );
  }
);

Rating.displayName = 'Rating';
