import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Button } from './Button';

export type EmptyStateType =
  | 'no_bookings'
  | 'no_results'
  | 'no_businesses'
  | 'offline'
  | 'first_time'
  | 'no_reviews'
  | 'no_staff'
  | 'no_menu'
  | 'no_photos';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  type: EmptyStateType;
  title?: string;
  subtitle?: string;
  onAction?: () => void;
  actionLabel?: string;
}

const emptyStateConfig: Record<EmptyStateType, { emoji: string; title: string; subtitle: string }> = {
  no_bookings: {
    emoji: '📅',
    title: 'No Bookings Yet',
    subtitle: "You don't have any upcoming appointments. Time to treat yourself!",
  },
  no_results: {
    emoji: '🔍',
    title: 'No Results Found',
    subtitle: "We couldn't find what you were looking for. Try adjusting your search.",
  },
  no_businesses: {
    emoji: '🏪',
    title: 'No Businesses Here',
    subtitle: "There are no businesses listed in this category yet. Check back later!",
  },
  offline: {
    emoji: '📶',
    title: 'You Are Offline',
    subtitle: "It seems you've lost connection. Please check your network and try again.",
  },
  first_time: {
    emoji: '👋',
    title: 'Welcome to Line Free',
    subtitle: "Let's get started by exploring top businesses around you.",
  },
  no_reviews: {
    emoji: '⭐',
    title: 'No Reviews Yet',
    subtitle: "Be the first to leave a review and help others make a choice!",
  },
  no_staff: {
    emoji: '👥',
    title: 'No Staff Added',
    subtitle: "There are no staff members listed here yet.",
  },
  no_menu: {
    emoji: '📋',
    title: 'No Menu Available',
    subtitle: "This business hasn't added their services or products yet.",
  },
  no_photos: {
    emoji: '📷',
    title: 'No Photos',
    subtitle: "There are no photos to display for this business right now.",
  },
};

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    {
      className,
      type,
      title,
      subtitle,
      onAction,
      actionLabel,
      ...props
    },
    ref
  ) => {
    const config = emptyStateConfig[type];

    return (
      <div
        ref={ref}
        className={twMerge(
          clsx('flex flex-col items-center justify-center text-center p-8 w-full max-w-md mx-auto', className)
        )}
        {...props}
      >
        <motion.div
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="text-[80px] leading-none mb-6 drop-shadow-lg"
        >
          {config.emoji}
        </motion.div>

        <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">
          {title || config.title}
        </h3>

        <p className="text-[var(--color-text-dim)] mb-8 max-w-[280px]">
          {subtitle || config.subtitle}
        </p>

        {onAction && actionLabel && (
          <Button variant="primary" onClick={onAction} fullWidth>
            {actionLabel}
          </Button>
        )}
      </div>
    );
  }
);

EmptyState.displayName = 'EmptyState';
