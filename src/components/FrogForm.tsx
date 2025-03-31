import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { VIBE_TAGS, REFLECTION_PROMPTS } from '../utils/constants';
import type { Frog } from '../utils/supabase';

interface FrogFormProps {
  onSubmit: (frogData: Omit<Frog, 'id' | 'image_url'>) => Promise<void>;
}

export default function FrogForm({ onSubmit }: FrogFormProps) {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedPrompts, setSelectedPrompts] = useState<string[]>([]);
  const [reflections, setReflections] = useState<Record<string, string>>({});
  const [contactLinks, setContactLinks] = useState<Record<string, string>>({
    twitter: '',
    site: '',
    email: '',
    farcaster: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else if (selectedTags.length < 5) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handlePromptToggle = (prompt: string) => {
    if (selectedPrompts.includes(prompt)) {
      setSelectedPrompts(selectedPrompts.filter(p => p !== prompt));
      const newReflections = { ...reflections };
      delete newReflections[prompt];
      setReflections(newReflections);
    } else if (selectedPrompts.length < 2) {
      setSelectedPrompts([...selectedPrompts, prompt]);
    }
  };

  const handleReflectionChange = (prompt: string, value: string) => {
    setReflections({ ...reflections, [prompt]: value });
  };

  const handleContactLinkChange = (key: string, value: string) => {
    setContactLinks({ ...contactLinks, [key]: value });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setLogoUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    // Validation
    if (!name || !bio || selectedTags.length === 0 || selectedPrompts.length !== 2) {
      alert('Please fill out all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const reflectionArray = selectedPrompts.map(prompt => reflections[prompt] || '');
      
      await onSubmit({
        name,
        bio,
        logo_url: logoUrl,
        tags: selectedTags,
        reflections: reflectionArray,
        contact_links: contactLinks
      });
      
      // Reset form
      setName('');
      setBio('');
      setLogoUrl('');
      setLogoFile(null);
      setSelectedTags([]);
      setSelectedPrompts([]);
      setReflections({});
      setContactLinks({
        twitter: '',
        site: '',
        email: '',
        farcaster: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Failed to create your frog. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg"
    >
      <h2 className="text-2xl font-bold text-pond-dark mb-6">Create Your Vibe Profile</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Community Info */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Community Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-lily-green focus:border-lily-green"
            required
          />
        </div>
        
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
            Bio <span className="text-red-500">*</span>
          </label>
          <textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-lily-green focus:border-lily-green"
            required
          />
        </div>
        
        <div>
          <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-1">
            Upload Logo <span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            id="logo"
            accept="image/*"
            onChange={handleLogoChange}
            className="w-full"
            required
          />
          {logoUrl && (
            <div className="mt-2">
              <img src={logoUrl} alt="Logo preview" className="h-20 w-20 object-contain border rounded" />
            </div>
          )}
        </div>
        
        {/* Vibe Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select 5 Vibe Tags <span className="text-red-500">*</span> ({selectedTags.length}/5)
          </label>
          <div className="flex flex-wrap gap-2">
            {VIBE_TAGS.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-lily-green text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } ${selectedTags.length >= 5 && !selectedTags.includes(tag) ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => handleTagToggle(tag)}
                disabled={selectedTags.length >= 5 && !selectedTags.includes(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        
        {/* Reflection Questions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Answer 2 Reflection Questions <span className="text-red-500">*</span> ({selectedPrompts.length}/2)
          </label>
          <div className="space-y-4">
            {REFLECTION_PROMPTS.map((prompt) => (
              <div key={prompt} className="border rounded-lg p-4">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id={`prompt-${prompt}`}
                    checked={selectedPrompts.includes(prompt)}
                    onChange={() => handlePromptToggle(prompt)}
                    className="mt-1 mr-2"
                    disabled={selectedPrompts.length >= 2 && !selectedPrompts.includes(prompt)}
                  />
                  <label htmlFor={`prompt-${prompt}`} className="text-sm font-medium">{prompt}</label>
                </div>
                
                {selectedPrompts.includes(prompt) && (
                  <textarea
                    value={reflections[prompt] || ''}
                    onChange={(e) => handleReflectionChange(prompt, e.target.value)}
                    rows={2}
                    className="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-lily-green focus:border-lily-green"
                    required
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* Contact Links */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Contact Links
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="twitter" className="block text-xs text-gray-500 mb-1">Twitter</label>
              <input
                type="url"
                id="twitter"
                value={contactLinks.twitter}
                onChange={(e) => handleContactLinkChange('twitter', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-lily-green focus:border-lily-green"
                placeholder="https://twitter.com/..."
              />
            </div>
            
            <div>
              <label htmlFor="website" className="block text-xs text-gray-500 mb-1">Website</label>
              <input
                type="url"
                id="website"
                value={contactLinks.site}
                onChange={(e) => handleContactLinkChange('site', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-lily-green focus:border-lily-green"
                placeholder="https://..."
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-xs text-gray-500 mb-1">Email</label>
              <input
                type="email"
                id="email"
                value={contactLinks.email}
                onChange={(e) => handleContactLinkChange('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-lily-green focus:border-lily-green"
                placeholder="hello@..."
              />
            </div>
            
            <div>
              <label htmlFor="farcaster" className="block text-xs text-gray-500 mb-1">Farcaster</label>
              <input
                type="url"
                id="farcaster"
                value={contactLinks.farcaster}
                onChange={(e) => handleContactLinkChange('farcaster', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-lily-green focus:border-lily-green"
                placeholder="https://warpcast.com/..."
              />
            </div>
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end">
          <motion.button
            type="submit"
            className="px-6 py-2 bg-lily-green text-white font-medium rounded-md shadow-sm hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lily-green disabled:opacity-50"
            disabled={isSubmitting}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            {isSubmitting ? 'Creating...' : 'Create Your Frog'}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}
