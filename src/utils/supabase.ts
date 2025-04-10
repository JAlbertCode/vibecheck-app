import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

// These would typically come from environment variables
// For this demo, we're using a mock implementation
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mock-supabase-url.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-supabase-key';

// Create a Supabase client if we have valid URL and key
let supabaseClient;
try {
  supabaseClient = createClient(supabaseUrl, supabaseKey);
} catch (error) {
  console.error('Failed to initialize Supabase client:', error);
  // Provide a mock client with the same interface
  supabaseClient = {
    from: () => ({
      insert: () => ({ 
        select: () => ({ data: [], error: null }) 
      }),
      update: () => ({ 
        eq: () => ({ 
          select: () => ({ data: [], error: null }), 
          data: null, 
          error: null 
        }) 
      }),
      select: () => ({ 
        eq: () => ({ 
          single: () => ({ data: null, error: null })
        }),
        data: [], 
        error: null 
      }),
      eq: () => ({ 
        single: () => ({ data: null, error: null }) 
      })
    })
  };
}

export const supabase = supabaseClient;

export interface Frog {
  id: string;
  name: string;
  bio: string;
  logo_url: string;
  image_url: string | null;
  tags: string[];
  reflections: string[];
  contact_links: {
    twitter?: string;
    site?: string;
    email?: string;
    farcaster?: string;
    [key: string]: string | undefined;
  };
}

export interface VibeMatch {
  match_score: number;
  vibe_phrase?: string;
  collab_idea?: string;
  connect_tip?: string;
  // Support for legacy fields
  summary?: string;
  possibility_spark?: string;
  vibe_path?: string[];
  hang_spots?: string;
  first_connect?: string;
}

// Check if we're in mock mode
const isMockMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock');

// Mock data store for development/demo
let mockFrogs: Frog[] = [
  {
    id: '1',
    name: 'LilyDAO',
    bio: 'A community of decentralized AI enthusiasts building the future of compute.',
    logo_url: 'https://via.placeholder.com/100/00cc88/ffffff?text=L',
    image_url: 'https://via.placeholder.com/500/00cc88/ffffff?text=LilyDAO+Frog',
    tags: ['Builder-centric', 'AI explorers', 'Open-source purist', 'DeFi degen', 'Online-native'],
    reflections: [
      'We would love to co-create tools that make AI more accessible to all.',
      'Communities that are closed-source or don\'t value technical contributions don\'t mix well with us.'
    ],
    contact_links: {
      twitter: 'https://twitter.com/lilydao',
      site: 'https://lily.dao',
      email: 'hello@lily.dao',
      farcaster: 'https://warpcast.com/lilydao'
    }
  },
  {
    id: '2',
    name: 'CryptoFrens',
    bio: 'Building memes and community in the crypto space since 2017.',
    logo_url: 'https://via.placeholder.com/100/ff8866/ffffff?text=CF',
    image_url: 'https://via.placeholder.com/500/ff8866/ffffff?text=CryptoFrens+Frog',
    tags: ['Meme-forward', 'Shitposters', 'DeFi degen', 'Event hosts', 'Wholesome'],
    reflections: [
      'We would be excited to co-create meme competitions or virtual events.',
      'We vibe best with communities that don\'t take themselves too seriously.'
    ],
    contact_links: {
      twitter: 'https://twitter.com/cryptofrens',
      site: 'https://cryptofrens.xyz'
    }
  },
  {
    id: '3',
    name: 'ZK Guild',
    bio: 'Exploring the frontiers of zero-knowledge proofs and privacy-preserving computation.',
    logo_url: 'https://via.placeholder.com/100/9966ff/ffffff?text=ZK',
    image_url: 'https://via.placeholder.com/500/9966ff/ffffff?text=ZK+Guild+Frog',
    tags: ['Research-driven', 'ZK-maxi', 'Builder-centric', 'Grant-seekers', 'Online-native'],
    reflections: [
      'We want to collaborate on research papers and technical implementations.',
      'Communities focused solely on hype without technical substance don\'t mix well with us.'
    ],
    contact_links: {
      twitter: 'https://twitter.com/zkguild',
      site: 'https://zk.guild',
      farcaster: 'https://warpcast.com/zkguild'
    }
  }
];

export async function createFrog(frogData: Omit<Frog, 'id'>): Promise<Frog> {
  const id = uuidv4();
  const newFrog = { id, ...frogData };
  
  if (isMockMode) {
    console.log('MOCK MODE: Creating frog in mock data store');
    mockFrogs.push(newFrog as Frog);
    return newFrog as Frog;
  }
  
  const { data, error } = await supabase
    .from('frogs')
    .insert([newFrog])
    .select();
  
  if (error) throw error;
  return data?.[0] as Frog;
}

export async function updateFrog(id: string, frogData: Omit<Frog, 'id'>): Promise<Frog> {
  const updatedFrog = { id, ...frogData };
  
  if (isMockMode) {
    console.log('MOCK MODE: Updating frog in mock data store');
    mockFrogs = mockFrogs.map(frog => 
      frog.id === id ? { ...frog, ...frogData } : frog
    );
    return updatedFrog as Frog;
  }
  
  const { data, error } = await supabase
    .from('frogs')
    .update(frogData)
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data?.[0] as Frog;
}

export async function getFrogs(): Promise<Frog[]> {
  if (isMockMode) {
    console.log('MOCK MODE: Returning mock frogs');
    // Sort mock frogs alphabetically by name
    return [...mockFrogs].sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
  }
  
  const { data, error } = await supabase
    .from('frogs')
    .select('*');
  
  if (error) throw error;
  // Sort frogs alphabetically by name
  return (data as Frog[]).sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
}

export async function getFrogById(id: string): Promise<Frog | null> {
  if (isMockMode) {
    console.log('MOCK MODE: Finding frog by ID in mock data store');
    return mockFrogs.find(frog => frog.id === id) || null;
  }
  
  const { data, error } = await supabase
    .from('frogs')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) return null;
  return data as Frog;
}
