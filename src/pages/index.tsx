import React, { useState } from 'react';
import { motion } from 'framer-motion';
import FrogForm from '../components/FrogForm';
import Header from '../components/Header';
import { createFrog, updateFrogImage, type Frog } from '../utils/supabase';
import { generateFrogImage } from '../utils/lilypad';
import { useRouter } from 'next/router';

export default function Home() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showGenerate, setShowGenerate] = useState(false);
  const [createdFrog, setCreatedFrog] = useState<Omit<Frog, 'image_url'> | null>(null);
  const router = useRouter();
  
  const handleFormSubmit = async (frogData: Omit<Frog, 'id' | 'image_url'>) => {
    setIsSubmitting(true);
    
    try {
      // Create the frog in Supabase
      const newFrog = await createFrog({
        ...frogData,
        image_url: null
      });
      
      setCreatedFrog(newFrog);
      setShowGenerate(true);
    } catch (error) {
      console.error('Error creating frog:', error);
      alert('Failed to create your frog profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleGenerateImage = async () => {
    if (!createdFrog) return;
    
    setIsSubmitting(true);
    
    try {
      // Generate image using Lilypad
      const imageUrl = await generateFrogImage({
        name: createdFrog.name,
        bio: createdFrog.bio,
        logo_url: createdFrog.logo_url,
        tags: createdFrog.tags,
        reflections: createdFrog.reflections,
        contact_links: createdFrog.contact_links
      });
      
      // Update the frog with the image URL
      await updateFrogImage(createdFrog.id, imageUrl);
      
      // Navigate to the pond
      router.push('/pond');
    } catch (error) {
      console.error('Error generating frog image:', error);
      alert('Failed to generate frog image. Please try again or continue to the pond.');
      router.push('/pond');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleSkipGeneration = () => {
    router.push('/pond');
  };
  
  return (
    <div className="min-h-screen bg-pond-light pb-12">
      <Header />
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <motion.h1 
            className="text-4xl font-bold text-pond-dark mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Create Your Vibe Profile
          </motion.h1>
          <motion.p 
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Create your community's vibe profile, match with others, and discover new collaboration possibilities.
          </motion.p>
        </div>
        
        {showGenerate ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="max-w-lg mx-auto bg-white p-8 rounded-xl shadow-lg text-center"
          >
            <h2 className="text-2xl font-bold text-pond-dark mb-4">Profile Created!</h2>
            <p className="mb-6">Would you like to generate a custom frog image with Lilypad?</p>
            
            <div className="space-y-4">
              <motion.button
                onClick={handleGenerateImage}
                className="w-full px-6 py-3 bg-lily-green text-white font-medium rounded-md shadow-sm hover:bg-opacity-90 focus:outline-none disabled:opacity-50"
                disabled={isSubmitting}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating your frog...
                  </span>
                ) : 'Generate Your Frog 🐸'}
              </motion.button>
              
              <button
                onClick={handleSkipGeneration}
                className="text-gray-500 hover:text-gray-700"
                disabled={isSubmitting}
              >
                Skip for now
              </button>
            </div>
            
            <p className="mt-4 text-sm text-gray-500">
              This may take a minute as we're using the Lilypad Network for decentralized image generation.
            </p>
          </motion.div>
        ) : (
          <FrogForm onSubmit={handleFormSubmit} />
        )}
      </div>
    </div>
  );
}
