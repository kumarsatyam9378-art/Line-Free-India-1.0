import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ServiceItem } from '../../store/AppContext';
import ServiceCard from './ServiceCard';

export interface ServiceListProps {
  services: ServiceItem[];
  title?: string;
  selectedIds?: string[];
  onToggleService?: (service: ServiceItem) => void;
  disabled?: boolean;
}

export default function ServiceList({
  services,
  title = "Services",
  selectedIds = [],
  onToggleService,
  disabled = false
}: ServiceListProps) {
  const [showAll, setShowAll] = useState(false);
  const maxVisible = 6;
  const hasMore = services.length > maxVisible;
  const displayedServices = showAll ? services : services.slice(0, maxVisible);

  // Simple emoji extraction/fallback from name
  const getIcon = (name: string) => {
    const emojis = {
      hair: '✂️', beard: '🧔', facial: '💆', massage: '💆‍♂️',
      consult: '👨‍⚕️', test: '🩸',
      wash: '👕', iron: '♨️',
      photo: '📷', event: '🎪',
      repair: '🔧', checkup: '🩺',
      food: '🍽️', table: '🪑',
      workout: '🏋️', zumba: '💃'
    };
    const lowerName = name.toLowerCase();
    for (const [key, emoji] of Object.entries(emojis)) {
      if (lowerName.includes(key)) return emoji;
    }
    return '✨';
  };

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)' }}>{title}</h3>
        <span className="text-sm text-text-dim">{services.length} items</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <AnimatePresence>
          {displayedServices.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
            >
              <ServiceCard
                service={service}
                icon={getIcon(service.name)}
                isSelected={selectedIds.includes(service.id)}
                onSelect={(s) => onToggleService?.(s)}
                disabled={disabled}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {hasMore && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-4 py-3 rounded-xl border border-dashed border-primary/50 text-primary font-medium text-sm transition-colors hover:bg-primary/5"
        >
          {showAll ? 'Show Less' : `View All ${services.length} ${title}`}
        </motion.button>
      )}
    </div>
  );
}
