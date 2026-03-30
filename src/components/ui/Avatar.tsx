import React from 'react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export type AvatarSize = 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: AvatarSize;
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-12 h-12 text-sm',
  lg: 'w-16 h-16 text-lg',
  xl: 'w-24 h-24 text-2xl',
};

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, src, alt = 'Avatar', fallback, size = 'md', ...props }, ref) => {
    const baseClasses = twMerge(
      clsx(
        'relative flex items-center justify-center shrink-0 rounded-full overflow-hidden bg-[var(--color-card-2)] text-[var(--color-text)] font-semibold uppercase',
        sizeClasses[size],
        className
      )
    );

    return (
      <div ref={ref} className={baseClasses} {...props}>
        {src ? (
          <img
            src={src}
            alt={alt}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              // Ideally fallback to initials, simple implementation here
            }}
          />
        ) : (
          <span>{fallback || alt.charAt(0)}</span>
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';
