import React, { useEffect, useState } from 'react';
import { getDefaultImage } from '../utils/defaultImages';
import { motion, AnimatePresence } from 'framer-motion';
import type { Frog } from '../utils/supabase';

interface FrogDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  frog: Frog | null;
  onEditFrog?: (frog: Frog) => void;
  onSelectFrog?: (frog: Frog) => void;
}

export default function FrogDetails({ isOpen, onClose, frog, onEditFrog, onSelectFrog }: FrogDetailsProps) {
  const [mounted, setMounted] = useState(false);
  const [logoImage, setLogoImage] = useState<string>('');

  useEffect(() => {
    setMounted(true);
    if (frog) {
      if (!frog.logo_url || frog.logo_url.includes('placeholder.com')) {
        setLogoImage(getDefaultImage(frog.name));
      } else {
        setLogoImage(frog.logo_url);
      }
    }
  }, [frog]);

  if (!frog || !mounted) return null;
  
  // Add detailed debugging
  console.log('Frog image_url:', frog.image_url);
  console.log('Frog logo_url:', frog.logo_url);
  console.log('Condition check:', {
    hasImageUrl: !!frog.image_url,
    imageUrlNotEmpty: frog.image_url !== '',
    fullCondition: frog.image_url && frog.image_url !== ''
  });
  
  // Handle checking vibes
  const handleCheckVibes = () => {
    onClose();
    
    // If a select handler is provided, use that first
    if (onSelectFrog) {
      // Dispatch a custom event to trigger comparison with this frog
      window.dispatchEvent(new CustomEvent('compare-with-frog', { detail: frog }));
    } else {
      // Dispatch a custom event as fallback
      window.dispatchEvent(new CustomEvent('compare-with-frog', { detail: frog }));
    }
  };

  // Format reflection questions
  const reflectionQuestions = [
    "What kind of thing would your community love to co-create?",
    "What types of vibes don't mix well with yours?",
    "What makes you feel connected to another community?"
  ];

  // Get contact links
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

  const contactLinks = Object.keys(frog.contact_links)
    .map(key => getContactLink(frog, key))
    .filter(link => link !== null);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with close button */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-pond-dark">{frog.name}</h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 text-xl"
              >
                ×
              </button>
            </div>
            
            {/* Community image and bio */}
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-shrink-0 flex items-center justify-center">
                <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-lily-green relative">
                  {(!logoImage || logoImage === '') ? (
                    <div className="w-full h-full bg-gradient-to-br from-lily-green to-blue-400 flex items-center justify-center text-white text-4xl font-bold">
                      <span className="text-4xl">
                        {["🐸", "🦋", "🪷", "🌿", "✨", "🌊", "🧩", "🎮", "🚀", "🔮", "🧠", "🎨", "🔧", "🌱", "🧪", "💫", "🪄", "🧬", "🪴", "🐙", "🦄", "🦎", "🐝", "🐬", "🐢", "🦚"][frog.name.charCodeAt(0) % 26]}
                      </span>
                    </div>
                  ) : (
                    <>
                      <div className="w-full h-full p-2 bg-gradient-to-br from-lily-green to-blue-400">
                        <img
                          src={logoImage}
                          alt={`${frog.name} logo`}
                          className="w-full h-full object-contain"
                        />
                      </div>
                      {/* Main image overlay only when we have a logo */}
                      {frog.image_url && frog.image_url !== '' && (
                        <div className="absolute -bottom-4 -right-1 w-14 h-14 rounded-full bg-gradient-to-br from-lily-green to-blue-400 p-1 border-2 border-lily-green shadow">
                          <img
                            src={frog.image_url}
                            alt={`${frog.name} frog`}
                            className="w-full h-full object-cover rounded-full"
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-medium mb-2">About</h3>
                <p className="text-gray-700">{frog.bio}</p>
                
                <div className="mt-4">
                  <h3 className="text-lg font-medium mb-2">Vibe Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {frog.tags.map((tag, index) => (
                      <span key={index} className="bg-lily-green text-white px-3 py-1 rounded-full text-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Reflections */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3">Reflections</h3>
              <div className="space-y-4">
                {frog.reflections.map((reflection, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium text-pond-dark mb-2">
                      {reflectionQuestions[index % reflectionQuestions.length]}
                    </p>
                    <p className="text-gray-700">{reflection}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Contact Links */}
            <div>
              <h3 className="text-lg font-medium mb-3">Connect</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={handleCheckVibes}
                  className="flex items-center gap-1 px-3 py-1.5 bg-lily-green text-white hover:bg-opacity-90 rounded-full transition-colors"
                >
                  <span>✨</span>
                  <span>Check Vibes</span>
                </button>
                {contactLinks.map((link, index) => (
                  link && (
                    <a
                      key={index}
                      href={link.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 text-gray-700 hover:bg-lily-green hover:text-white rounded-full transition-colors"
                    >
                      <span>{link.icon}</span>
                      <span>{link.label}</span>
                    </a>
                  )
                ))}
              </div>
            </div>
            
            {/* Footer with edit button */}
            {onEditFrog && (
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() => {
                    onClose();
                    onEditFrog(frog);
                  }}
                  className="px-6 py-2 border border-lily-green text-lily-green font-medium rounded-full hover:bg-lily-green hover:text-white focus:outline-none transition-colors"
                >
                  Edit
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}