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
    const text = `Just found out ${myFrog.name} and ${otherFrog.name} have a ${match.match_score}% vibe match on @lilypad_tech's VibeCheck! 🐸\n\n"${match.summary}"\n\n#VibeCheck #Web3`;
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
        className="bg-white p-6 rounded-xl shadow-lg border-2 border-lily-green overflow-hidden"
      >
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-pond-dark">Vibe Match Results</h2>
            <div className="mt-1 flex items-center">
              <span className="text-3xl mr-2">🐸</span>
              <span className="font-medium">{myFrog.name}</span>
              <span className="mx-2 text-gray-400">x</span>
              <span className="font-medium">{otherFrog.name}</span>
              <span className="text-3xl ml-2">🐸</span>
            </div>
          </div>
          
          <div className="bg-lily-green text-white text-3xl font-bold rounded-full w-16 h-16 flex items-center justify-center">
            {match.match_score}%
          </div>
        </div>
        
        <div className="mt-6 flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-pond-dark mb-2">Vibe Summary</h3>
              <p className="text-gray-700">{match.summary}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-pond-dark mb-2">Possibility Spark</h3>
              <p className="text-gray-700">{match.possibility_spark}</p>
            </div>
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-pond-dark mb-2">The Vibe Path</h3>
            <ul className="space-y-2">
              {match.vibe_path.map((step, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-lily-green mr-2 font-bold">{index + 1}.</span>
                  <span className="text-gray-700">{step}</span>
                </li>
              ))}
            </ul>
            
            {contactLinks.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-500 mb-1">Connect with {otherFrog.name}</h4>
                <div className="flex flex-wrap gap-2">
                  {contactLinks.map((link, index) => (
                    link && (
                      <a
                        key={index}
                        href={link.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
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
        
        <div className="mt-6 text-center text-xs text-gray-400">
          Generated with VibeCheck by Lilypad 🐸 lilypad.tech
        </div>
      </div>
      
      {/* Share buttons */}
      <div className="mt-6 flex justify-center space-x-4">
        <motion.button
          onClick={handleDownload}
          className="px-4 py-2 bg-lily-green text-white font-medium rounded-md shadow-sm hover:bg-opacity-90 focus:outline-none"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Download PNG
        </motion.button>
        
        <motion.button
          onClick={handleCopyToClipboard}
          className="px-4 py-2 bg-pond-dark text-white font-medium rounded-md shadow-sm hover:bg-opacity-90 focus:outline-none"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Copy to Clipboard
        </motion.button>
        
        <motion.button
          onClick={handleShareOnTwitter}
          className="px-4 py-2 bg-blue-400 text-white font-medium rounded-md shadow-sm hover:bg-opacity-90 focus:outline-none"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Tweet
        </motion.button>
      </div>
    </div>
  );
}
