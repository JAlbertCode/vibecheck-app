  // Handle editing a frog
  const handleEditFrog = (frog: Frog) => {
    setEditingFrog(frog);
    setCurrentStep('CREATE_FROG');
  };import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import FrogForm from '../components/FrogForm';
import FrogSelection from '../components/FrogSelection';
import FrogGrid from '../components/FrogGrid';
import VibeMatch from '../components/VibeMatch';
import Header from '../components/Header';
import { createFrog, getFrogs, updateFrogImage, getFrogById, type Frog, type VibeMatch as VibeMatchType } from '../utils/supabase';
import { generateFrogImage, compareVibes } from '../utils/lilypad';
import { useRouter } from 'next/router';

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
      // Create the frog in Supabase
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
    } catch (error) {
      console.error('Error creating frog:', error);
      alert('Failed to create your frog profile. Please try again.');
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
          <FrogForm onSubmit={handleFormSubmit} />
        );
        
      case 'BROWSE_FROGS':
        return (
          <div className="space-y-6">
            {myFrog && (
              <div className="bg-white rounded-lg shadow-md p-4 flex items-center">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-50 flex items-center justify-center mr-4">
                  <img 
                    src={myFrog.logo_url} 
                    alt={`${myFrog.name} logo`} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://via.placeholder.com/100/00cc88/ffffff?text=${myFrog.name.charAt(0)}`;
                    }}
                  />
                </div>
                
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-pond-dark">{myFrog.name}</h2>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {myFrog.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="text-xs bg-pond-light text-pond-dark px-2 py-0.5 rounded-full">
                        {tag}
                      </span>
                    ))}
                    {myFrog.tags.length > 3 && (
                      <span className="text-xs text-gray-500">+{myFrog.tags.length - 3} more</span>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={handleChangeFrog}
                  className="text-lily-green hover:underline text-sm font-medium"
                >
                  Change
                </button>
              </div>
            )}
            
            <div>
              <h2 className="text-xl font-bold text-pond-dark mb-2">Find communities to collaborate with</h2>
              <p className="text-gray-600 mb-4">Select a community to see how you could work together</p>
              
              <FrogGrid 
                frogs={frogs}
                selectedFrog={myFrog}
                onSelectFrog={handleSelectCompareFrog}
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
                className="mb-6 flex items-center text-lily-green hover:underline"
              >
                <span className="mr-1">←</span>
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
        {(currentStep === 'SELECT_FROG' || currentStep === 'CREATE_FROG') && (
          <div className="mb-12 text-center">
            <motion.h1 
              className="text-4xl font-bold text-pond-dark mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {currentStep === 'CREATE_FROG' ? 'Create Your Vibe Profile' : 'Select Your Community'}
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {currentStep === 'CREATE_FROG' 
                ? 'Create your community profile, match with others, and discover collaboration possibilities.' 
                : 'Choose your community or create a new one to start exploring collaborations.'}
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
                    <div className="animate-pulse absolute inset-0 bg-lily-green opacity-20 rounded-full"></div>
                    <div className="w-24 h-24 relative">
                      <div className="animate-bounce absolute inset-0 flex items-center justify-center">
                        <span className="text-5xl">🐸</span>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl animate-ping delay-300">✨</span>
                      </div>
                    </div>
                  </div>
                  <p className="text-pond-dark font-bold text-lg mb-1">Creating your frog...</p>
                  <p className="text-gray-600 text-center">
                    Requesting AI magic from the Lilypad Network. This usually takes around 30 seconds.
                  </p>
                </>
              ) : (
                <>
                  <div className="mb-4 w-full max-w-xs">
                    <div className="w-full bg-gray-100 overflow-hidden rounded-full h-4 flex items-center justify-start relative">
                      <div className="absolute inset-y-0 left-0 bg-lily-green transition-all duration-300 w-1/2 animate-pulse"></div>
                      <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                        <div className="animate-marquee whitespace-nowrap flex">
                          {[...Array(10)].map((_, i) => (
                            <span key={i} className="mx-2 text-white font-medium text-sm">🐸 ✨ 🌿</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-pond-dark font-bold text-lg mb-1">Computing vibe match...</p>
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
