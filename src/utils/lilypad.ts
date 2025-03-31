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
      
      // Generate a deterministic but reasonably unique response
      const summary = `${frogA.name} and ${frogB.name} share ${sharedTags} interests and have complementary community values!`;
      
      // Select possibility spark based on shared tags or default to generic ones
      let possibilitySpark = "Build a joint community initiative to connect your audiences.";
      if (frogA.tags.includes('DeFi degen') && frogB.tags.includes('DeFi degen')) {
        possibilitySpark = "Collaborate on a DeFi educational series for both communities.";
      } else if (frogA.tags.includes('Artist-led') || frogB.tags.includes('Artist-led')) {
        possibilitySpark = "Create a collaborative NFT collection featuring artists from both communities.";
      } else if (frogA.tags.includes('Builder-centric') || frogB.tags.includes('Builder-centric')) {
        possibilitySpark = "Launch a joint hackathon to build tools that benefit both communities.";
      }
      
      // Generate vibe path steps
      const vibePath = [
        "Set up an initial Discord call to get to know each other's communities.",
        "Identify specific members who would be good points of contact for the collaboration.",
        "Create a shared document outlining goals and next steps for the partnership."
      ];
      
      return {
        match_score: matchScore,
        summary,
        possibility_spark: possibilitySpark,
        vibe_path: vibePath
      };
    }
    
    // Prepare the payload for the LLM
    const payload = {
      model: "phi4:14b",
      messages: [
        {
          role: "system",
          content: `You are VibeCheck, an AI that analyzes the compatibility between two Web3 communities and provides creative suggestions for collaboration.
          
          Given information about two community "frogs", analyze their vibes, values, and potential for collaboration.
          Return:
          - A match score (0-100)
          - A brief summary of their compatibility
          - A creative "possibility spark" idea they could work on together
          - 3 specific next steps for collaboration in an array called "vibe_path"
          
          Format your response as a valid JSON object with these fields:
          match_score: number (0-100)
          summary: string
          possibility_spark: string
          vibe_path: array of 3 strings`
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
          
          Analyze their compatibility, provide a match score (0-100), a summary of why they'd vibe, a creative project idea (possibility spark), and 3 specific next steps (vibe_path).
          
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
      summary: "These frogs seem to have compatible vibes!",
      possibility_spark: "They could collaborate on a community project.",
      vibe_path: [
        "Schedule an initial meet & greet call",
        "Identify mutual interests and goals",
        "Plan a joint online event"
      ]
    };
  } catch (error) {
    console.error('Error comparing vibes:', error);
    
    // Return fallback data
    return {
      match_score: 70,
      summary: "Connection issues prevented full analysis, but these communities look compatible!",
      possibility_spark: "Consider exploring collaborative opportunities in shared interest areas.",
      vibe_path: [
        "Connect on social platforms",
        "Share resources and ideas",
        "Explore potential collaboration areas"
      ]
    };
  }
}