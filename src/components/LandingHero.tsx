import React from 'react';
import { motion } from 'framer-motion';

interface LandingHeroProps {
  onGetStarted: () => void;
}

export default function LandingHero({ onGetStarted }: LandingHeroProps) {
  return (
    <div className="max-w-4xl mx-auto text-center mb-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-lily-green opacity-5"></div>
          <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-lily-green opacity-5"></div>
          <div className="absolute top-1/3 right-10 w-10 h-10 rounded-full bg-lily-green opacity-10"></div>
          <div className="absolute bottom-1/3 left-20 w-16 h-16 rounded-full bg-lily-green opacity-10"></div>
        </div>
        
        {/* Main content */}
        <div className="relative z-10">
          <motion.div 
            className="text-8xl mb-4 inline-block"
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            🐸
          </motion.div>
          
          <motion.h1 
            className="text-5xl font-bold text-pond-dark mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            Find Your Perfect Collab Partner
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-600 max-w-2xl mx-auto mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            VibeCheck helps Web3 communities match and discover meaningful collaboration opportunities using AI from the Lilypad Network.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <button
              onClick={onGetStarted}
              className="px-8 py-3 bg-lily-green text-white font-bold rounded-full shadow-md hover:bg-opacity-90 focus:outline-none transition-colors text-lg"
            >
              Get Started
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* How it works section */}
      <motion.div 
        className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
      >
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-lily-green bg-opacity-10 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">1️⃣</span>
          </div>
          <h3 className="text-lg font-bold mb-2">Create Your Profile</h3>
          <p className="text-gray-600">Add your community info, vibe tags, and share what makes you unique.</p>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-lily-green bg-opacity-10 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">2️⃣</span>
          </div>
          <h3 className="text-lg font-bold mb-2">Find Communities</h3>
          <p className="text-gray-600">Browse the pond and explore other Web3 communities. View their details before matching.</p>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-lily-green bg-opacity-10 flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">3️⃣</span>
          </div>
          <h3 className="text-lg font-bold mb-2">Check Your Vibes</h3>
          <p className="text-gray-600">Get AI-powered match insights, collaboration ideas, and easy ways to connect.</p>
        </div>
      </motion.div>
    </div>
  );
}
