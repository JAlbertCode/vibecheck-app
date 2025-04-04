import React, { useState } from 'react';
import { VIBE_TAGS } from '../utils/constants';
import type { Frog } from '../utils/supabase';

interface FrogFormProps {
  onSubmit: (frogData: Omit<Frog, 'id' | 'image_url'>) => Promise<void>;
  initialData?: Frog | null;
}

export default function FrogForm({ onSubmit, initialData }: FrogFormProps) {
  const [name, setName] = useState(initialData?.name || '');
  const [bio, setBio] = useState(initialData?.bio || '');
  const [logoUrl, setLogoUrl] = useState(initialData?.logo_url || '');
  const [logoFile, setLogoFile] = useState<File | null>(null);
  // Initialize state for selected tags, ensuring compatibility with older tag data
  const [selectedTags, setSelectedTags] = useState<string[]>(() => {
    if (!initialData?.tags) return [];
    
    // Filter out any tags that might not be in the current VIBE_TAGS list
    // This prevents issues with older tags that might have been renamed or removed
    return initialData.tags.filter(tag => VIBE_TAGS.includes(tag));
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reflection Questions (from the spec)
  const reflectionQuestions = [
    "What kind of thing would your community love to co-create?",
    "What types of vibes don't mix well with yours?",
    "What makes you feel connected to another community?",
    "What's your community's superpower?",
    "What's your community's biggest challenge?"
  ];
  
  // Set initial reflections from existing data
  const [reflections, setReflections] = useState<string[]>(
    initialData?.reflections || Array(5).fill('')
  );
  
  // Social links
  const [otherLinks, setOtherLinks] = useState('');
  const [linkedinHandle, setLinkedinHandle] = useState(initialData?.contact_links?.linkedin || '');
  const [contactLinks, setContactLinks] = useState<Record<string, string>>(
    initialData?.contact_links ? 
    // Convert any undefined values to empty strings
    Object.fromEntries(
      Object.entries(initialData.contact_links).map(([key, value]) => 
        [key, value || '']
      )
    ) : {
      twitter: '',
      site: '',
      linkedin: ''
    }
  );

  const handleTagToggle = (tag: string) => {
    console.log('Current tags:', selectedTags); // Debug logging
    
    // If the tag is already selected, remove it
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
      console.log('Removed tag:', tag);
    } 
    // If we have less than 5 tags or if we're editing a profile with 5+ tags,
    // allow adding the tag
    else if (selectedTags.length < 5 || (initialData?.tags && initialData.tags.length >= 5)) {
      // If we're at exactly 5 and this is an edit with initially more than 5 tags,
      // we need to replace one of them
      if (selectedTags.length >= 5) {
        // Remove the last tag and add the new one
        const newTags = [...selectedTags];
        newTags.pop();
        newTags.push(tag);
        setSelectedTags(newTags);
        console.log('Replaced last tag with:', tag);
      } else {
        // Otherwise just add the tag
        setSelectedTags([...selectedTags, tag]);
        console.log('Added tag:', tag);
      }
    }
  };
  
  // Removed handleTwitterHandleChange as we're now using handleContactLinkChange directly
  
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
    if (!name || !bio || selectedTags.length === 0) {
      alert('Please fill out all required fields (Community Name, Bio, and Vibe Tags)');
      return;
    }
    
    // Filter out empty reflections
    const nonEmptyReflections = reflections.filter(r => r.trim());
    
    // Default logo URL if none provided
    const finalLogoUrl = logoUrl || `https://via.placeholder.com/100/00cc88/ffffff?text=${name.charAt(0)}`;
    
    setIsSubmitting(true);
    
    try {
      await onSubmit({
        name,
        bio,
        logo_url: finalLogoUrl,
        tags: selectedTags,
        reflections: nonEmptyReflections,
        contact_links: contactLinks
      });
      
      // Reset form
      setName('');
      setBio('');
      setLogoUrl('');
      setLogoFile(null);
      setSelectedTags([]);
      setReflections(Array(5).fill(''));
      setLinkedinHandle('');
      setOtherLinks('');
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
    <div
      className="max-w-2xl mx-auto p-3 sm:p-6 bg-white rounded-xl shadow-lg"
    >
      <h2 className="text-2xl font-bold mb-2">{initialData ? 'Edit Community Profile' : 'Create Your Vibe Profile'}</h2>
      <p className="text-gray-500 mb-6">Tell us about your community's vibe so we can match you with others! 🌟<br/>
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
          className="w-full px-4 py-2.5 border border-pink-200 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-pink-300 focus:border-transparent"
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
          <div className="flex items-center space-x-4">
            <label className="relative cursor-pointer flex flex-col items-center justify-center w-24 h-24 p-2 rounded-xl bg-gradient-to-r from-pink-50 to-purple-50 border-2 border-dashed border-pink-200 hover:border-pink-300 transition-colors duration-200 shadow-sm overflow-hidden group">
              <div className="absolute inset-0 bg-white bg-opacity-50 group-hover:bg-opacity-30 transition-opacity duration-200"></div>
              <div className="absolute -bottom-1 -right-1 w-12 h-12 bg-pink-100 rounded-full opacity-40 blur-md"></div>
              <span className="text-3xl mb-1 z-10">📷</span>
              <span className="text-xs text-center font-medium text-pink-600 z-10">Upload Logo</span>
              <input
                type="file"
                id="logo"
                accept="image/*"
                onChange={handleLogoChange}
                className="sr-only"
              />
            </label>
            
            {logoUrl && (
              <div className="flex-shrink-0 relative">
                <div className="w-24 h-24 rounded-xl overflow-hidden border-2 border-pink-200 shadow-md bg-gradient-to-br from-pink-50 to-purple-50">
                  <img src={logoUrl} alt="Logo preview" className="w-full h-full object-contain p-2" />
                </div>
                <button 
                  type="button"
                  onClick={() => setLogoUrl('')}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-pink-50 transition-colors"
                >
                  <span className="text-pink-500 text-xs">&times;</span>
                </button>
              </div>
            )}
          </div>
        </div>
        
        {/* Vibe Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Your Vibe Tags <span className="text-red-500">*</span> ({selectedTags.length}/5)
          </label>
          <div className="flex flex-wrap gap-2">
            {VIBE_TAGS.map((tag) => {
              // Check if selected  
              const isSelected = selectedTags.includes(tag);
              // Only disable if not selected AND we're at 5 tags AND this is not an edit of a profile that had 5+ tags
              const isDisabled = !isSelected && selectedTags.length >= 5 && !(initialData?.tags && initialData.tags.length >= 5);
              
              return (
                <button
                  key={tag}
                  type="button"
                  className={`px-3 py-1.5 text-sm rounded-full shadow-sm transition-all duration-200 ${isSelected 
                    ? 'bg-gradient-to-r from-pink-50 to-purple-50 text-pink-600 font-medium border border-pink-200' 
                    : 'bg-white border border-pink-100 text-gray-700 hover:border-pink-200 hover:shadow'} 
                   ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => handleTagToggle(tag)}
                  disabled={isDisabled}
                >
                  {isSelected && <span className="mr-1">✨</span>}
                  {tag}
                </button>
              );
            })}
          </div>
        </div>
        
        {/* Reflection Questions */}
        <div>
          <div className="flex items-center mb-3">
            <label className="block text-sm font-medium text-gray-700">
              Reflection Questions (Optional)
            </label>
            <span className="text-xs text-gray-500 ml-2">Share your community's thoughts</span>
          </div>
          
          <div className="p-4 rounded-lg bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-100 shadow-sm mb-4">
            <div className="grid gap-3">
              {reflectionQuestions.map((question, i) => (
                <div 
                  key={i}
                  className="p-3 rounded-lg bg-white border border-pink-100 hover:border-pink-200 transition-all duration-200"
                >
                  <h5 className="text-sm font-medium text-gray-700 mb-2">{question}</h5>
                  <textarea
                    value={reflections[i]}
                    onChange={(e) => setReflections(prev => {
                      const updatedReflections = [...prev];
                      updatedReflections[i] = e.target.value;
                      return updatedReflections;
                    })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-lily-green focus:border-lily-green"
                    placeholder="Share your thoughts..."
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Contact Links - All in one section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How can others reach you?
          </label>
          <div className="space-y-4 bg-gradient-to-r from-pink-50 to-purple-50 p-5 rounded-lg border border-pink-100 shadow-sm">
            <div>
              <label htmlFor="contactTwitter" className="flex items-center text-xs text-gray-500 mb-1">
                <span className="mr-1">🐦</span> Twitter
              </label>
              <input
                type="url"
                id="contactTwitter"
                value={contactLinks.twitter}
                onChange={(e) => handleContactLinkChange('twitter', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-lily-green focus:border-lily-green"
                placeholder="https://twitter.com/your_community"
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
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => window.location.href = '/'}
            className="px-4 py-2 text-purple-500 hover:text-pink-500 transition-colors flex items-center"
          >
            <span className="mr-1">←</span>
            <span>Back to Pond</span>
          </button>
          
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-pink-50 to-purple-50 text-pink-600 font-medium rounded-full shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-200 disabled:opacity-50 flex items-center"
            disabled={isSubmitting}
          >
            <span className="mr-2">{isSubmitting ? '⏳ Saving...' : initialData ? '💾 Save Changes' : '✨ Create Community'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}