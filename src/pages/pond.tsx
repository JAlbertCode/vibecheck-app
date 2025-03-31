import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import FrogCard from '../components/FrogCard';
import VibeMatch from '../components/VibeMatch';
import Header from '../components/Header';
import { getFrogs, type Frog, type VibeMatch as VibeMatchType } from '../utils/supabase';
import { compareVibes } from '../utils/lilypad';
import Link from 'next/link';

export default function Pond() {
  const [frogs, setFrogs] = useState<Frog[]>([]);
  const [loading, setLoading] = useState(true);
  const [myFrog, setMyFrog] = useState<Frog | null>(null);
  const [selectedFrog, setSelectedFrog] = useState<Frog | null>(null);
  const [compareLoading, setCompareLoading] = useState(false);
  const [match, setMatch] = useState<VibeMatchType | null>(null);

  useEffect(() => {
    const loadFrogs = async () => {
      try {
        const allFrogs = await getFrogs();
        setFrogs(allFrogs);
        
        // For demo purposes, set the first frog as "my frog"
        if (allFrogs.length > 0) {
          setMyFrog(allFrogs[0]);
        }
      } catch (error) {
        console.error('Error loading frogs:', error);
        
        // In case of error, use empty array
        setFrogs([]);
      } finally {
        setLoading(false);
      }
    };
    
    loadFrogs();
  }, []);
  
  // This ensures we don't show the same frog twice
  const otherFrogs = frogs.filter(frog => !myFrog || frog.id !== myFrog.id);

  const handleSelectFrog = (frog: Frog) => {
    // Don't allow selecting your own frog
    if (myFrog && frog.id === myFrog.id) return;
    
    // If the same frog is clicked again, deselect it
    if (selectedFrog && frog.id === selectedFrog.id) {
      setSelectedFrog(null);
    } else {
      // Otherwise, select the clicked frog
      setSelectedFrog(frog);
      setMatch(null);
    }
  };

  const handleCompare = async () => {
    if (!myFrog || !selectedFrog) return;
    
    setCompareLoading(true);
    
    try {
      const matchResult = await compareVibes(myFrog, selectedFrog);
      setMatch(matchResult);
    } catch (error) {
      console.error('Error comparing frogs:', error);
      alert('Failed to compare frogs. Please try again.');
    } finally {
      setCompareLoading(false);
    }
  };

  // already defined above

  return (
    <div className="min-h-screen bg-pond-light pb-12">
      <Header />
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold text-pond-dark mb-4">The Pond</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Browse other communities, <span className="underline">select one</span> to compare with yours, then <span className="font-semibold text-lily-green">check your vibes!</span>
          </p>
        </div>
        
        {loading ? (
          <div className="text-center py-20">
            <div className="animate-float inline-block text-6xl mb-4">🐸</div>
            <p className="text-gray-600">Loading the pond...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* My Frog Section */}
            <div>
              <h2 className="text-xl font-semibold text-pond-dark mb-4">Your Frog</h2>
              
              {myFrog ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <FrogCard frog={myFrog} onClick={() => {}} />
                  
                  <motion.button
                    onClick={handleCompare}
                    className={`mt-6 w-full px-4 py-2 ${selectedFrog ? 'bg-lily-green text-white' : 'bg-gray-200 text-gray-500'} font-medium rounded-md shadow-sm hover:bg-opacity-90 focus:outline-none disabled:opacity-50 relative ${!selectedFrog ? 'cursor-not-allowed' : ''}`}
                    disabled={compareLoading || !selectedFrog}
                    whileHover={{ scale: selectedFrog ? 1.03 : 1 }}
                    whileTap={{ scale: selectedFrog ? 0.98 : 1 }}
                  >
                    {compareLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Checking Vibes...
                      </span>
                    ) : selectedFrog ? (
                      'Check Vibes!'
                    ) : (
                      'Select a community first'
                    )}
                  </motion.button>
                </motion.div>
              ) : (
                <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                  <p className="text-gray-600 mb-4">You haven't created a frog yet!</p>
                  <Link
                    href="/"
                    className="inline-block px-4 py-2 bg-lily-green text-white font-medium rounded-md shadow-sm hover:bg-opacity-90 focus:outline-none"
                  >
                    Create Your Frog
                  </Link>
                </div>
              )}
            </div>
            
            {/* Other Frogs Section */}
            <div>
              <h2 className="text-xl font-semibold text-pond-dark mb-4">Other Communities</h2>
              <p className="text-gray-500 text-sm mb-4">Click on a community to select it, then check your vibes using the button to the left.</p>
              
              {otherFrogs.length === 0 ? (
                <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                  <p className="text-gray-600">No other frogs in the pond yet!</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                  {otherFrogs.map((frog) => (
                    <motion.div
                      key={frog.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <FrogCard
                        frog={frog}
                        onClick={() => handleSelectFrog(frog)}
                        isSelected={selectedFrog?.id === frog.id}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Match Result Section */}
            <div>
              <h2 className="text-xl font-semibold text-pond-dark mb-4">Vibe Match</h2>
              
              {match && myFrog && selectedFrog ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <VibeMatch myFrog={myFrog} otherFrog={selectedFrog} match={match} />
                </motion.div>
              ) : (
                <div className="bg-white p-6 rounded-xl shadow-lg text-center">
                  <p className="text-gray-600">
                    {selectedFrog
                      ? 'Click "Check Vibes" to see your match!'
                      : 'Select another frog to check your vibe match.'}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
