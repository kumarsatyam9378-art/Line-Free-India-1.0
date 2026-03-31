import React from 'react';
import { motion } from 'framer-motion';

export interface LocationMapProps {
  address: string;
  lat?: number;
  lng?: number;
  className?: string;
  onCopy?: () => void;
  onDirections?: () => void;
}

export default function LocationMap({ address, lat, lng, className, onCopy, onDirections }: LocationMapProps) {
  // A static map image could be used here (e.g. Mapbox/Google static API)
  // We use a CSS gradient as a placeholder for the map
  return (
    <div className={`w-full ${className}`}>
      <h3 className="text-xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)' }}>Location</h3>
      <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">

        {/* Placeholder Map Area */}
        <div className="h-32 bg-card-2 relative flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-card-2 to-card-2 opacity-50"></div>

          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="text-4xl drop-shadow-md z-10"
          >
            📍
          </motion.div>
        </div>

        {/* Address Info */}
        <div className="p-4 flex items-start gap-4">
          <p className="flex-1 text-sm text-text-dim leading-relaxed">
            {address}
          </p>

          <div className="flex gap-2">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onCopy}
              className="w-10 h-10 rounded-full bg-card-2 border border-border flex items-center justify-center text-text hover:text-primary transition-colors"
              title="Copy Address"
            >
              📋
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onDirections}
              className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
              title="Get Directions"
            >
              🗺️
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
