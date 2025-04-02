import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import FrogForm from '../components/FrogForm';
import FrogSelection from '../components/FrogSelection';
import FrogGrid from '../components/FrogGrid';
import VibeMatch from '../components/VibeMatch';
import Header from '../components/Header';
import { createFrog, getFrogs, updateFrogImage, updateFrog, getFrogById, type Frog, type VibeMatch as VibeMatchType } from '../utils/supabase';
import { generateFrogImage, compareVibes } from '../utils/lilypad';
import { useRouter } from 'next/router';
import { getDefaultImage } from '../utils/defaultImages';

// Define our app flow steps
type FlowStep = 'SELECT_FROG' | 'CREATE_FROG' | 'BROWSE_FROGS' | 'SHOW_MATCH';

export default function Home() {
  // Flow state
  const [currentStep, setCurrentStep] = useState<FlowStep>('SELECT_FROG');
  
  // Data state
  const [frogs, setFrogs] = useState<Frog[]>([]);
  const [myFrog, setMyFrog] = useState<Frog | null>(null);
  const [selectedFrogs, setSelectedFrogs] = useState<Frog[]>([]);
  const [currentMatch, setCurrentMatch] = useState<{
    myFrog: Frog;
    otherFrog: Frog;
    match: VibeMatchType;
  } | null>(null);
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [editingFrog, setEditingFrog] = useState<Frog | null>(null); // For edit functionality
  
  const router = useRouter();
  
  // Pre-generate default images for all frogs when they load
  useEffect(() => {
    if (typeof window !== 'undefined' && frogs.length > 0) {
      // Pre-generate all default images in the background
      frogs.forEach(frog => {
        if (!frog.logo_url || frog.logo_url.includes('placeholder')) {
          // This will cache the image for later use
          getDefaultImage(frog.name);
        }
      });
    }
  }, [frogs]);
  
  // Load frogs on initial render
  useEffect(() => {
    const loadFrogs = async () => {
      setIsLoading(true);
      try {
        const loadedFrogs = await getFrogs();
        setFrogs(loadedFrogs);
      } catch (error) {
        console.error('Error loading frogs:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadFrogs();
  }, []);
  
  // Handle selecting a frog from the selection screen
  const handleSelectMyFrog = (frog: Frog) => {
    setMyFrog(frog);
    setCurrentStep('BROWSE_FROGS');
  };
  
  // Handle creating a new frog
  const handleCreateNewFrog = () => {
    setCurrentStep('CREATE_FROG');
  };
  
  // Handle form submission for new frog
  const handleFormSubmit = async (frogData: Omit<Frog, 'id' | 'image_url'>) => {
    setIsLoading(true);
    
    try {
      // Check if we're editing an existing frog or creating a new one
      if (editingFrog) {
        // Update existing frog
        const imageUrl = editingFrog.image_url || null;
        const updatedFrog = await updateFrog(editingFrog.id, {
          ...frogData,
          image_url: imageUrl
        });
        
        // Update frogs list
        setFrogs(frogs.map(frog => frog.id === updatedFrog.id ? updatedFrog : frog));
        
        // If this was the selected frog, update it
        if (myFrog && myFrog.id === updatedFrog.id) {
          setMyFrog(updatedFrog);
        }
        
        // Reset editing state
        setEditingFrog(null);
        
        // Move to browse frogs
        setCurrentStep('BROWSE_FROGS');
      } else {
        // Create a new frog
        const newFrog = await createFrog({
          ...frogData,
          image_url: null
        });
        
        // Ask if user wants to generate image
        if (confirm('Frog created! Would you like to generate a custom frog image with Lilypad?')) {
          setIsGeneratingImage(true);
          try {
            // Generate image using Lilypad
            const imageUrl = await generateFrogImage({
              name: newFrog.name,
              bio: newFrog.bio,
              logo_url: newFrog.logo_url,
              tags: newFrog.tags,
              reflections: newFrog.reflections,
              contact_links: newFrog.contact_links
            });
            
            // Update the frog with the image URL
            await updateFrogImage(newFrog.id, imageUrl);
            
            // Refresh the frog data
            const updatedFrog = await getFrogById(newFrog.id);
            if (updatedFrog) {
              // Update frogs list and set as selected
              setFrogs([...frogs, updatedFrog]);
              setMyFrog(updatedFrog);
            }
          } catch (error) {
            console.error('Error generating image:', error);
            // Still set the frog as selected even if image generation fails
            setFrogs([...frogs, newFrog]);
            setMyFrog(newFrog);
          } finally {
            setIsGeneratingImage(false);
          }
        } else {
          // Just add the new frog to the list and set as selected
          setFrogs([...frogs, newFrog]);
          setMyFrog(newFrog);
        }
        
        // Move to browse frogs
        setCurrentStep('BROWSE_FROGS');
      }
    } catch (error) {
      console.error('Error saving frog:', error);
      alert('Failed to save your frog profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle selecting a frog to compare with
  const handleSelectCompareFrog = (frog: Frog) => {
    if (!myFrog) return;
    
    setIsLoading(true);
    // Get vibe match between my frog and selected frog
    compareVibes(myFrog, frog)
      .then(match => {
        setCurrentMatch({
          myFrog,
          otherFrog: frog,
          match
        });
        setCurrentStep('SHOW_MATCH');
      })
      .catch(error => {
        console.error('Error comparing vibes:', error);
        alert('Failed to compare vibes. Please try again.');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  
  // Handle comparing multiple frogs
  const handleCompareMultiple = (frogsToCompare: Frog[]) => {
    if (!myFrog || frogsToCompare.length === 0) return;
    
    if (frogsToCompare.length === 1) {
      // Just a single frog comparison
      handleSelectCompareFrog(frogsToCompare[0]);
      return;
    }
    
    // For multiple frogs, we'll have to build this functionality
    alert('Comparing multiple frogs is coming soon!');
  };
  
  // Handle editing a frog
  const handleEditFrog = (frog: Frog) => {
    setEditingFrog(frog);
    setCurrentStep('CREATE_FROG');
  };
  
  // Handle going back to browse frogs from match screen
  const handleBackToBrowse = () => {
    setCurrentStep('BROWSE_FROGS');
    setCurrentMatch(null);
  };
  
  // Handle changing frog (going back to selection)
  const handleChangeFrog = () => {
    setMyFrog(null);
    setCurrentStep('SELECT_FROG');
    setCurrentMatch(null);
  };
  
  // Render appropriate content based on current step
  const renderContent = () => {
    switch(currentStep) {
      case 'SELECT_FROG':
        return (
          <FrogSelection 
            frogs={frogs} 
            onSelectFrog={handleSelectMyFrog}
            onCreateNew={handleCreateNewFrog}
          />
        );
        
      case 'CREATE_FROG':
        return (
          <FrogForm onSubmit={handleFormSubmit} initialData={editingFrog} />
        );
        
      case 'BROWSE_FROGS':
        return (
          <div className="space-y-6">
              {myFrog && (
              <div className="bg-white rounded-lg shadow-md p-5 mb-6">
                <div className="flex items-center mb-3">
                  <div className="w-16 h-16 rounded-full overflow-hidden bg-gradient-to-r from-pink-200 to-purple-200 flex items-center justify-center mr-5 shadow-sm">
                    <img 
                      src={myFrog.logo_url} 
                      alt={`${myFrog.name} logo`} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Create a canvas-based fallback image
                        const canvas = document.createElement('canvas');
                        canvas.width = 100;
                        canvas.height = 100;
                        const ctx = canvas.getContext('2d');
                        if (ctx) {
                          ctx.fillStyle = '#EC4899';
                          ctx.beginPath();
                          ctx.arc(50, 50, 50, 0, Math.PI * 2);
                          ctx.fill();
                          ctx.fillStyle = '#ffffff';
                          ctx.font = 'bold 40px "Space Grotesk"';
                          ctx.textAlign = 'center';
                          ctx.textBaseline = 'middle';
                          ctx.fillText(myFrog.name.charAt(0).toUpperCase(), 50, 50);
                          (e.target as HTMLImageElement).src = canvas.toDataURL();
                        }
                      }}
                    />
                  </div>
                  
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold">{myFrog.name}</h2>
                    <p className="text-sm text-gray-600 mt-1">{myFrog.bio.substring(0, 100)}{myFrog.bio.length > 100 && '...'}</p>
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEditFrog(myFrog)}
                      className="flex items-center px-3 py-1.5 bg-white border border-lily-green text-lily-green rounded-full text-sm font-medium hover:bg-lily-green hover:text-white transition-colors"
                    >
                      <span className="mr-1">✎</span>
                      Edit
                    </button>
                    <button
                      onClick={handleChangeFrog}
                      className="flex items-center px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors"
                    >
                      <span className="mr-1">←</span>
                      Change
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {myFrog.tags.map((tag, index) => (
                    <span key={index} className="text-sm bg-lily-green bg-opacity-10 text-lily-green px-3 py-1 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div>
              <h2 className="text-xl font-bold text-pond-dark mb-4">Find communities to collaborate with</h2>
              
              <FrogGrid 
                frogs={frogs}
                selectedFrog={myFrog}
                onSelectFrog={handleSelectCompareFrog}
                onEditFrog={handleEditFrog}
                onCompareFrogs={handleCompareMultiple}
              />
            </div>
          </div>
        );
        
      case 'SHOW_MATCH':
        return (
          currentMatch ? (
            <div>
              <button
                onClick={handleBackToBrowse}
                className="mb-6 flex items-center px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow text-lily-green border border-lily-green"
              >
                <span className="mr-2">←</span>
                <span>Back to communities</span>
              </button>
              
              <VibeMatch 
                myFrog={currentMatch.myFrog}
                otherFrog={currentMatch.otherFrog}
                match={currentMatch.match}
              />
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No match selected. Please go back and select a community.</p>
              <button
                onClick={handleBackToBrowse}
                className="mt-4 text-lily-green hover:underline"
              >
                Back to communities
              </button>
            </div>
          )
        );
    }
  };
  
  return (
    <div className="min-h-screen bg-pond-light pb-12">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        {/* Title area */}
        {(currentStep === 'CREATE_FROG') && (
          <div className="mb-12 text-center">
            <motion.h1 
              className="text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {currentStep === 'CREATE_FROG' ? (editingFrog ? 'Edit Community Profile' : 'Create Your Community') : 'Select Your Community'}
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {currentStep === 'CREATE_FROG' 
                ? 'Create your community profile, match with others, and discover collaboration possibilities.' 
                : null}
            </motion.p>
          </div>
        )}
        
        {/* Loading overlay */}
        {(isLoading || isGeneratingImage) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center max-w-sm w-full">
              {isGeneratingImage ? (
                <>
                  <div className="mb-4 relative">
                    <div className="animate-pulse absolute inset-0 bg-pink-500 opacity-20 rounded-full"></div>
                    <div className="w-24 h-24 relative">
                      <div className="animate-bounce absolute inset-0 flex items-center justify-center">
                        <span className="text-5xl">✨</span>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl animate-ping delay-300">🌈</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-pink-600 font-bold text-lg mb-1">Creating your community image...</p>
                  <p className="text-gray-600 text-center">
                    Requesting AI magic from the Lilypad Network. This usually takes around 30 seconds.
                  </p>
                </>
              ) : (
                <>
                  <div className="mb-4 w-full max-w-xs">
                    <div className="w-full bg-gray-100 overflow-hidden rounded-full h-4 flex items-center justify-start relative">
                      <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-300 w-1/2 animate-pulse"></div>
                      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                        <div className="animate-marquee whitespace-nowrap flex">
                          {[...Array(10)].map((_, i) => (
                            <span key={i} className="mx-2 text-white font-medium text-sm">✨ 🌈 ⭐</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-pink-600 font-bold text-lg mb-1">Computing vibe match...</p>
                  <p className="text-gray-600 text-center">
                    Creating your match on the Lilypad Network. Hang tight!
                  </p>
                </>
              )}
            </div>
          </div>
        )}
        
        {/* Main content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </div>
    </div>
  );
}
