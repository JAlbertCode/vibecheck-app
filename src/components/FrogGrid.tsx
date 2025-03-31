import React, { useState, useEffect, useMemo } from 'react';
import { getDefaultImage } from '../utils/defaultImages';
import { motion } from 'framer-motion';
import type { Frog } from '../utils/supabase';

interface FrogGridProps {
  frogs: Frog[];
  selectedFrog?: Frog | null;
  onSelectFrog: (frog: Frog) => void;
  onCompareFrogs: (frogs: Frog[]) => void;
  onEditFrog?: (frog: Frog) => void;
}

export default function FrogGrid({ frogs, selectedFrog, onSelectFrog, onCompareFrogs, onEditFrog }: FrogGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedFrogs, setSelectedFrogs] = useState<Frog[]>([]);
  
  // Get all unique tags from all communities
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

  return (
    <div className="w-full max-w-7xl mx-auto">
      {/* Search and filters */}
      <div className="mb-6 space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search communities..."
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
                <option value="">Filter by vibes...</option>
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
      
      {/* Section title */}
      <div className="mb-4 bg-white p-4 rounded-lg shadow border border-gray-100">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="font-medium text-lg mb-1">Find your vibe match</h3>
            <p className="text-sm text-gray-600">
              {selectedFrogs.length === 0
                ? "Click on a community card to see your vibe match"
                : "Click additional cards to select multiple, then compare"
              }
            </p>
          </div>
          <button
            onClick={() => {
              if (selectedFrogs.length === 0) {
                // Start multi-select mode by selecting one random frog
                if (filteredFrogs.length > 0) {
                  setSelectedFrogs([filteredFrogs[0]]);
                }
              } else {
                // Exit multi-select mode
                setSelectedFrogs([]);
              }
            }}
            className="text-sm text-lily-green hover:underline"
          >
            {selectedFrogs.length === 0 ? "Select multiple" : "Cancel"}
          </button>
        </div>
      </div>
      
      {/* Multi-selection controls */}
      {selectedFrogs.length > 0 && (
        <div className="mb-4 p-3 bg-lily-light rounded-lg border border-lily-green">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center">
              <span className="mr-2 font-medium">{selectedFrogs.length} selected</span>
              <button 
                onClick={() => setSelectedFrogs([])} 
                className="text-sm text-lily-green hover:underline"
              >
                Clear
              </button>
            </div>
            <button
              className="px-4 py-1 bg-lily-green text-white rounded-full text-sm font-medium hover:bg-opacity-90 transition-colors"
              onClick={() => onCompareFrogs(selectedFrogs)}
            >
              Compare Selected
            </button>
          </div>
        </div>
      )}
      
      {/* Communities grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredFrogs.map(frog => (
          <motion.div
            key={frog.id}
            className={`relative bg-white rounded-lg shadow-sm overflow-hidden border ${selectedFrogs.includes(frog) ? 'border-lily-green ring-2 ring-lily-green' : 'border-gray-200'} hover:shadow-md hover:border-lily-green transition-all cursor-pointer`}
            whileHover={{ y: -5 }}
            onClick={() => {
              // If already selected, remove from selection
              if (selectedFrogs.includes(frog)) {
                setSelectedFrogs(selectedFrogs.filter(f => f.id !== frog.id));
              } 
              // If it's the first selection, add to selection
              else if (selectedFrogs.length > 0) {
                setSelectedFrogs([...selectedFrogs, frog]);
              }
              // If no current selection, just select this frog directly
              else {
                onSelectFrog(frog);
              }
            }}
          >
            
            {/* Edit button */}
            {onEditFrog && (
              <div 
                className="absolute top-2 right-2 z-10 w-8 h-8 rounded-md border-2 border-gray-300 bg-white hover:border-lily-green shadow-sm flex items-center justify-center cursor-pointer transition-colors duration-200"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditFrog(frog);
                }}
              >
                <span className="text-gray-500 hover:text-lily-green text-lg">✎</span>
              </div>
            )}
            
            {/* Logo */}
            <div className="w-full aspect-square bg-gray-50 flex items-center justify-center p-4">
              <img 
                src={frog.logo_url || getDefaultImage(frog.name)} 
                alt={`${frog.name} logo`} 
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = getDefaultImage(frog.name);
                }}
              />
            </div>
            
            {/* Info */}
            <div className="p-3">
              <h3 className="font-medium truncate">{frog.name}</h3>
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
          <p className="text-gray-500">No communities found matching your filters.</p>
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