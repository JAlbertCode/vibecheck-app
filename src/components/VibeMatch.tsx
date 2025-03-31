import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import html2canvas from 'html2canvas';
import type { Frog, VibeMatch as VibeMatchType } from '../utils/supabase';

interface VibeMatchProps {
  myFrog: Frog;
  otherFrog: Frog;
  match: VibeMatchType;
}

export default function VibeMatch({ myFrog, otherFrog, match }: VibeMatchProps) {
  const matchCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Force re-render to ensure proper html2canvas capture
    const timer = setTimeout(() => {
      if (matchCardRef.current) {
        const parent = matchCardRef.current.parentElement;
        if (parent) {
          // This causes a re-flow which often helps html2canvas capture properly
          parent.style.display = 'none';
          setTimeout(() => {
            if (parent) parent.style.display = '';
          }, 10);
        }
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

  const handleDownload = async () => {
    if (!matchCardRef.current) return;
    
    try {
      const options = {
        backgroundColor: null,
        useCORS: true,
        allowTaint: true, 
        scale: 2, // Higher quality
        logging: true
      };
      
      const canvas = await html2canvas(matchCardRef.current, options);
      const image = canvas.toDataURL('image/png');
      
      const anchor = document.createElement('a');
      anchor.href = image;
      anchor.download = `vibecheck-${myFrog.name}-${otherFrog.name}.png`;
      anchor.click();
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to download match card. Please try again.');
    }
  };

  const handleCopyToClipboard = async () => {
    if (!matchCardRef.current) return;
    
    try {
      const options = {
        backgroundColor: null,
        useCORS: true, 
        allowTaint: true,
        scale: 2 // Higher quality
      };
      
      const canvas = await html2canvas(matchCardRef.current, options);
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          alert('Match card copied to clipboard!');
        } catch (error) {
          console.error('Error copying to clipboard:', error);
          alert('Failed to copy to clipboard. Try downloading instead.');
        }
      });
    } catch (error) {
      console.error('Error generating image for clipboard:', error);
      alert('Failed to copy to clipboard. Try downloading instead.');
    }
  };

  const handleShareOnTwitter = async () => {
    // Update the Twitter sharing text to be shorter and more engaging
    const text = `${myFrog.name} x ${otherFrog.name} = ${match.match_score}% vibe match! 🐸✨ Check out their collab potential on @lilypad_tech's VibeCheck`;
    const url = 'https://vibecheck.lilypad.tech'; // Replace with your actual URL
    
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
      '_blank'
    );
  };

  // Format contact links for display
  const getContactLink = (frog: Frog, type: string) => {
    const link = frog.contact_links[type];
    if (!link) return null;
    
    let icon = '🔗';
    let label = type.charAt(0).toUpperCase() + type.slice(1);
    
    if (type === 'twitter') icon = '🐦';
    if (type === 'linkedin') icon = '💼';
    if (type === 'email') icon = '📧';
    if (type === 'site') {
      icon = '🌐';
      label = 'Website';
    }
    if (type.startsWith('other_')) {
      icon = '🔗';
      label = 'Link';
    }
    
    return { icon, label, link };
  };

  const myContactLinks = Object.keys(myFrog.contact_links)
    .map(key => getContactLink(myFrog, key))
    .filter(link => link !== null);
    
  const otherContactLinks = Object.keys(otherFrog.contact_links)
    .map(key => getContactLink(otherFrog, key))
    .filter(link => link !== null);
    
  // Get shared tags between both frogs
  const sharedTagsSet = new Set([...myFrog.tags, ...otherFrog.tags]);
  const sharedTags = Array.from(sharedTagsSet).slice(0, 5);
  
  // For logo styling
  const logoSize = "w-12 h-12 md:w-14 md:h-14";

  return (
    <div className="max-w-3xl mx-auto">
      {/* Match Card (for download/sharing) */}
      <div 
        ref={matchCardRef} 
        className="bg-gradient-to-br from-white to-pond-light p-6 rounded-2xl shadow-lg border-2 border-lily-green overflow-hidden relative max-w-xl mx-auto"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-8 -left-8 w-24 h-24 rounded-full bg-lily-green opacity-10"></div>
          <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-lily-green opacity-10"></div>
          <div className="absolute top-1/4 right-10 w-4 h-4 rounded-full bg-lily-green opacity-20"></div>
          <div className="absolute bottom-1/4 left-10 w-6 h-6 rounded-full bg-lily-green opacity-20"></div>
        </div>
        
        {/* Header with company logos and Match Score */}
        <div className="flex flex-col items-center text-center mb-2">
          <div className="flex items-center gap-3 mb-3">
            <div className={`${logoSize} rounded-full overflow-hidden bg-white shadow ring-2 ring-lily-green flex items-center justify-center`}>
              <img 
                src={myFrog.logo_url} 
                alt={`${myFrog.name} logo`} 
                className="object-contain w-full h-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://via.placeholder.com/100/00cc88/ffffff?text=${myFrog.name.charAt(0)}`;
                }}
              />
            </div>
            
            <div className="bg-lily-green text-white text-3xl font-bold rounded-full w-16 h-16 flex items-center justify-center relative shadow-lg">
              <div className="absolute inset-0 rounded-full bg-white opacity-20 animate-pulse"></div>
              <span className="relative z-10">{match.match_score}%</span>
            </div>
            
            <div className={`${logoSize} rounded-full overflow-hidden bg-white shadow ring-2 ring-lily-green flex items-center justify-center`}>
              <img 
                src={otherFrog.logo_url} 
                alt={`${otherFrog.name} logo`} 
                className="object-contain w-full h-full"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://via.placeholder.com/100/00cc88/ffffff?text=${otherFrog.name.charAt(0)}`;
                }}
              />
            </div>
          </div>
          
          <div className="flex items-center justify-center text-pond-dark">
            <span className="font-medium text-lg">{myFrog.name}</span>
            <span className="mx-2 text-gray-400">+</span>
            <span className="font-medium text-lg">{otherFrog.name}</span>
          </div>
          
          <div className="mt-2 bg-pond-dark bg-opacity-10 px-4 py-1 rounded-full inline-block">
            <span className="text-lg font-medium text-pond-dark">{match.vibe_phrase || "Unique vibe synergy"}</span>
          </div>
          
          {/* Shared Tags */}
          <div className="flex flex-wrap gap-1 justify-center mt-3">
            {sharedTags.map((tag, i) => (
              <span key={i} className="text-xs bg-lily-green text-white px-2 py-1 rounded-full">{tag}</span>
            ))}
          </div>
        </div>
        
        {/* Content */}
        <div className="mt-4 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="text-md font-semibold text-pond-dark flex items-center mb-2">
            <span className="text-xl mr-2">✨</span>
            Collab Idea
          </h3>
          <p className="text-gray-700">{match.collab_idea || match.possibility_spark}</p>
        </div>
          
        <div className="mt-3 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <h3 className="text-md font-semibold text-pond-dark flex items-center mb-2">
            <span className="text-xl mr-2">👋</span>
            Connect Tip
          </h3>
          <p className="text-gray-700">{match.connect_tip || match.first_connect || (match.vibe_path && match.vibe_path[0])}</p>
          
          {/* Contact Info */}
          <div className="mt-3 flex flex-col sm:flex-row gap-2 sm:gap-4">
            <div className="flex-1">
              <h4 className="text-xs font-medium text-gray-500 mb-1">{myFrog.name}</h4>
              <div className="flex flex-wrap gap-1">
                {myContactLinks.slice(0, 3).map((link, index) => (
                  link && (
                    <a
                      key={index}
                      href={link.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs bg-lily-green bg-opacity-10 hover:bg-opacity-20 px-2 py-1 rounded-full"
                    >
                      <span className="mr-1">{link.icon}</span>
                      <span>{link.label}</span>
                    </a>
                  )
                ))}
              </div>
            </div>
            
            <div className="flex-1">
              <h4 className="text-xs font-medium text-gray-500 mb-1">{otherFrog.name}</h4>
              <div className="flex flex-wrap gap-1">
                {otherContactLinks.slice(0, 3).map((link, index) => (
                  link && (
                    <a
                      key={index}
                      href={link.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs bg-lily-green bg-opacity-10 hover:bg-opacity-20 px-2 py-1 rounded-full"
                    >
                      <span className="mr-1">{link.icon}</span>
                      <span>{link.label}</span>
                    </a>
                  )
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-4 text-center">
          <div className="inline-flex items-center text-xs bg-pond-dark bg-opacity-5 px-3 py-1.5 rounded-full">
            <span className="mr-1">🐸</span>
            <span className="text-gray-500">vibecheck.lilypad.tech</span>
          </div>
        </div>
      </div>
      
      {/* Share buttons */}
      <div className="mt-4 flex justify-center space-x-4">
        <motion.button
          onClick={handleDownload}
          className="px-4 py-2 bg-lily-green text-white font-medium rounded-full shadow hover:bg-opacity-90 focus:outline-none flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>📱</span><span>Save Image</span>
        </motion.button>
        
        <motion.button
          onClick={handleCopyToClipboard}
          className="px-4 py-2 bg-pond-dark text-white font-medium rounded-full shadow hover:bg-opacity-90 focus:outline-none flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>📋</span><span>Copy</span>
        </motion.button>
        
        <motion.button
          onClick={handleShareOnTwitter}
          className="px-4 py-2 bg-blue-400 text-white font-medium rounded-full shadow hover:bg-opacity-90 focus:outline-none flex items-center space-x-2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <span>🐦</span><span>Tweet</span>
        </motion.button>
      </div>
    </div>
  );
}
