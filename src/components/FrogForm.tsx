import React, { useState } from 'react';
import { motion } from 'framer-motion';
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
  const [selectedTags, setSelectedTags] = useState<string[]>(initialData?.tags || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Vibe Questions (for more thoughtful matching)
  const reflectionQuestions = [
    "What kind of thing would your community love to co-create?",
    "What types of vibes don't mix well with yours?",
    "What makes you feel connected to another community?"
  ];
  
  // Set initial reflections from existing data
  const [reflections, setReflections] = useState<string[]>(
    initialData?.reflections && initialData.reflections.length > 0 
      ? initialData.reflections
      : ['']
  );
  
  // Selected reflection questions
  const [selectedQuestions, setSelectedQuestions] = useState<number[]>(
    reflections.map((_, index) => index % reflectionQuestions.length)
  );

  // Social links
  const [otherLinks, setOtherLinks] = useState('');
  const [twitterHandle, setTwitterHandle] = useState(
    initialData?.contact_links?.twitter 
      ? initialData.contact_links.twitter.replace('https://twitter.com/', '') 
      : ''
  );
  const [linkedinHandle, setLinkedinHandle] = useState(initialData?.contact_links?.linkedin || '');
  const [contactLinks, setContactLinks] = useState<Record<string, string>>(
    initialData?.contact_links || {
      twitter: '',
      site: '',
      linkedin: ''
    }
  );

  // Add a new reflection with a random question
  const addReflection = () => {
    if (reflections.length < 3) {
      // Choose a random question that hasn't been selected yet
      const availableQuestions = reflectionQuestions
        .map((_, index) => index)
        .filter(index => !selectedQuestions.includes(index));
      
      const newQuestionIndex = availableQuestions.length > 0
        ? availableQuestions[Math.floor(Math.random() * availableQuestions.length)]
        : Math.floor(Math.random() * reflectionQuestions.length);
      
      setReflections([...reflections, '']);
      setSelectedQuestions([...selectedQuestions, newQuestionIndex]);
    }
  };
  
  // Update a reflection at a specific index
  const updateReflection = (index: number, value: string) => {
    const updatedReflections = [...reflections];
    updatedReflections[index] = value;
    setReflections(updatedReflections);
  };
  
  // Remove a reflection at a specific index
  const removeReflection = (index: number) => {
    if (reflections.length > 1) {
      const updatedReflections = [...reflections];
      updatedReflections.splice(index, 1);
      setReflections(updatedReflections);
      
      const updatedQuestions = [...selectedQuestions];
      updatedQuestions.splice(index, 1);
      setSelectedQuestions(updatedQuestions);
    }
  };
  
  // Change the question for a specific reflection
  const changeQuestion = (index: number) => {
    const updatedQuestions = [...selectedQuestions];
    updatedQuestions[index] = (updatedQuestions[index] + 1) % reflectionQuestions.length;
    setSelectedQuestions(updatedQuestions);
  };

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
    if (!name || !bio || selectedTags.length === 0 || reflections.some(r => !r.trim())) {
      alert('Please fill out all required fields (Community Name, Bio, Vibe Tags, and Reflection Questions)');
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
        reflections: reflections.filter(r => r.trim()),
        contact_links: contactLinks
      });
      
      // Reset form
      setName('');
      setBio('');
      setLogoUrl('');
      setLogoFile(null);
      setSelectedTags([]);
      setReflections(['']);
      setSelectedQuestions([0]);
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
      <h2 className="text-2xl font-bold mb-2">{initialData ? 'Edit Community Profile' : 'Create Your Vibe Profile'}</h2>
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
        
        {/* Reflection Questions */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Reflection Questions <span className="text-red-500">*</span>
            </label>
            {reflections.length < 3 && (
              <button
                type="button"
                onClick={addReflection}
                className="text-sm text-lily-green hover:underline flex items-center"
              >
                <span className="mr-1">+</span> Add Question
              </button>
            )}
          </div>
          
          <div className="space-y-4">
            {reflections.length < 2 && (
              <div className="bg-gray-50 p-3 rounded-lg mb-3">
                <h4 className="text-sm font-medium mb-2">Choose reflection questions:</h4>
                <div className="space-y-2">
                  {reflectionQuestions.map((question, i) => (
                    <div
                      key={i}
                      className="p-2 rounded border border-gray-200 hover:border-lily-green cursor-pointer transition-colors"
                      onClick={() => {
                        const updatedQuestions = [...selectedQuestions];
                        updatedQuestions[0] = i;
                        setSelectedQuestions(updatedQuestions);
                      }}
                    >
                      <p className={`text-sm ${selectedQuestions[0] === i ? 'font-semibold text-lily-green' : 'text-gray-700'}`}>
                        {selectedQuestions[0] === i && '✓ '}{question}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {reflections.map((reflection, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-lg">
                <div className="flex justify-between mb-2">
                  <button
                    type="button"
                    onClick={() => changeQuestion(index)}
                    className="text-sm text-lily-green hover:underline flex items-center"
                  >
                    <span className="mr-1">🔄</span> {reflectionQuestions[selectedQuestions[index]]}
                  </button>
                  
                  {reflections.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeReflection(index)}
                      className="text-sm text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>
                
                <textarea
                  value={reflection}
                  onChange={(e) => updateReflection(index, e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-lily-green focus:border-lily-green"
                  placeholder="Share your thoughts..."
                  required
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Contact Links - All in one section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            How can others reach you?
          </label>
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
            <div>
              <label htmlFor="contactTwitter" className="flex items-center text-xs text-gray-500 mb-1">
                <span className="mr-1">🐦</span> Twitter
              </label>
              <div className="flex items-center">
                <span className="text-gray-500 mr-2">@</span>
                <input
                  type="text"
                  id="contactTwitter"
                  value={twitterHandle}
                  onChange={handleTwitterHandleChange}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-lily-green focus:border-lily-green"
                  placeholder="your_community"
                />
              </div>
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
            className="px-4 py-2 text-gray-600 hover:text-lily-green transition-colors"
          >
            ← Back to Pond
          </button>
          
          <motion.button
            type="submit"
            className="px-6 py-3 bg-lily-green text-white font-medium rounded-md shadow-lg hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lily-green disabled:opacity-50 flex items-center"
            disabled={isSubmitting}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="mr-2">{isSubmitting ? '⏳ Saving...' : initialData ? '💾 Save Changes' : '✨ Create Community'}</span>
            {!isSubmitting && <span className="text-xs bg-white bg-opacity-20 px-2 py-1 rounded">{initialData ? 'Update' : 'Create'}</span>}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
}