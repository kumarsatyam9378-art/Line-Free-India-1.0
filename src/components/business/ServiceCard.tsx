import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Utility for class merging
function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export interface ServiceItemProps {
  id: string;
  name: string;
  price: number;
  avgTime: number;
}

export interface ServiceCardProps {
  service: ServiceItemProps;
  icon?: string; // emoji from name or default
  isSelected?: boolean;
  onSelect?: (service: ServiceItemProps) => void;
  disabled?: boolean;
  className?: string;
}

export default function ServiceCard({
  service,
  icon = '✨',
  isSelected = false,
  onSelect,
  disabled = false,
  className
}: ServiceCardProps) {

  return (
    <motion.button
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      whileHover={{ scale: disabled ? 1 : 1.01 }}
      onClick={() => !disabled && onSelect?.(service)}
      disabled={disabled}
      className={cn(
        "w-full p-4 rounded-xl border text-left flex items-center gap-4 transition-all duration-200",
        isSelected
          ? "bg-primary/10 border-primary shadow-sm shadow-primary/20"
          : "bg-card border-border hover:border-primary/50",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
    >
      <div className={cn(
        "w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0 transition-colors",
        isSelected ? "bg-primary text-white" : "bg-card-2"
      )}>
        {isSelected ? '✓' : icon}
      </div>

      <div className="flex-1">
        <h4 className="font-semibold text-text text-sm mb-0.5">{service.name}</h4>
        {service.avgTime && (
          <span className="inline-flex items-center gap-1 text-[10px] font-medium text-text-dim bg-card-2 px-1.5 py-0.5 rounded">
            ⏱️ {service.avgTime} min
          </span>
        )}
      </div>

      <div className="text-right">
        <span className="font-bold text-primary text-base">₹{service.price}</span>
      </div>
    </motion.button>
  );
}
