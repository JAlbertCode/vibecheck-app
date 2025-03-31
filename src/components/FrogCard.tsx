import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import type { Frog } from '../utils/supabase';
import { getDefaultImage } from '../utils/defaultImages';

interface FrogCardProps {
  frog: Frog;
  onClick: () => void;
  isSelected?: boolean;
}

export default function FrogCard({ frog, onClick, isSelected = false }: FrogCardProps) {
  // Generate default images on first render
  const [logoImage, setLogoImage] = useState<string>(frog.logo_url || '');
  
  // Initialize default images immediately
  useEffect(() => {
    if (!frog.logo_url || frog.logo_url.includes('placeholder.com')) {
      // Run in next tick to ensure client-side execution
      const img = getDefaultImage(frog.name);
      setLogoImage(img);
    } else {
      setLogoImage(frog.logo_url);
    }
  }, [frog.name, frog.logo_url]);
  return (
    <motion.div
      className={`frog-card p-4 rounded-lg shadow-sm transition-all duration-200 ${isSelected ? 'border-2 border-lily-green bg-green-50' : 'border border-gray-200 hover:border-lily-green hover:shadow-md'}`}
      whileHover={{ y: -5 }}
      onClick={onClick}
    >
      <div className="flex items-center space-x-4">
        <div className="relative w-16 h-16 rounded-full overflow-hidden bg-pond-light flex-shrink-0">
          {frog.image_url ? (
            <div className="w-full h-full bg-pond-light">
              <img
                src={frog.image_url}
                alt={`${frog.name} frog`}
                className="w-full h-full object-cover rounded-full"
                style={{ objectPosition: 'center' }}
              />
            </div>
          ) : (
            <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-lily-green to-blue-400 text-white text-xl font-bold overflow-hidden">
              {/* Use emoji based on first letter of name */}
              <span className="text-3xl">
                {["🐸", "🦋", "🪷", "🌿", "✨", "🌊", "🧩", "🎮", "🚀", "🔮", "🧠", "🎨", "🔧", "🌱", "🧪", "💫", "🪄", "🧬", "🪴", "🐙", "🦄", "🦎", "🐝", "🐬", "🐢", "🦚"][frog.name.charCodeAt(0) % 26]}
              </span>
            </div>
          )}
          <div className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-white p-0.5 border border-white shadow-sm">
            <img
              src={logoImage}
              alt={`${frog.name} logo`}
              className="w-full h-full object-contain rounded-full"
              onError={() => {
                // If image fails to load, use default
                setLogoImage(getDefaultImage(frog.name));
              }}
            />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-medium text-pond-dark truncate">{frog.name}</h3>
          <div className="flex flex-wrap gap-1 mt-1">
            {frog.tags.map((tag, index) => (
              <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
      
      <p className="mt-2 text-sm text-gray-600 line-clamp-2">{frog.bio}</p>
      
      <div className="mt-2 text-sm font-medium flex items-center justify-between">
        {isSelected ? (
          <span className="text-lily-green flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
            Selected
          </span>
        ) : (
          <span className="text-gray-400 text-xs">Click to select</span>
        )}
        <button 
          onClick={(e) => {
            e.stopPropagation();
            window.dispatchEvent(new CustomEvent('view-frog-details', { detail: frog }));
          }}
          className="text-xs py-1 px-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded transition-colors"
        >
          View Details
        </button>
      </div>
    </motion.div>
  );
}
