import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

// These would typically come from environment variables
// For this demo, we're hardcoding them (but would use .env in production)
const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseKey = 'YOUR_SUPABASE_KEY';

export const supabase = createClient(supabaseUrl, supabaseKey);

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
  summary: string;
  possibility_spark: string;
  vibe_path: string[];
}

export async function createFrog(frogData: Omit<Frog, 'id'>): Promise<Frog> {
  const id = uuidv4();
  const newFrog = { id, ...frogData };
  
  const { data, error } = await supabase
    .from('frogs')
    .insert([newFrog])
    .select();
  
  if (error) throw error;
  return data?.[0] as Frog;
}

export async function updateFrogImage(id: string, imageUrl: string): Promise<void> {
  const { error } = await supabase
    .from('frogs')
    .update({ image_url: imageUrl })
    .eq('id', id);
  
  if (error) throw error;
}

export async function getFrogs(): Promise<Frog[]> {
  const { data, error } = await supabase
    .from('frogs')
    .select('*');
  
  if (error) throw error;
  return data as Frog[];
}

export async function getFrogById(id: string): Promise<Frog | null> {
  const { data, error } = await supabase
    .from('frogs')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) return null;
  return data as Frog;
}
