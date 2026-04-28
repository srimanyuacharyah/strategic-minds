import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase;

// Check if keys are placeholders or missing
const isConfigured = supabaseUrl && supabaseAnonKey && !supabaseUrl.includes('placeholder');

if (isConfigured) {
  try {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } catch (e) {
    console.warn('Supabase init error, switching to Mock Mode', e);
  }
}

// If initialization failed or keys are missing, use a robust LocalStorage-backed mock
if (!supabase || !isConfigured) {
  console.log('🏗️ CivicAI: Running in Local Persistence Mode (Mock)');
  
  supabase = {
    auth: {
      getSession: async () => {
        const user = JSON.parse(localStorage.getItem('civic_user'));
        return { data: { session: user ? { user } : null } };
      },
      onAuthStateChange: (callback) => {
        const user = JSON.parse(localStorage.getItem('civic_user'));
        callback('SIGNED_IN', user ? { user } : null);
        return { data: { subscription: { unsubscribe: () => {} } } };
      },
      signInWithPassword: async ({ email, password }) => {
        const users = JSON.parse(localStorage.getItem('civic_mock_users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
          localStorage.setItem('civic_user', JSON.stringify(user));
          return { data: { user }, error: null };
        }
        return { data: { user: null }, error: { message: 'Invalid credentials or user not found in local mode' } };
      },
      signUp: async ({ email, password }) => {
        const users = JSON.parse(localStorage.getItem('civic_mock_users') || '[]');
        if (users.find(u => u.email === email)) return { error: { message: 'User already exists' } };
        
        const newUser = { id: Math.random().toString(36).slice(2), email, password };
        users.push(newUser);
        localStorage.setItem('civic_mock_users', JSON.stringify(users));
        localStorage.setItem('civic_user', JSON.stringify(newUser));
        return { data: { user: newUser }, error: null };
      },
      signOut: async () => {
        localStorage.removeItem('civic_user');
        return { error: null };
      },
    },
    from: (table) => ({
      select: () => ({
        order: () => ({
          data: JSON.parse(localStorage.getItem(`civic_mock_${table}`) || '[]'),
          error: null
        }),
        eq: () => ({
          data: JSON.parse(localStorage.getItem(`civic_mock_${table}`) || '[]'),
          error: null
        })
      }),
      insert: (data) => ({
        select: () => {
          const items = JSON.parse(localStorage.getItem(`civic_mock_${table}`) || '[]');
          const newItems = Array.isArray(data) ? [...items, ...data] : [...items, data];
          localStorage.setItem(`civic_mock_${table}`, JSON.stringify(newItems));
          return { data: Array.isArray(data) ? data : [data], error: null };
        }
      }),
      update: (data) => ({
        eq: (col, val) => {
          const items = JSON.parse(localStorage.getItem(`civic_mock_${table}`) || '[]');
          const newItems = items.map(item => item[col] === val ? { ...item, ...data } : item);
          localStorage.setItem(`civic_mock_${table}`, JSON.stringify(newItems));
          return { error: null };
        }
      }),
    })
  };
}

export { supabase };
