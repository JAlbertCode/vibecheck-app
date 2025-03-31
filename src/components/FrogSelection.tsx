import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Frog } from '../utils/supabase';

interface FrogSelectionProps {
  frogs: Frog[];
  onSelectFrog: (frog: Frog) => void;
  onCreateNew: () => void;
}

export default function FrogSelection({ frogs, onSelectFrog, onCreateNew }: FrogSelectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter frogs based on search
  const filteredFrogs = frogs.filter(frog => 
    searchQuery === '' || 
    frog.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    frog.bio.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-pond-dark">Select your community</h2>
        <p className="text-gray-500 mt-1">Choose your community or create a new one</p>
      </div>
      
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search for your community..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-lily-green focus:border-transparent pl-10"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            🔍
          </span>
        </div>
        
        <motion.button
          onClick={onCreateNew}
          className="px-4 py-2 bg-lily-green text-white font-medium rounded-full shadow hover:bg-opacity-90 focus:outline-none flex items-center"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="mr-1">➕</span>
          <span>New Frog</span>
        </motion.button>
      </div>
      
      {/* Frogs grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {filteredFrogs.map(frog => (
          <motion.div
            key={frog.id}
            className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md hover:border-lily-green transition-all cursor-pointer"
            whileHover={{ y: -5 }}
            onClick={() => onSelectFrog(frog)}
          >
            <div className="flex items-center p-3">
              {/* Logo */}
              <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center mr-3 overflow-hidden border border-gray-100">
                <img 
                  src={frog.logo_url} 
                  alt={`${frog.name} logo`} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://via.placeholder.com/100/00cc88/ffffff?text=${frog.name.charAt(0)}`;
                  }}
                />
              </div>
              
              {/* Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-pond-dark truncate">{frog.name}</h3>
                <p className="text-xs text-gray-500 truncate">{frog.tags.slice(0, 2).join(', ')}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Empty state */}
      {filteredFrogs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No communities found matching "{searchQuery}"</p>
          <button
            onClick={onCreateNew}
            className="mt-4 px-4 py-2 bg-lily-green text-white font-medium rounded-full shadow hover:bg-opacity-90 focus:outline-none inline-flex items-center"
          >
            <span className="mr-1">➕</span>
            <span>Create "{searchQuery}"</span>
          </button>
        </div>
      )}
    </div>
  );
}
