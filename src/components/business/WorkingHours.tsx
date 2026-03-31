import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for class merging
function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export interface WorkingHoursProps {
  businessHours?: string; // Example: "09:00-18:00"
  isOpen?: boolean;
  className?: string;
}

export default function WorkingHours({ businessHours, isOpen, className }: WorkingHoursProps) {
  if (!businessHours) return null;

  // Assume format is HH:mm-HH:mm
  const parts = businessHours.split('-');
  const displayHours = parts.length === 2
    ? `${parts[0]} to ${parts[1]}`
    : businessHours;

  return (
    <div className={cn("flex items-center gap-2 text-sm text-text-dim", className)}>
      <span className="text-lg">🕒</span>
      <span>{displayHours}</span>
    </div>
  );
}
