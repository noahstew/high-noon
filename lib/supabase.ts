import { createClient } from '@supabase/supabase-js';

// Supabase client - singleton instance
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface BlogPost {
  id: string;
  title: string;
  content: string;
  images: string[]; // Array of storage bucket paths
  published_at: string | null;
  created_at: string;
}

export interface Link {
  id: string;
  title: string;
  url: string;
  image_url: string | null;
  sort_order: number;
  created_at: string;
}

export interface Gallery {
  id: string;
  title: string;
  images: string[]; // Array of storage bucket paths
  created_at: string;
}
