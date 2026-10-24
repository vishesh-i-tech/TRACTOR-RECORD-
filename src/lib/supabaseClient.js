import { createClient } from '@supabase/supabase-js';

// Default / fallback keys from environment variables
const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const envAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let cachedClient = null;
let currentConfig = {
  url: envUrl,
  anonKey: envAnonKey,
};

// Check if credentials are valid format
export function isValidSupabaseConfig(url, key) {
  if (!url || !key) return false;
  return (
    url.startsWith('https://') &&
    url.includes('.supabase.co') &&
    key.length > 20
  );
}

// Get active config from localStorage or env
export function getSupabaseConfig() {
  if (typeof window !== 'undefined') {
    const storedUrl = localStorage.getItem('tr_supabase_url');
    const storedKey = localStorage.getItem('tr_supabase_anon_key');
    if (storedUrl && storedKey) {
      return { url: storedUrl, anonKey: storedKey, source: 'localStorage' };
    }
  }
  return { url: envUrl, anonKey: envAnonKey, source: 'env' };
}

// Initialize or retrieve existing client
export function getSupabaseClient() {
  const cfg = getSupabaseConfig();
  
  if (!isValidSupabaseConfig(cfg.url, cfg.anonKey)) {
    return null;
  }

  if (
    !cachedClient ||
    currentConfig.url !== cfg.url ||
    currentConfig.anonKey !== cfg.anonKey
  ) {
    currentConfig = { url: cfg.url, anonKey: cfg.anonKey };
    cachedClient = createClient(cfg.url, cfg.anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }

  return cachedClient;
}

// Update config and persist to localStorage
export function setSupabaseConfig(url, anonKey) {
  if (typeof window !== 'undefined') {
    if (url && anonKey) {
      localStorage.setItem('tr_supabase_url', url.trim());
      localStorage.setItem('tr_supabase_anon_key', anonKey.trim());
    } else {
      localStorage.removeItem('tr_supabase_url');
      localStorage.removeItem('tr_supabase_anon_key');
    }
  }
  cachedClient = null;
  return getSupabaseClient();
}

// Pre-initialized export (or null if not yet configured)
export const supabase = typeof window !== 'undefined' ? getSupabaseClient() : (envUrl && envAnonKey ? createClient(envUrl, envAnonKey) : null);
