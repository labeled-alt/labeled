import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
};

export type Project = {
  id: string;
  user_id: string;
  name: string;
  description: string;
  type: 'image' | 'text';
  created_at: string;
  updated_at: string;
};

export type Dataset = {
  id: string;
  project_id: string;
  file_name: string;
  file_url: string | null;
  file_type: string;
  content: string | null;
  created_at: string;
};

export type Label = {
  id: string;
  dataset_id: string;
  label_text: string;
  created_at: string;
  updated_at: string;
};
