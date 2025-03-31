import type { Frog, VibeMatch } from './supabase';
import { DEFAULT_FROG_PROMPT } from './constants';

// Lilypad API endpoints from environment variables
const LILYPAD_API_URL = process.env.NEXT_PUBLIC_LILYPAD_API_URL || 'https://anura-testnet.lilypad.tech/api/v1';
const LILYPAD_API_KEY = process.env.NEXT_PUBLIC_LILYPAD_API_KEY || 'mock-lilypad-key';

// For demo purposes, we'll mock API calls if no valid API key is provided
const isMockMode = !process.env.NEXT_PUBLIC_LILYPAD_API_KEY;

// Helper function to retry API calls
async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 3, delay = 2000): Promise<Response> {
  let lastError: Error;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      console.log(`API call attempt ${attempt + 1}/${maxRetries}`);
      const response = await fetch(url, options);
      
      if (response.ok) {
        return response;
      }
      
      if (response.status === 429) { // Rate limited
        const retryAfter = response.headers.get('Retry-After');
        const waitTime = retryAfter ? parseInt(retryAfter, 10) * 1000 : delay * (attempt + 1);
        console.log(`Rate limited. Waiting ${waitTime}ms before retry`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      
      throw new Error(`API call failed with status: ${response.status} - ${response.statusText}`);
    } catch (error) {
      console.error(`Attempt ${attempt + 1} failed:`, error);
      lastError = error as Error;
      
      if (attempt < maxRetries - 1) {
        const waitTime = delay * Math.pow(2, attempt); // Exponential backoff
        console.log(`Waiting ${waitTime}ms before retry`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
    }
  }
  
  throw lastError || new Error('API call failed after multiple retries');
}

/**
 * Generate a frog image based on profile details
 */
export async function generateFrogImage(frog: Omit<Frog, 'id' | 'image_url'>): Promise<string> {
  try {
    const tagsList = frog.tags.join(', ');
    let prompt = DEFAULT_FROG_PROMPT.replace('{tags}', tagsList);
    
    // If in mock mode, return placeholder image
    if (isMockMode) {
      console.log('MOCK MODE: Returning placeholder frog image instead of calling Lilypad API');
      // Create a unique seed based on the frog name to get consistent images for the same frog
      const nameSeed = frog.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      return `https://via.placeholder.com/500/00cc88/ffffff?text=Generated+Frog+${nameSeed}`;
    }
    
    // Prepare the payload for Stable Diffusion
    const payload = {
      model: "sdxl:1.0",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      options: {
        image_size: "768x768"
      }
    };

    // Call Lilypad API with retry logic
    console.log('Calling Lilypad API to generate frog image...');
    const response = await fetchWithRetry(`${LILYPAD_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LILYPAD_API_KEY}`,
      },
      body: JSON.stringify(payload)
    }, 5, 3000); // More retries with longer delays for image generation

    const data = await response.json();
    
    // In a real implementation, we would handle the image data appropriately
    // For this demo, we'll just return a placeholder URL or the one returned by the API
    // In production, we would upload the image to a storage service and return the URL
    return data.image_url || "https://via.placeholder.com/500/00cc88/ffffff?text=Generated+Frog";
  } catch (error) {
    console.error('Error generating frog image:', error);
    return "https://via.placeholder.com/500/ff8866/ffffff?text=Image+Generation+Failed";
  }
}

/**
 * Compare two frog profiles and get a vibe match
 */
