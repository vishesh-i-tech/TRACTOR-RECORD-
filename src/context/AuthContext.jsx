'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getSupabaseClient, 
  getSupabaseConfig, 
  setSupabaseConfig, 
  isValidSupabaseConfig 
} from '../lib/supabaseClient';

const AuthContext = createContext(null);

const DEMO_USERS = {
  owner: {
    id: 'usr-owner-001',
    email: 'surinder@tractorrecord.com',
    name: 'Surinder Thakur',
    role: 'owner',
    avatar: 'ST',
  },
  munshi: {
    id: 'usr-munshi-002',
    email: 'radhe.munshi@tractorrecord.com',
    name: 'Radhe Shyam (Accountant)',
    role: 'munshi',
    avatar: 'RS',
  },
  driver: {
    id: 'usr-driver-003',
    email: 'sukhwinder@tractorrecord.com',
    name: 'Sukhwinder Singh (Driver)',
    role: 'driver',
    avatar: 'SS',
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [supabaseConfig, setConfigState] = useState({ url: '', anonKey: '', source: 'none' });
  const [isSupabaseLive, setIsSupabaseLive] = useState(false);
  const [connectionMessage, setConnectionMessage] = useState('');

  // Check session and initialize on mount
  useEffect(() => {
    let existingUser = null;
    if (typeof window !== 'undefined') {
      const stored = sessionStorage.getItem('tr_session_user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          // Purge legacy dummy mock accounts
          if (parsed && parsed.email && !parsed.email.includes('farm.com') && !parsed.id?.startsWith('usr-owner-001')) {
            existingUser = parsed;
          } else {
            sessionStorage.removeItem('tr_session_user');
          }
        } catch (e) {
          sessionStorage.removeItem('tr_session_user');
        }
      }
    }
    setUser(existingUser);

    const initAuth = async () => {
      try {
        const cfg = getSupabaseConfig();
        setConfigState(cfg);

        const client = getSupabaseClient();
        if (client) {
          // Test live connection
          try {
            const { data, error } = await client.from('customers').select('count', { count: 'exact', head: true });
            if (!error) {
              setIsSupabaseLive(true);
              setConnectionMessage('Connected to live Supabase DB');
            } else {
              setConnectionMessage(`Supabase keys set, but DB query returned: ${error.message}`);
            }
          } catch (e) {
            setConnectionMessage('Supabase client initialized');
          }

          // Listen to auth changes if Supabase session alters
          const { data: authListener } = client.auth.onAuthStateChange((_event, newSession) => {
            setSession(newSession);
            if (newSession?.user) {
              const u = {
                id: newSession.user.id,
                email: newSession.user.email,
                name: newSession.user.user_metadata?.full_name || newSession.user.email?.split('@')[0] || 'User',
                role: newSession.user.user_metadata?.role || 'owner',
                avatar: (newSession.user.user_metadata?.full_name || 'U').substring(0, 2).toUpperCase(),
              };
              setUser(u);
            }
          });

          return () => {
            authListener?.subscription?.unsubscribe();
          };
        }
      } catch (err) {
        console.error('Error during Auth init:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Sign In with email & password
  const signIn = async (email, password) => {
    const client = getSupabaseClient();
    if (client) {
      const { data, error } = await client.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (data?.user) {
        const u = {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'User',
          role: data.user.user_metadata?.role || 'owner',
          avatar: (data.user.user_metadata?.full_name || 'U').substring(0, 2).toUpperCase()
        };
        setUser(u);
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('tr_session_user', JSON.stringify(u));
        }
      }
      return data;
    } else {
      // Authenticate with local SQLite database
      const res = await fetch('/api/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'auth_signin', data: { email, password } })
      });
      const result = await res.json();
      if (!result.success) {
        const err = new Error(result.error || 'Authentication failed');
        err.code = result.code;
        err.notFound = result.notFound;
        throw err;
      }
      setUser(result.user);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('tr_session_user', JSON.stringify(result.user));
      }
      return result;
    }
  };

  // Sign Up with email, password, full name, and role
  const signUp = async (email, password, fullName, role = 'owner') => {
    const client = getSupabaseClient();
    if (client) {
      const { data, error } = await client.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: role
          }
        }
      });
      if (error) throw error;
      const u = {
        id: data?.user?.id || `usr-${Date.now()}`,
        email,
        name: fullName,
        role,
        avatar: (fullName || 'U').substring(0, 2).toUpperCase()
      };
      setUser(u);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('tr_session_user', JSON.stringify(u));
      }
      return data;
    } else {
      // Register with local SQLite database
      const res = await fetch('/api/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'auth_signup', 
          data: { email, password, name: fullName, role } 
        })
      });
      const result = await res.json();
      if (!result.success) {
        const err = new Error(result.error || 'Registration failed');
        err.code = result.code;
        err.alreadyExists = result.alreadyExists;
        throw err;
      }
      setUser(result.user);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('tr_session_user', JSON.stringify(result.user));
      }
      return result;
    }
  };

  // Sign Out (Takes user back to the Authentication Screen)
  const signOut = async () => {
    const client = getSupabaseClient();
    if (client) {
      try {
        await client.auth.signOut();
      } catch (err) {}
    }
    setUser(null);
    setSession(null);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('tr_session_user');
      localStorage.removeItem('tr_active_user');
      localStorage.removeItem('tr_is_authenticated');
    }
  };

  // 1-Click Instant Demo Login
  const demoLogin = (role = 'owner') => {
    const selected = DEMO_USERS[role] || DEMO_USERS.owner;
    setUser(selected);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('tr_session_user', JSON.stringify(selected));
    }
    return selected;
  };

  // Update Supabase Project URL & Anon Key
  const updateSupabaseKeys = async (url, anonKey) => {
    const newClient = setSupabaseConfig(url, anonKey);
    const newCfg = getSupabaseConfig();
    setConfigState(newCfg);

    if (newClient) {
      try {
        const { error } = await newClient.from('customers').select('count', { count: 'exact', head: true });
        if (!error) {
          setIsSupabaseLive(true);
          setConnectionMessage('Successfully connected to Supabase DB!');
          return { success: true, message: 'Connected to Supabase DB successfully!' };
        } else {
          setIsSupabaseLive(false);
          setConnectionMessage(`Connection error: ${error.message}`);
          return { success: false, message: `Connected to Supabase, but: ${error.message}. Make sure tables exist.` };
        }
      } catch (err) {
        setIsSupabaseLive(false);
        setConnectionMessage(`Test query failed: ${err.message}`);
        return { success: false, message: err.message };
      }
    } else {
      setIsSupabaseLive(false);
      setConnectionMessage('Invalid URL or Anon Key format');
      return { success: false, message: 'Invalid Supabase URL or Key' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        isConfigured: isValidSupabaseConfig(supabaseConfig.url, supabaseConfig.anonKey),
        isSupabaseLive,
        supabaseConfig,
        connectionMessage,
        signIn,
        signUp,
        signOut,
        demoLogin,
        updateSupabaseKeys
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
