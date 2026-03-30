import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export type SkeletonVariant = 'text' | 'circle' | 'rect';

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: SkeletonVariant;
  width?: string | number;
  height?: string | number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  className,
  style,
  ...props
}) => {
  const baseClasses = 'shimmer bg-[var(--color-card)] rounded-md';

  const variantClasses = {
    text: 'h-4 w-full rounded-sm',
    circle: 'rounded-full aspect-square',
    rect: 'rounded-xl',
  };

  return (
    <div
      className={twMerge(clsx(baseClasses, variantClasses[variant], className))}
      style={{
        width: width ?? (variant === 'circle' ? '2.5rem' : undefined),
        height: height ?? (variant === 'circle' ? '2.5rem' : undefined),
        ...style,
      }}
      {...props}
    />
  );
};

// Composite Components

export const BusinessCardSkeleton = () => (
  <div className="flex flex-col gap-3 p-4 bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl w-full">
    <Skeleton variant="rect" className="w-full h-32 rounded-xl" />
    <div className="flex justify-between items-start mt-2">
      <div className="flex flex-col gap-2 w-2/3">
        <Skeleton variant="text" className="w-full h-5" />
        <Skeleton variant="text" className="w-3/4 h-4" />
      </div>
      <Skeleton variant="circle" className="w-10 h-10" />
    </div>
    <div className="flex gap-2 mt-2">
      <Skeleton variant="rect" className="w-16 h-6 rounded-full" />
      <Skeleton variant="rect" className="w-16 h-6 rounded-full" />
    </div>
  </div>
);

export const StatCardSkeleton = () => (
  <div className="flex flex-col gap-2 p-4 bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl items-center justify-center">
    <Skeleton variant="circle" className="w-12 h-12 mb-2" />
    <Skeleton variant="text" className="w-1/2 h-6" />
    <Skeleton variant="text" className="w-1/3 h-4" />
  </div>
);

export const BookingCardSkeleton = () => (
  <div className="flex items-center gap-4 p-4 bg-[var(--color-card)] border border-[var(--color-border)] rounded-2xl">
    <Skeleton variant="rect" className="w-16 h-16 rounded-xl shrink-0" />
    <div className="flex flex-col gap-2 flex-1">
      <Skeleton variant="text" className="w-3/4 h-5" />
      <Skeleton variant="text" className="w-1/2 h-4" />
      <Skeleton variant="text" className="w-1/4 h-4 mt-1" />
    </div>
    <Skeleton variant="circle" className="w-8 h-8 shrink-0" />
  </div>
);

export const ProfileSkeleton = () => (
  <div className="flex flex-col items-center gap-4 p-6 bg-[var(--color-card)] rounded-2xl">
    <Skeleton variant="circle" className="w-24 h-24" />
    <div className="flex flex-col items-center gap-2 w-full">
      <Skeleton variant="text" className="w-1/2 h-6" />
      <Skeleton variant="text" className="w-1/3 h-4" />
    </div>
    <div className="w-full mt-4 flex flex-col gap-3">
      <Skeleton variant="rect" className="w-full h-12 rounded-xl" />
      <Skeleton variant="rect" className="w-full h-12 rounded-xl" />
      <Skeleton variant="rect" className="w-full h-12 rounded-xl" />
    </div>
  </div>
);