export async function compareVibes(frogA: Frog, frogB: Frog): Promise<VibeMatch> {
  try {
    // If in mock mode, generate deterministic results based on the frog names
    if (isMockMode) {
      console.log('MOCK MODE: Generating mock vibe match instead of calling Lilypad API');
      
      // Create a seed from both frog names
      const nameSeedA = frogA.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const nameSeedB = frogB.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const combinedSeed = (nameSeedA * nameSeedB) % 100;
      
      // Generate a match score between 65-95 based on shared tags
      const sharedTags = frogA.tags.filter(tag => frogB.tags.includes(tag)).length;
      const baseScore = 65 + (sharedTags * 6);
      const matchScore = Math.min(95, baseScore);
      
      // Generate a deterministic but reasonably unique response with new format
      const vibe_phrase = `${frogA.name} + ${frogB.name} = Web3 dream team 🚀`;
      
      // Select collab idea based on shared tags or default to generic ones
      let collab_idea = "Run a joint Twitter space about your shared vision for Web3.";
      if (frogA.tags.some(t => t.includes('DeFi')) && frogB.tags.some(t => t.includes('DeFi'))) {
        collab_idea = "Host a DeFi edu workshop featuring experts from both communities.";
      } else if (frogA.tags.some(t => t.includes('Artist')) || frogB.tags.some(t => t.includes('Artist'))) {
        collab_idea = "Collaborate on a NFT collection featuring work from both communities.";
      } else if (frogA.tags.some(t => t.includes('Builder')) || frogB.tags.some(t => t.includes('Builder'))) {
        collab_idea = "Run a weekend hackathon to build tools that benefit both communities.";
      }
      
      // Generate connect tip
      const connect_tip = "DM each other on Twitter to set up a quick intro call between community leads.";
      
      return {
        match_score: matchScore,
        vibe_phrase,
        collab_idea,
        connect_tip
      };
    }
    
    // Prepare the payload for the LLM
    const payload = {
      model: "phi4:14b",
      messages: [
        {
          role: "system",
          content: `You are VibeCheck, a fun AI that evaluates the compatibility between two Web3 communities and helps them find common ground.

Given information about two community "frogs", analyze their vibes and suggest ways they could work together. Focus on their shared interests and complementary strengths.

Return:
- A match score (0-100) - be optimistic! Most scores should be 65-95
- A vibe phrase that captures what makes them great together (short, catchy, with an emoji)
- A specific collab idea they could implement together (practical, achievable, fun)
- A connect tip (casual first step to start working together)

Format your response as a valid JSON object with these fields:
match_score: number (0-100)
vibe_phrase: string (short descriptor with emoji)
collab_idea: string (specific project they could do)
connect_tip: string (how to start the conversation)

Keep everything friendly, specific and brief - this is for sharing on social media!`
        },
        {
          role: "user",
          content: `Compare these two Web3 communities and suggest how they might collaborate:
          
          FROG A:
          Name: ${frogA.name}
          Bio: ${frogA.bio}
          Tags: ${frogA.tags.join(', ')}
          Reflections: ${frogA.reflections.join(' | ')}
          
          FROG B:
          Name: ${frogB.name}
          Bio: ${frogB.bio}
          Tags: ${frogB.tags.join(', ')}
          Reflections: ${frogB.reflections.join(' | ')}
          
          Return only valid JSON with no extra text.`
        }
      ],
      options: {
        temperature: 0.7
      }
    };

    // Call Lilypad API with retry logic
    console.log('Calling Lilypad API to compare vibes...');
    const response = await fetchWithRetry(`${LILYPAD_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LILYPAD_API_KEY}`,
      },
      body: JSON.stringify(payload)
    }, 3, 2000);

    const data = await response.json();
    
    // Parse the response - in a real implementation, we would handle errors better
    const content = data.choices[0].message.content;
    const jsonMatch = content.match(/({.*})/s);
    
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as VibeMatch;
    }
    
    // Fallback if parsing fails
    return {
      match_score: 75,
      vibe_phrase: "Complementary strengths 💪",
      collab_idea: "Run a joint Twitter space about your shared interests.",
      connect_tip: "DM each other to set up a quick intro call."
    };
  } catch (error) {
    console.error('Error comparing vibes:', error);
    
    // Return fallback data
    return {
      match_score: 70,
      vibe_phrase: "Potential collaborators 🌟",
      collab_idea: "Consider exploring opportunities in your shared interest areas.",
      connect_tip: "Connect on Twitter and start a conversation."
    };
  }
}