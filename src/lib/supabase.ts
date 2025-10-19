import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const SUPABASE_CONFIGURED = Boolean(supabaseUrl && supabaseAnonKey);

let _supabase: ReturnType<typeof createClient> | any;

if (SUPABASE_CONFIGURED) {
  _supabase = createClient(supabaseUrl!, supabaseAnonKey!);
} else {
  // Provide a safe proxy that surfaces a clear error when used in the app
  const errMsg =
    'Supabase not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment (these are injected at build time by Vite).';

  // Log once so deploys show the real problem in browser console
  if (typeof window !== 'undefined') {
    // eslint-disable-next-line no-console
    console.error(errMsg);
  } else {
    // build/server-side logging
    // eslint-disable-next-line no-console
    console.error('[supabase] ' + errMsg);
  }

  const handler: ProxyHandler<any> = {
    get() {
      return () => Promise.reject(new Error(errMsg));
    },
  };

  _supabase = new Proxy({}, handler);
}

export const supabase = _supabase;

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
