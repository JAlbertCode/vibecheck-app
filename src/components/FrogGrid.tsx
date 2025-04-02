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

export default function FrogGrid({ frogs, selectedFrog, onSelectFrog, onEditFrog }: FrogGridProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // Sort frogs alphabetically by name
  const sortedFrogs = useMemo(() => 
    [...frogs].sort((a, b) => a.name.localeCompare(b.name)),
    [frogs]
  );
  
  // Get all unique tags from all communities
  const allTags = Array.from(
    new Set(
      sortedFrogs.flatMap(frog => frog.tags)
    )
  ).sort();

  // Filter frogs based on search and tags
  // Filter frogs based on search and tags
  const filteredFrogs = sortedFrogs.filter(frog => {
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
      {/* Combined search, filters, and controls */}
      <div className="mb-6 bg-white p-4 rounded-lg shadow border border-gray-100">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="relative flex-grow">
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
            <div className="relative min-w-[200px]">
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
          )}
        </div>
        
        {/* Selected tags */}
        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
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
        )}

        <div className="mt-3">
          <p className="text-sm text-gray-600">
            Click on a community to see your vibe match
          </p>
        </div>
      </div>
      

      
      {/* Communities grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredFrogs.map(frog => (
          <motion.div
            key={frog.id}
            className="relative bg-white rounded-lg overflow-hidden shadow-md border border-gray-200 hover:shadow-xl hover:border-lily-green transition-all cursor-pointer"
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
            onClick={() => onSelectFrog(frog)}
          >
            
            {/* Edit button */}
            {onEditFrog && (
              <div 
                className="absolute top-2 left-2 z-20 w-7 h-7 rounded-full bg-white hover:bg-lily-green shadow flex items-center justify-center cursor-pointer transition-colors duration-200 border border-gray-200 hover:border-transparent"
                onClick={(e) => {
                  e.stopPropagation();
                  onEditFrog(frog);
                }}
              >
                <span className="text-gray-500 hover:text-white transition-colors text-sm">✎</span>
              </div>
            )}
            
            {/* Logo */}
            <div className="w-full aspect-square bg-white flex items-center justify-center p-4 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-100 to-purple-100 z-0"></div>
              <img 
                src={frog.logo_url || getDefaultImage(frog.name)} 
                alt={`${frog.name} logo`} 
                className="max-w-full max-h-full object-contain relative z-10"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = getDefaultImage(frog.name);
                }}
              />
              {/* Decorative elements */}
              <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-pink-200 opacity-20 blur-xl"></div>
              <div className="absolute -top-4 -left-4 w-12 h-12 rounded-full bg-purple-200 opacity-20 blur-lg"></div>
            </div>
            
            {/* Info */}
            <div className="p-4 border-t border-gray-100">
              <h3 className="font-medium text-gray-800 truncate">{frog.name}</h3>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {frog.tags.slice(0, 3).map((tag, index) => (
                  <span key={index} className="inline-block text-xs bg-pink-100 text-pink-700 px-2.5 py-0.5 rounded-full truncate max-w-full">
                    {tag}
                  </span>
                ))}
                {frog.tags.length > 3 && (
                  <span className="inline-block text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    +{frog.tags.length - 3} more
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Empty state */}
      {filteredFrogs.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-700 mb-2">No communities found</h3>
          <p className="text-gray-500 mb-4">We couldn't find any communities matching your current filters.</p>
          {(searchQuery || selectedTags.length > 0) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedTags([]);
              }}
              className="px-4 py-2 bg-lily-green text-white rounded-full text-sm font-medium hover:bg-opacity-90 transition-colors inline-flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear all filters
            </button>
          )}
        </div>
      )}
    </div>
  );
}