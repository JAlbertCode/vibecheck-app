import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

export default function Header() {
  const router = useRouter();
  const currentPath = router.pathname;
  
  return (
    <header className="bg-gradient-to-r from-pink-400 via-purple-300 to-pink-300 py-4 mb-8 shadow-md">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <motion.div 
            className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-lg mr-3"
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ duration: 3, repeat: Infinity, repeatType: 'loop' }}
          >
            <span className="text-2xl">🐸</span>
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold text-white drop-shadow-sm">VibeCheck</h1>
            <p className="text-xs text-white text-opacity-80">Match your community's vibe!</p>
          </div>
        </div>
        
        <nav className="flex items-center space-x-4">
          <Link 
            href="/" 
            className="px-4 py-2 bg-white bg-opacity-30 rounded-full text-white font-medium hover:bg-opacity-40 transition-colors shadow-sm"
          >
            Home
          </Link>
          <Link 
            href="/pond" 
            className="px-4 py-2 bg-white bg-opacity-30 rounded-full text-white font-medium hover:bg-opacity-40 transition-colors shadow-sm"
          >
            The Pond
          </Link>
        </nav>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -top-4 left-1/4 w-16 h-16 rounded-full bg-yellow-200 bg-opacity-20 blur-xl"></div>
      <div className="absolute top-6 right-1/3 w-24 h-24 rounded-full bg-green-200 bg-opacity-20 blur-xl"></div>
    </header>
  );
}
