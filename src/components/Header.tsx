import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

export default function Header() {
  const router = useRouter();
  const currentPath = router.pathname;
  
  return (
    <header className="bg-pond-dark py-4 mb-8">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center">
          <motion.span 
            className="text-2xl mr-2"
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatType: 'loop' }}
          >
            🐸
          </motion.span>
          <h1 className="text-xl font-bold text-white">VibeCheck</h1>
        </div>
        
        <nav className="flex space-x-6">
          <Link 
            href="/" 
            className="text-white hover:text-lily-green transition-colors"
          >
            VibeCheck
          </Link>
        </nav>
      </div>
    </header>
  );
}
