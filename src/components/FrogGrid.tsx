import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Frog } from '../utils/supabase';

interface FrogGridProps {
  frogs: Frog[];
  selectedFrog?: Frog | null;
  onSelectFrog: (frog: Frog) => void;
  onCompareFrogs: (frogs: Frog[]) => void;
}

export default function FrogGrid({ frogs, selectedFrog, onSelectFrog, onCompareFrogs }: FrogGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedFrogs, setSelectedFrogs] = useState<Frog[]>([]);
  
  // Get all unique tags from all frogs
  const allTags = Array.from(
    new Set(
      frogs.flatMap(frog => frog.tags)
    )
  ).sort();

  // Filter frogs based on search and tags
  const filteredFrogs = frogs.filter(frog => {
    // Skip the currently selected frog (if any)
    if (selectedFrog && frog.id === selectedFrog.id) return false;
    
    // Check if frog name or bio matches search query
    const matchesSearch = 
      searchQuery === '' || 
      frog.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      frog.bio.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Check if frog has all selected tags (if any tags are selected)
    const matchesTags = 
      selectedTags.length === 0 || 
      selectedTags.every(tag => frog.tags.includes(tag));
    
    return matchesSearch && matchesTags;
  });

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleFrogToggle = (frog: Frog) => {
    if (selectedFrogs.some(f => f.id === frog.id)) {
      setSelectedFrogs(selectedFrogs.filter(f => f.id !== frog.id));
    } else {
      setSelectedFrogs([...selectedFrogs, frog]);
    }
  };

  const handleCompareClick = () => {
    if (selectedFrogs.length > 0) {
      onCompareFrogs(selectedFrogs);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Search and filters */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search frogs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-lily-green focus:border-transparent pl-10"
          />
          <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            🔍
          </span>
        </div>
        
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => handleTagToggle(tag)}
                className={`text-sm px-3 py-1 rounded-full transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-lily-green text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {/* Selected count and compare button */}
      {selectedFrogs.length > 0 && (
        <div className="mb-4 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            {selectedFrogs.length} {selectedFrogs.length === 1 ? 'frog' : 'frogs'} selected
          </p>
          <motion.button
            onClick={handleCompareClick}
            className="px-4 py-2 bg-lily-green text-white font-medium rounded-full shadow hover:bg-opacity-90 focus:outline-none"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            Compare Selected
          </motion.button>
        </div>
      )}
      
      {/* Frogs grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredFrogs.map(frog => (
          <motion.div
            key={frog.id}
            className={`relative bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md hover:border-lily-green transition-all cursor-pointer ${
              selectedFrogs.some(f => f.id === frog.id) ? 'ring-2 ring-lily-green' : ''
            }`}
            whileHover={{ y: -5 }}
            onClick={() => onSelectFrog(frog)}
          >
            {/* Checkbox for multi-select */}
            <div 
              className="absolute top-2 right-2 z-10 w-5 h-5 rounded-full bg-white shadow flex items-center justify-center cursor-pointer"
              onClick={(e) => {
                e.stopPropagation();
                handleFrogToggle(frog);
              }}
            >
              {selectedFrogs.some(f => f.id === frog.id) ? (
                <span className="text-lily-green">✓</span>
              ) : null}
            </div>
            
            {/* Logo */}
            <div className="w-full aspect-square bg-gray-50 flex items-center justify-center p-4">
              <img 
                src={frog.logo_url} 
                alt={`${frog.name} logo`} 
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://via.placeholder.com/100/00cc88/ffffff?text=${frog.name.charAt(0)}`;
                }}
              />
            </div>
            
            {/* Info */}
            <div className="p-3">
              <h3 className="font-medium text-pond-dark truncate">{frog.name}</h3>
              <div className="mt-1 flex flex-wrap gap-1">
                {frog.tags.slice(0, 3).map((tag, index) => (
                  <span key={index} className="inline-block text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full truncate max-w-full">
                    {tag}
                  </span>
                ))}
                {frog.tags.length > 3 && (
                  <span className="inline-block text-xs text-gray-500">+{frog.tags.length - 3} more</span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Empty state */}
      {filteredFrogs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No frogs found matching your filters.</p>
          {(searchQuery || selectedTags.length > 0) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedTags([]);
              }}
              className="mt-2 text-lily-green hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}
