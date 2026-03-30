import React, { useState } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface Tab {
  id: string;
  label: string;
  content?: React.ReactNode;
}

export interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  activeTab?: string;
  onChange?: (id: string) => void;
  className?: string;
  fullWidth?: boolean;
}

export const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  activeTab: controlledActiveTab,
  onChange,
  className,
  fullWidth = true,
}) => {
  const [internalActiveTab, setInternalActiveTab] = useState(defaultTab || tabs[0]?.id);
  const isControlled = controlledActiveTab !== undefined;
  const activeTabId = isControlled ? controlledActiveTab : internalActiveTab;

  const handleTabClick = (id: string) => {
    if (!isControlled) {
      setInternalActiveTab(id);
    }
    onChange?.(id);
  };

  return (
    <div className={twMerge(clsx('flex flex-col', className))}>
      <div className={clsx('flex border-b border-[var(--color-border)] mb-4', fullWidth && 'w-full')}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab.id)}
            className={clsx(
              'relative py-3 px-4 text-sm font-medium transition-colors focus:outline-none',
              fullWidth && 'flex-1 text-center',
              activeTabId === tab.id
                ? 'text-[var(--color-primary)]'
                : 'text-[var(--color-text-dim)] hover:text-[var(--color-text)]'
            )}
          >
            {tab.label}
            {activeTabId === tab.id && (
              <motion.div
                layoutId="activeTabIndicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-primary)] rounded-t-md"
                initial={false}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
      <div className="flex-1">
        {tabs.find((t) => t.id === activeTabId)?.content}
      </div>
    </div>
  );
};
