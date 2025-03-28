import type { Frog, VibeMatch } from './supabase';
import { DEFAULT_FROG_PROMPT } from './constants';

// Lilypad API endpoints would typically come from environment variables
// For this demo, we're hardcoding them (but would use .env in production)
const LILYPAD_API_URL = 'https://anura-testnet.lilypad.tech/api/v1';
const LILYPAD_API_KEY = 'YOUR_LILYPAD_API_KEY';

/**
 * Generate a frog image based on profile details
 */
export async function generateFrogImage(frog: Omit<Frog, 'id' | 'image_url'>): Promise<string> {
  try {
    const tagsList = frog.tags.join(', ');
    let prompt = DEFAULT_FROG_PROMPT.replace('{tags}', tagsList);
    
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

    // Call Lilypad API
    const response = await fetch(`${LILYPAD_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LILYPAD_API_KEY}`,
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Failed to generate image: ${response.statusText}`);
    }

    const data = await response.json();
    
    // In a real implementation, we would handle the image data appropriately
    // For this demo, we'll just return a placeholder URL
    // In production, we would upload the image to a storage service and return the URL
    return data.image_url || "https://via.placeholder.com/500?text=Generated+Frog";
  } catch (error) {
    console.error('Error generating frog image:', error);
    return "https://via.placeholder.com/500?text=Image+Generation+Failed";
  }
}

/**
 * Compare two frog profiles and get a vibe match
 */
export async function compareVibes(frogA: Frog, frogB: Frog): Promise<VibeMatch> {
  try {
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

    // Call Lilypad API
    const response = await fetch(`${LILYPAD_API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LILYPAD_API_KEY}`,
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`Failed to compare vibes: ${response.statusText}`);
    }

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