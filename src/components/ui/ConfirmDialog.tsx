import React from 'react';
import { Modal } from './Modal';
import { Button } from './Button';
import { FiAlertTriangle, FiInfo, FiCheckCircle } from 'react-icons/fi';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export type ConfirmDialogType = 'danger' | 'warning' | 'info' | 'success';

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  type?: ConfirmDialogType;
  loading?: boolean;
}

const typeConfig: Record<ConfirmDialogType, { icon: React.ReactNode; colorClass: string; buttonVariant: 'danger' | 'primary' | 'success' }> = {
  danger: {
    icon: <FiAlertTriangle className="w-8 h-8 text-[var(--color-danger)]" />,
    colorClass: 'bg-[var(--color-danger)]/10 text-[var(--color-danger)]',
    buttonVariant: 'danger',
  },
  warning: {
    icon: <FiAlertTriangle className="w-8 h-8 text-[var(--color-warning)]" />,
    colorClass: 'bg-[var(--color-warning)]/10 text-[var(--color-warning)]',
    buttonVariant: 'primary',
  },
  info: {
    icon: <FiInfo className="w-8 h-8 text-[var(--color-primary)]" />,
    colorClass: 'bg-[var(--color-primary)]/10 text-[var(--color-primary)]',
    buttonVariant: 'primary',
  },
  success: {
    icon: <FiCheckCircle className="w-8 h-8 text-[var(--color-success)]" />,
    colorClass: 'bg-[var(--color-success)]/10 text-[var(--color-success)]',
    buttonVariant: 'success',
  },
};

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  type = 'warning',
  loading = false,
}) => {
  const config = typeConfig[type];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" hasHandle={false}>
      <div className="flex flex-col items-center text-center px-4 pt-6 pb-2">
        <div
          className={twMerge(
            clsx(
              'w-16 h-16 rounded-full flex items-center justify-center mb-6',
              config.colorClass
            )
          )}
        >
          {config.icon}
        </div>
        <h3 className="text-xl font-bold text-[var(--color-text)] mb-2">{title}</h3>
        <p className="text-[var(--color-text-dim)] mb-8 max-w-sm">{message}</p>

        <div className="flex w-full gap-3 mt-auto">
          <Button
            variant="secondary"
            fullWidth
            onClick={onClose}
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant={config.buttonVariant}
            fullWidth
            onClick={onConfirm}
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
