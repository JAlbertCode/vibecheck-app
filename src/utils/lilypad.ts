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
    // If in mock mode, generate deterministic results based on the frog profiles with real similarities
    if (isMockMode) {
      console.log('MOCK MODE: Generating vibe match with real similarity metrics');
      
      // Calculate similarity based on multiple factors:
      
      // 1. Tag overlap (0-40 points)
      const frogATags = new Set(frogA.tags.map(tag => tag.toLowerCase()));
      const frogBTags = new Set(frogB.tags.map(tag => tag.toLowerCase()));
      
      // Calculate Jaccard similarity (intersection / union)
      const intersection = new Set([...frogATags].filter(tag => frogBTags.has(tag)));
      const union = new Set([...frogATags, ...frogBTags]);
      
      // Convert to a score between 0-40
      const tagSimilarity = Math.round((intersection.size / union.size) * 40);
      
      // 2. Bio similarity (0-20 points)
      // Check for key word overlap in bios
      const bioWordsA = frogA.bio.toLowerCase().split(/\s+/).filter(word => word.length > 4);
      const bioWordsB = frogB.bio.toLowerCase().split(/\s+/).filter(word => word.length > 4);
      
      const bioWordsSetA = new Set(bioWordsA);
      const bioWordsSetB = new Set(bioWordsB);
      
      const bioIntersection = new Set([...bioWordsSetA].filter(word => bioWordsSetB.has(word)));
      const bioUnion = new Set([...bioWordsSetA, ...bioWordsSetB]);
      
      // Convert to a score between 0-20
      const bioSimilarity = Math.round((bioIntersection.size / Math.max(1, bioUnion.size)) * 20);
      
      // 3. Reflection compatibility (0-30 points)
      // Look for key themes and sentiment in reflections
      const reflectionWordsA = frogA.reflections.join(' ').toLowerCase().split(/\s+/).filter(word => word.length > 4);
      const reflectionWordsB = frogB.reflections.join(' ').toLowerCase().split(/\s+/).filter(word => word.length > 4);
      
      const reflectionWordsSetA = new Set(reflectionWordsA);
      const reflectionWordsSetB = new Set(reflectionWordsB);
      
      const reflectionIntersection = new Set([...reflectionWordsSetA].filter(word => reflectionWordsSetB.has(word)));
      
      // 0-20 points for word overlap
      const reflectionOverlap = Math.min(20, reflectionIntersection.size * 4);
      
      // 0-10 points for complementary values (using some heuristics)
      let complementaryBonus = 0;
      const buildTerms = ['build', 'create', 'develop', 'code', 'engineer'];
      const designTerms = ['design', 'art', 'creative', 'visual', 'style'];
      const communityTerms = ['community', 'people', 'members', 'together', 'collaborative'];
      
      // Check if communities have complementary skills/focus
      const hasBuilderFocus = [...reflectionWordsSetA, ...reflectionWordsSetB].some(word => buildTerms.includes(word));
      const hasDesignFocus = [...reflectionWordsSetA, ...reflectionWordsSetB].some(word => designTerms.includes(word));
      const hasCommunityFocus = [...reflectionWordsSetA, ...reflectionWordsSetB].some(word => communityTerms.includes(word));
      
      if ((hasBuilderFocus && hasDesignFocus) || (hasBuilderFocus && hasCommunityFocus) || (hasDesignFocus && hasCommunityFocus)) {
        complementaryBonus = 10;
      }
      
      const reflectionSimilarity = reflectionOverlap + complementaryBonus;
      
      // 4. Random variation factor (0-10 points) - adds some natural variance
      // Use a seed from both frog names for consistency in results
      const nameSeedA = frogA.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const nameSeedB = frogB.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const combinedSeed = (nameSeedA * nameSeedB) % 11; // 0-10
      
      // Calculate final match score (0-100)
      const rawScore = tagSimilarity + bioSimilarity + reflectionSimilarity + combinedSeed;
      
      // Ensure score is within a wider range (40-90) - allows for more variety in match scores
      const matchScore = Math.max(40, Math.min(90, rawScore));
      
      // Apply a more aggressive bell curve distribution to make extreme scores much less common
      // This will make high matches truly special and meaningful
      const normalizedScore = Math.round(
        40 + (matchScore - 40) * Math.pow((matchScore - 40) / 50, 0.5)
      );
      
      // Apply a cap to ensure more variety (max 85% for most matches)
      const cappedScore = Math.min(normalizedScore, intersection.size > 3 ? 85 : 75);
      
      console.log(`Match details: Tags ${tagSimilarity}/40, Bio ${bioSimilarity}/20, Reflections ${reflectionSimilarity}/30, Random ${combinedSeed}/10, Raw ${matchScore}/100, Normalized ${normalizedScore}/100, Capped ${cappedScore}/100`);
      
      // Use the capped score to influence vibe phrase
      let vibe_phrase = '';
      if (cappedScore >= 85) {
        vibe_phrase = `${frogA.name} + ${frogB.name} = Dream team match! ⭐`;
      } else if (cappedScore >= 75) {
        vibe_phrase = `Great potential between ${frogA.name} & ${frogB.name} 🚀`;
      } else if (cappedScore >= 65) {
        vibe_phrase = `Interesting synergy between these communities 💡`;
      } else if (cappedScore >= 55) {
        vibe_phrase = `Some common ground to build on 🌱`;
      } else {
        vibe_phrase = `Different paths, potential for growth 🌿`;
      }
      
      // Select collab idea based on shared tags and capped score
      let collab_idea = '';
      if (cappedScore >= 80) {
        if (frogA.tags.some(t => t.toLowerCase().includes('defi')) && frogB.tags.some(t => t.toLowerCase().includes('defi'))) {
          collab_idea = "Co-develop a new DeFi protocol combining both communities' expertise.";
        } else if (frogA.tags.some(t => t.toLowerCase().includes('artist')) || frogB.tags.some(t => t.toLowerCase().includes('artist'))) {
          collab_idea = "Launch a collaborative NFT collection with proceeds funding a joint hackathon.";
        } else if (frogA.tags.some(t => t.toLowerCase().includes('builder')) || frogB.tags.some(t => t.toLowerCase().includes('builder'))) {
          collab_idea = "Create a joint accelerator program for projects that benefit both ecosystems.";
        } else {
          collab_idea = "Run a high-impact event series co-branded by both communities.";
        }
      } else if (cappedScore >= 65) {
        if (intersection.size > 0) {
          // Use their actual common interests
          const commonInterests = Array.from(intersection).join(', ');
          collab_idea = `Organize a workshop series around your shared interests in ${commonInterests}.`;
        } else {
          collab_idea = "Host a Twitter Space to explore potential collaboration areas.";
        }
      } else {
        collab_idea = "Start with a community exchange program to learn from each other.";
      }
      
      // Generate connect tip based on capped score
      let connect_tip = '';
      if (cappedScore >= 80) {
        connect_tip = "Schedule a leadership call to map out collaboration possibilities.";
      } else if (cappedScore >= 65) {
        connect_tip = "DM each other to arrange a casual intro call between community leads.";
      } else {
        connect_tip = "Connect on Twitter and start by engaging with each other's content.";
      }
      
      return {
        match_score: cappedScore,
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