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

  const handleCheckVibes = () => {
    onClose();
    window.dispatchEvent(new CustomEvent('compare-with-frog', { detail: frog }));
  };

  const reflectionQuestions = [
    "What kind of thing would your community love to co-create?",
    "What types of vibes don't mix well with yours?",
    "What makes you feel connected to another community?"
  ];

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
          className="fixed inset-0 z-50 bg-black bg-opacity-50 overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <div className="flex justify-center items-start min-h-screen p-4">
            <motion.div
              className="card frog-details-bg w-full max-w-4xl my-12 p-6"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-pink-600">{frog.name}</h2>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">
                  ×
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="flex-shrink-0 flex items-center justify-center">
                  <div className="profile-picture-lg relative">
                    {(!logoImage || logoImage === '') ? (
                      <div className="emoji-placeholder">
                        <span className="text-4xl">
                          {["🐸", "🦋", "🪷", "🌿", "✨", "🌊", "🧩", "🎮", "🚀", "🔮", "🧠", "🎨", "🔧", "🌱", "🧪", "💫", "🪄", "🧬", "🪴", "🐙", "🦄", "🦎", "🐝", "🐬", "🐢", "🦚"][frog.name.charCodeAt(0) % 26]}
                        </span>
                      </div>
                    ) : (
                      <>
                        <div className="profile-picture-inner p-2">
                          <img
                            src={logoImage}
                            alt={`${frog.name} logo`}
                            className="object-contain w-full h-full"
                          />
                        </div>
                        {frog.image_url && (
                          <div className="frog-image-overlay">
                            <img
                              src={frog.image_url}
                              alt={`${frog.name} frog`}
                              className="object-cover w-full h-full rounded-full"
                            />
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-medium mb-2 text-pink-600">About</h3>
                  <p className="text-gray-700">{frog.bio}</p>

                  <div className="mt-4">
                    <h3 className="text-lg font-medium mb-2 text-pink-600">Vibe Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {frog.tags.map((tag, index) => (
                        <span key={index} className="tag-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3 text-pink-600">Reflections</h3>
                <div className="p-4 rounded-lg gradient-bg border border-pink-100 shadow-sm">
                  <div className="grid gap-4">
                    {frog.reflections.map((reflection, index) => (
                      <div key={index}>
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          {reflectionQuestions[index % reflectionQuestions.length]}
                        </p>
                        <div className="p-3 rounded-lg bg-white border border-pink-100 hover:border-pink-200 transition-all duration-200">
                          <p className="text-gray-700">{reflection}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium mb-3 text-pink-600">Connect</h3>
                <div className="flex flex-wrap gap-2">
                  <button onClick={handleCheckVibes} className="btn-primary flex items-center gap-1">
                    <span>✨</span>
                    <span>Check Vibes</span>
                  </button>
                  {contactLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary flex items-center gap-1"
                    >
                      <span>{link.icon}</span>
                      <span>{link.label}</span>
                    </a>
                  ))}
                </div>
              </div>

              {onEditFrog && (
                <div className="flex justify-center">
                  <button onClick={() => { onClose(); onEditFrog(frog); }} className="btn-primary">
                    Edit
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
