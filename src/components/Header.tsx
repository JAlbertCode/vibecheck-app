import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

export default function Header() {
  const router = useRouter();
  const currentPath = router.pathname;
  
  return (
    <header className="bg-gradient-to-r from-pink-400 via-purple-300 to-pink-300 py-3 sm:py-4 mb-4 sm:mb-8 shadow-md relative overflow-hidden">
      <div className="container mx-auto px-3 sm:px-4 flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
        <Link href="/" className="flex items-center">
          <div className="text-center sm:text-left">
            <h1 className="text-xl sm:text-2xl font-bold text-white drop-shadow-sm">Vibe Check</h1>
            <p className="text-xs text-white text-opacity-80">Match your community's vibe!</p>
          </div>
        </Link>
        
        <nav className="flex items-center space-x-2 sm:space-x-4 mt-1 sm:mt-0">
          <Link 
            href="/" 
            className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white bg-opacity-30 rounded-full text-white text-sm sm:text-base font-medium hover:bg-opacity-40 transition-colors shadow-sm flex items-center"
            onClick={() => window.location.href = '/'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Communities
          </Link>
        </nav>
      </div>
      
      {/* Decorative elements - made responsive */}
      <div className="absolute -top-4 left-1/4 w-12 sm:w-16 h-12 sm:h-16 rounded-full bg-yellow-200 bg-opacity-20 blur-lg sm:blur-xl"></div>
      <div className="absolute top-6 right-1/3 w-16 sm:w-24 h-16 sm:h-24 rounded-full bg-green-200 bg-opacity-20 blur-lg sm:blur-xl"></div>
    </header>
  );
}
