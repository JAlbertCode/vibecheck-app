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
          <div className="relative">
            <div className="flex flex-wrap gap-2 mb-2">
              {selectedTags.map(tag => (
                <div key={tag} 
                  className="bg-lily-green text-white text-sm px-3 py-1 rounded-full flex items-center gap-1"
                >
                  {tag}
                  <button 
                    onClick={() => handleTagToggle(tag)}
                    className="hover:bg-lily-dark rounded-full w-4 h-4 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            
            <div className="relative">
              <select
                className="w-full px-4 py-2 border border-gray-300 rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-lily-green focus:border-transparent appearance-none"
                value=""
                onChange={(e) => {
                  if (e.target.value && !selectedTags.includes(e.target.value)) {
                    setSelectedTags([...selectedTags, e.target.value]);
                    e.target.value = "";
                  }
                }}
              >
                <option value="">Filter by tags...</option>
                {allTags
                  .filter(tag => !selectedTags.includes(tag))
                  .map(tag => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))
                }
              </select>
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
                ▼
              </span>
            </div>
          </div>
        )}
      </div>
      
      {/* Selection info and compare button - always visible */}
      <div className="sticky top-0 z-10 bg-white mb-4 p-4 rounded-lg shadow border border-gray-100 transition-all">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="font-medium text-pond-dark text-lg mb-1">Select communities to compare</h3>
            <p className="text-sm text-gray-600">
              {selectedFrogs.length === 0 
                ? "Click the checkboxes to select communities" 
                : `${selectedFrogs.length} ${selectedFrogs.length === 1 ? 'community' : 'communities'} selected`}
            </p>
          </div>
          
          <motion.button
            onClick={handleCompareClick}
            disabled={selectedFrogs.length === 0}
            className={`px-6 py-3 text-white font-medium rounded-full shadow focus:outline-none relative overflow-hidden ${selectedFrogs.length === 0 ? 'bg-gray-300 cursor-not-allowed' : 'bg-lily-green hover:bg-opacity-90'}`}
            whileHover={selectedFrogs.length > 0 ? { scale: 1.03 } : undefined}
            whileTap={selectedFrogs.length > 0 ? { scale: 0.98 } : undefined}
          >
            {selectedFrogs.length > 0 && (
              <span className="absolute top-0 right-0 w-5 h-5 bg-white text-lily-green rounded-full flex items-center justify-center text-xs font-bold transform translate-x-1/4 -translate-y-1/4">
                {selectedFrogs.length}
              </span>
            )}
            
            <span className="flex items-center gap-2">
              <span>Get Vibe Match</span>
              <span>✨</span>
            </span>
          </motion.button>
        </div>
        
        {/* Selected communities chips */}
        {selectedFrogs.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {selectedFrogs.map(frog => (
              <div key={frog.id} className="bg-lily-green bg-opacity-10 text-pond-dark text-sm px-3 py-1 rounded-full flex items-center gap-1">
                <span>{frog.name}</span>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFrogToggle(frog);
                  }}
                  className="hover:bg-lily-green hover:bg-opacity-20 rounded-full w-4 h-4 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
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
              className={`absolute top-2 right-2 z-10 w-6 h-6 rounded-md border-2 ${selectedFrogs.some(f => f.id === frog.id) ? 'bg-lily-green border-lily-green' : 'bg-white border-gray-300 hover:border-lily-green'} shadow-sm flex items-center justify-center cursor-pointer transition-colors duration-200`}
              onClick={(e) => {
                e.stopPropagation();
                handleFrogToggle(frog);
              }}
            >
              {selectedFrogs.some(f => f.id === frog.id) ? (
                <span className="text-white text-sm font-bold">✓</span>
              ) : null}
            </div>
            
            {/* Logo */}
            <div className="w-full aspect-square bg-gray-50 flex items-center justify-center p-4">
              <img 
                src={frog.logo_url} 
                alt={`${frog.name} logo`} 
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  // Create a canvas-based fallback image
                  const canvas = document.createElement('canvas');
                  canvas.width = 100;
                  canvas.height = 100;
                  const ctx = canvas.getContext('2d');
                  if (ctx) {
                    ctx.fillStyle = '#00cc88';
                    ctx.beginPath();
                    ctx.arc(50, 50, 50, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.fillStyle = '#ffffff';
                    ctx.font = 'bold 40px Arial';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(frog.name.charAt(0).toUpperCase(), 50, 50);
                    (e.target as HTMLImageElement).src = canvas.toDataURL();
                  }
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
