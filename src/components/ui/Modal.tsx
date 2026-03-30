import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export type ModalSize = 'sm' | 'md' | 'lg' | 'full';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: ModalSize;
  hasHandle?: boolean;
  className?: string;
}

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-h-[50vh]',
  md: 'max-h-[70vh]',
  lg: 'max-h-[90vh]',
  full: 'h-[100vh]',
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  hasHandle = true,
  className,
}) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />

          {/* Bottom Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            drag="y"
            dragConstraints={{ top: 0 }}
            dragElastic={0.2}
            onDragEnd={(e, info) => {
              if (info.offset.y > 100 || info.velocity.y > 500) {
                onClose();
              }
            }}
            className={twMerge(
              clsx(
                'fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto z-50',
                'bg-[var(--color-bg)] rounded-t-[24px] shadow-2xl overflow-hidden',
                'flex flex-col',
                sizeClasses[size],
                className
              )
            )}
            style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
          >
            {hasHandle && (
              <div className="w-full flex justify-center py-3 cursor-grab active:cursor-grabbing">
                <div className="w-12 h-[3px] rounded-full bg-[var(--color-text)] opacity-40" />
              </div>
            )}

            {title && (
              <div className="px-6 pb-4 pt-2">
                <h2 className="text-xl font-bold text-[var(--color-text)]">
                  {title}
                </h2>
              </div>
            )}

            <div className="px-6 pb-6 overflow-y-auto overscroll-contain flex-1">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
