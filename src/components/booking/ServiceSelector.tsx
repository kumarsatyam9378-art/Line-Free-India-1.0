import { useState } from 'react';
import { ServiceItem } from '../../store/AppContext';
import { motion } from 'framer-motion';

interface ServiceSelectorProps {
  services: ServiceItem[];
  selectedServices: ServiceItem[];
  onSelect: (services: ServiceItem[]) => void;
  onNext: () => void;
}

export default function ServiceSelector({ services, selectedServices, onSelect, onNext }: ServiceSelectorProps) {
  const toggleService = (service: ServiceItem) => {
    const isSelected = selectedServices.find(s => s.id === service.id);
    if (isSelected) {
      onSelect(selectedServices.filter(s => s.id !== service.id));
    } else {
      onSelect([...selectedServices, service]);
    }
  };

  const totalAmount = selectedServices.reduce((sum, s) => sum + s.price, 0);
  const totalDuration = selectedServices.reduce((sum, s) => sum + s.avgTime, 0);

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex-1 overflow-y-auto pb-32 px-4 space-y-4 pt-4">
        {services.length === 0 ? (
          <div className="text-center text-text-dim py-8">
            <p>No services available.</p>
          </div>
        ) : (
          services.map(service => {
            const isSelected = selectedServices.some(s => s.id === service.id);
            return (
              <motion.div
                whileTap={{ scale: 0.98 }}
                key={service.id}
                onClick={() => toggleService(service)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${
                  isSelected
                    ? 'bg-primary/10 border-primary'
                    : 'bg-card border-border hover:border-primary/50'
                }`}
              >
                {service.photoUrl ? (
                  <img src={service.photoUrl} alt={service.name} className="w-16 h-16 object-cover rounded-xl" />
                ) : (
                  <div className="w-16 h-16 bg-card-2 rounded-xl flex items-center justify-center text-2xl">
                    ✂️
                  </div>
                )}

                <div className="flex-1">
                  <h3 className="font-bold">{service.name}</h3>
                  {service.description && (
                    <p className="text-text-dim text-xs line-clamp-1 mt-0.5">{service.description}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2 text-xs">
                    <span className="font-semibold text-primary">₹{service.price}</span>
                    <span className="text-text-dim flex items-center gap-1">⏱ {service.avgTime} min</span>
                  </div>
                </div>

                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  isSelected ? 'border-primary bg-primary text-white' : 'border-border'
                }`}>
                  {isSelected && <span className="text-xs">✓</span>}
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      <div className="absolute bottom-0 left-0 w-full p-4 bg-background/80 backdrop-blur-md border-t border-border shadow-[0_-10px_20px_rgba(0,0,0,0.1)]">
        <div className="flex justify-between items-center mb-4 px-2">
          <div>
            <p className="text-text-dim text-xs uppercase tracking-wider font-bold">Total Amount</p>
            <p className="text-2xl font-black gradient-text">₹{totalAmount}</p>
          </div>
          <div className="text-right">
            <p className="text-text-dim text-xs uppercase tracking-wider font-bold">Duration</p>
            <p className="font-bold text-lg">{totalDuration} min</p>
          </div>
        </div>
        <button
          onClick={onNext}
          disabled={selectedServices.length === 0}
          className={`w-full py-4 rounded-xl font-bold text-center transition-all ${
            selectedServices.length > 0
              ? 'bg-gradient-to-r from-primary to-accent text-white active:scale-95 shadow-lg shadow-primary/25 hover:shadow-primary/40'
              : 'bg-card-2 text-text-dim opacity-50 cursor-not-allowed border border-border'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
