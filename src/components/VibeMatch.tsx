import React, { useRef } from 'react';
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

  const handleDownload = async () => {
    if (!matchCardRef.current) return;
    
    try {
      const canvas = await html2canvas(matchCardRef.current);
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
      const canvas = await html2canvas(matchCardRef.current);
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
    // Update the Twitter sharing text to use the new fields
    const text = `Just found out ${myFrog.name} and ${otherFrog.name} have a ${match.match_score}% vibe match on @lilypad_tech's VibeCheck! 🐸\n\n"${match.vibe_phrase || match.summary}"\n\n#VibeCheck #Web3`;
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
    if (type === 'farcaster') icon = '✨';
    if (type === 'email') icon = '📧';
    if (type === 'site') {
      icon = '🌐';
      label = 'Website';
    }
    
    return { icon, label, link };
  };

  const contactLinks = Object.keys(otherFrog.contact_links)
    .map(key => getContactLink(otherFrog, key))
    .filter(link => link !== null);

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
        
        {/* Header with Match Score */}
        <div className="flex flex-col items-center text-center mb-4">
          <div className="bg-lily-green text-white text-3xl font-bold rounded-full w-20 h-20 flex items-center justify-center relative shadow-lg mb-3">
            <div className="absolute inset-0 rounded-full bg-white opacity-20 animate-pulse"></div>
            <span className="relative z-10">{match.match_score}%</span>
          </div>
          
          <div className="flex items-center justify-center text-pond-dark">
            <span className="text-3xl mr-2">🐸</span>
            <span className="font-medium text-lg">{myFrog.name}</span>
            <span className="mx-2 text-gray-400">+</span>
            <span className="font-medium text-lg">{otherFrog.name}</span>
            <span className="text-3xl ml-2">🐸</span>
          </div>
          
          <div className="mt-2 bg-pond-dark bg-opacity-10 px-4 py-1 rounded-full inline-block">
            <span className="text-lg font-medium text-pond-dark">{match.vibe_phrase || "Unique vibe synergy"}</span>
          </div>
        </div>
        
        {/* Content Cards */}
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h3 className="text-md font-semibold text-pond-dark flex items-center mb-2">
              <span className="text-xl mr-2">✨</span>
              Collab Idea
            </h3>
            <p className="text-gray-700">{match.collab_idea || match.possibility_spark}</p>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h3 className="text-md font-semibold text-pond-dark flex items-center mb-2">
              <span className="text-xl mr-2">💬</span>
              Hang Spots
            </h3>
            <p className="text-gray-700">{match.hang_spots || match.summary}</p>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h3 className="text-md font-semibold text-pond-dark flex items-center mb-2">
              <span className="text-xl mr-2">👋</span>
              First Connect
            </h3>
            <p className="text-gray-700">{match.first_connect || (match.vibe_path && match.vibe_path[0])}</p>
            
            {contactLinks.length > 0 && (
              <div className="mt-3">
                <div className="flex flex-wrap gap-2">
                  {contactLinks.map((link, index) => (
                    link && (
                      <a
                        key={index}
                        href={link.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-xs bg-lily-green bg-opacity-10 hover:bg-opacity-20 px-3 py-1.5 rounded-full"
                      >
                        <span className="mr-1">{link.icon}</span>
                        <span>{link.label}</span>
                      </a>
                    )
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-4 text-center">
          <div className="inline-flex items-center text-xs bg-pond-dark bg-opacity-5 px-3 py-1.5 rounded-full">
            <span className="mr-1">🐸</span>
            <span className="text-gray-500">VibeCheck by Lilypad</span>
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
