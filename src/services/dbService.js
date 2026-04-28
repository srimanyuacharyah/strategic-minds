import { supabase } from '../config/supabase';
import { MOCK_COMPLAINTS, MOCK_FEEDBACK } from '../data/mockData';
import { generateComplaintId } from './aiService';

const isSupabaseConfigured = !!import.meta.env.VITE_SUPABASE_URL;
const STORAGE_KEY_COMPLAINTS = 'civicai_complaints';
const STORAGE_KEY_FEEDBACK = 'civicai_feedback';

function getLocalComplaints() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_COMPLAINTS);
    return stored ? JSON.parse(stored) : [...MOCK_COMPLAINTS];
  } catch { return [...MOCK_COMPLAINTS]; }
}

function saveLocalComplaints(complaints) {
  localStorage.setItem(STORAGE_KEY_COMPLAINTS, JSON.stringify(complaints));
}

function getLocalFeedback() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_FEEDBACK);
    return stored ? JSON.parse(stored) : [...MOCK_FEEDBACK];
  } catch { return [...MOCK_FEEDBACK]; }
}

function saveLocalFeedback(feedback) {
  localStorage.setItem(STORAGE_KEY_FEEDBACK, JSON.stringify(feedback));
}

export async function submitComplaint(data) {
  const complaint = {
    ...data,
    id: generateComplaintId(),
    status: 'Pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    upvotes: 0,
  };

  if (isSupabaseConfigured) {
    try {
      const { data: inserted, error } = await supabase
        .from('complaints')
        .insert([complaint])
        .select();
      if (error) throw error;
      if (inserted) complaint.supabaseId = inserted[0].id;
    } catch (e) {
      console.warn('Supabase error, using local storage', e);
    }
  }

  const complaints = getLocalComplaints();
  complaints.unshift(complaint);
  saveLocalComplaints(complaints);
  return complaint;
}

export async function getComplaints() {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .order('createdAt', { ascending: false });
      if (error) throw error;
      if (data && data.length > 0) return data;
    } catch (e) {
      console.warn('Supabase error, using local storage', e);
    }
  }
  return getLocalComplaints();
}

export async function getComplaintById(id) {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .eq('id', id)
        .single();
      if (!error && data) return data;
    } catch (e) { console.warn('Supabase lookup error', e); }
  }
  const all = await getComplaints();
  return all.find(c => c.id === id) || null;
}

export async function updateComplaintStatus(id, status) {
  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase
        .from('complaints')
        .update({ status, updatedAt: new Date().toISOString() })
        .eq('id', id);
      if (error) throw error;
    } catch (e) { console.warn('Supabase update error', e); }
  }

  const complaints = getLocalComplaints();
  const idx = complaints.findIndex(c => c.id === id);
  if (idx !== -1) {
    complaints[idx].status = status;
    complaints[idx].updatedAt = new Date().toISOString();
    saveLocalComplaints(complaints);
  }
}

export async function submitFeedback(data) {
  const feedback = {
    ...data,
    id: `FB-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };

  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase
        .from('feedback')
        .insert([feedback]);
      if (error) throw error;
    } catch (e) { console.warn('Supabase feedback error', e); }
  }

  const all = getLocalFeedback();
  all.unshift(feedback);
  saveLocalFeedback(all);
  return feedback;
}

export async function getFeedback() {
  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('createdAt', { ascending: false });
      if (!error && data) return data;
    } catch (e) { console.warn('Supabase feedback fetch error', e); }
  }
  return getLocalFeedback();
}

export async function getAnalytics() {
  const complaints = await getComplaints();
  const byCategory = {};
  const byStatus = { Pending: 0, 'In Progress': 0, Resolved: 0 };
  const byDay = {};

  complaints.forEach(c => {
    byCategory[c.category] = (byCategory[c.category] || 0) + 1;
    byStatus[c.status] = (byStatus[c.status] || 0) + 1;
    const day = new Date(c.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
    byDay[day] = (byDay[day] || 0) + 1;
  });

  return { byCategory, byStatus, byDay, total: complaints.length, complaints };
}
