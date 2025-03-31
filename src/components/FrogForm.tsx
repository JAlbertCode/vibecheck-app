import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { VIBE_TAGS } from '../utils/constants';
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
  const [secretSauce, setSecretSauce] = useState('');
  const [otherLinks, setOtherLinks] = useState('');
  const [twitterHandle, setTwitterHandle] = useState('');
  const [linkedinHandle, setLinkedinHandle] = useState('');
  const [contactLinks, setContactLinks] = useState<Record<string, string>>({
    twitter: '',
    site: '',
    linkedin: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleTagToggle = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else if (selectedTags.length < 5) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleTwitterHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Strip @ if user entered it
    const handle = e.target.value.replace('@', '');
    setTwitterHandle(handle);
  };
  
  const handleLinkedinHandleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLinkedinHandle(e.target.value);
  };
  
  const handleOtherLinksChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setOtherLinks(e.target.value);
  };

  const handleContactLinkChange = (key: string, value: string) => {
    // For Twitter, automatically format the URL if they just entered the handle
    if (key === 'twitter' && value && !value.includes('http')) {
      // Strip @ if included
      const handle = value.replace('@', '');
      value = `https://twitter.com/${handle}`;
    }
    
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
    if (!name || !bio || selectedTags.length === 0 || !secretSauce) {
      alert('Please fill out all required fields (Community Name, Bio, Vibe Tags, and Secret Sauce)');
      return;
    }
    
    // Update Twitter handle if provided
    if (twitterHandle && !contactLinks.twitter) {
      handleContactLinkChange('twitter', twitterHandle);
    }
    
    // Update LinkedIn handle if provided
    if (linkedinHandle && !contactLinks.linkedin) {
      handleContactLinkChange('linkedin', linkedinHandle.includes('linkedin.com') ? 
        linkedinHandle : `https://linkedin.com/company/${linkedinHandle}`);
    }
    
    // Update other links if provided
    if (otherLinks) {
      // Split by line breaks and add each link to contactLinks
      const links = otherLinks.split('\n').filter(link => link.trim());
      links.forEach((link, index) => {
        if (link.trim()) {
          handleContactLinkChange(`other_${index}`, link.trim());
        }
      });
    }
    
    // Default logo URL if none provided
    const finalLogoUrl = logoUrl || `https://via.placeholder.com/100/00cc88/ffffff?text=${name.charAt(0)}`;
    
    setIsSubmitting(true);
    
    try {
      await onSubmit({
        name,
        bio,
        logo_url: finalLogoUrl,
        tags: selectedTags,
        reflections: [secretSauce],
        contact_links: contactLinks
      });
      
      // Reset form
      setName('');
      setBio('');
      setLogoUrl('');
      setLogoFile(null);
      setSelectedTags([]);
      setSecretSauce('');
      setLinkedinHandle('');
      setOtherLinks('');
      setTwitterHandle('');
      setContactLinks({
        twitter: '',
        site: '',
        linkedin: ''
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
      <h2 className="text-2xl font-bold text-pond-dark mb-2">Create Your Vibe Profile</h2>
      <p className="text-gray-500 mb-6">Tell us about your community's vibe so we can match you with others! 🐸<br/>
        <span className="text-xs">Anyone can edit profiles - this is like a Wiki for Web3 communities.</span></p>
      
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
            Upload Logo (Optional)
          </label>
          <input
            type="file"
            id="logo"
            accept="image/*"
            onChange={handleLogoChange}
            className="w-full"
          />
          {logoUrl && (
            <div className="mt-2">
              <img src={logoUrl} alt="Logo preview" className="h-20 w-20 object-contain border rounded" />
            </div>
          )}
        </div>
        
        {/* Twitter Handle (for easier vibe sourcing) */}
        <div>
          <label htmlFor="twitter" className="block text-sm font-medium text-gray-700 mb-1">
            Twitter Handle (Optional)
          </label>
          <div className="flex items-center">
            <span className="text-gray-500 mr-2">@</span>
            <input
              type="text"
              id="twitter"
              value={twitterHandle}
              onChange={handleTwitterHandleChange}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-lily-green focus:border-lily-green"
              placeholder="your_community"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">We'll use this to help understand your vibe</p>
        </div>
        
        {/* Vibe Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Your Vibe Tags <span className="text-red-500">*</span> ({selectedTags.length}/5)
          </label>
          <div className="flex flex-wrap gap-2">
            {VIBE_TAGS.map((tag) => (
              <motion.button
                key={tag}
                type="button"
                className={`px-3 py-1 text-sm rounded-full transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-lily-green text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                } ${selectedTags.length >= 5 && !selectedTags.includes(tag) ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => handleTagToggle(tag)}
                disabled={selectedTags.length >= 5 && !selectedTags.includes(tag)}
                whileHover={{ scale: selectedTags.includes(tag) || selectedTags.length < 5 ? 1.05 : 1 }}
                whileTap={{ scale: 0.95 }}
              >
                {tag}
              </motion.button>
            ))}
          </div>
        </div>
        
        {/* Secret Sauce Question */}
        <div>
          <label htmlFor="secretSauce" className="block text-sm font-medium text-gray-700 mb-1">
            What's your community's secret sauce? <span className="text-red-500">*</span>
          </label>
          <textarea
            id="secretSauce"
            value={secretSauce}
            onChange={(e) => setSecretSauce(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-lily-green focus:border-lily-green"
            placeholder="Tell us what makes your community special..."
            required
          />
          <p className="text-xs text-gray-500 mt-1">This helps us match you with communities that complement your vibe</p>
        </div>
        
        {/* Contact Links */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How can others reach you?
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="contactTwitter" className="flex items-center text-xs text-gray-500 mb-1">
                <span className="mr-1">🐦</span> Twitter
              </label>
              <input
                type="text"
                id="contactTwitter"
                value={contactLinks.twitter}
                onChange={(e) => handleContactLinkChange('twitter', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-lily-green focus:border-lily-green"
                placeholder="@your_community"
              />
            </div>
            
            <div>
              <label htmlFor="contactLinkedin" className="flex items-center text-xs text-gray-500 mb-1">
                <span className="mr-1">💼</span> LinkedIn
              </label>
              <input
                type="text"
                id="contactLinkedin"
                value={linkedinHandle}
                onChange={handleLinkedinHandleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-lily-green focus:border-lily-green"
                placeholder="company/your-company"
              />
            </div>
            
            <div>
              <label htmlFor="website" className="flex items-center text-xs text-gray-500 mb-1">
                <span className="mr-1">🌐</span> Website
              </label>
              <input
                type="url"
                id="website"
                value={contactLinks.site}
                onChange={(e) => handleContactLinkChange('site', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-lily-green focus:border-lily-green"
                placeholder="https://..."
              />
            </div>
            
            <div className="md:col-span-2">
              <label htmlFor="otherLinks" className="flex items-center text-xs text-gray-500 mb-1">
                <span className="mr-1">🔗</span> Other links (one per line)
              </label>
              <textarea
                id="otherLinks"
                value={otherLinks}
                onChange={handleOtherLinksChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-lily-green focus:border-lily-green"
                placeholder="https://github.com/your-org&#10;https://discord.gg/your-server"
              />
            </div>
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="flex justify-end">
          <motion.button
            type="submit"
            className="px-6 py-3 bg-lily-green text-white font-medium rounded-md shadow-lg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lily-green disabled:opacity-50 flex items-center"
            disabled={isSubmitting}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="mr-2">{isSubmitting ? '🐸 Creating...' : '🐸 Create Your Frog'}</span>
            {!isSubmitting && <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">Ribbit!</span>}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}
