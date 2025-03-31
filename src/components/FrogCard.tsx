import React from 'react';
import { motion } from 'framer-motion';
import type { Frog } from '../utils/supabase';

interface FrogCardProps {
  frog: Frog;
  onClick: () => void;
  isSelected?: boolean;
}

export default function FrogCard({ frog, onClick, isSelected = false }: FrogCardProps) {
  return (
    <motion.div
      className={`frog-card p-4 ${isSelected ? 'border-2 border-lily-green' : 'border border-gray-200'}`}
      whileHover={{ y: -5 }}
      onClick={onClick}
    >
      <div className="flex items-center space-x-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-pond-light">
          {frog.image_url ? (
            <img
              src={frog.image_url}
              alt={`${frog.name} frog`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-lily-green text-white text-xl font-bold">
              {frog.name.charAt(0)}
            </div>
          )}
          <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-white p-0.5">
            <img
              src={frog.logo_url}
              alt={`${frog.name} logo`}
              className="w-full h-full object-contain rounded-full"
            />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium text-pond-dark truncate">{frog.name}</h3>
          <p className="text-sm text-gray-500 truncate">
            {frog.tags.slice(0, 3).join(', ')}
            {frog.tags.length > 3 && '...'}
          </p>
        </div>
      </div>
      
      <p className="mt-2 text-sm text-gray-600 line-clamp-2">{frog.bio}</p>
      
      {isSelected && (
        <div className="mt-2 text-lily-green text-sm font-medium">Selected</div>
      )}
    </motion.div>
  );
}
