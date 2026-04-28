// Firebase service with localStorage demo mode fallback
import { db, isFirebaseConfigured } from '../config/firebase';
import { MOCK_COMPLAINTS, MOCK_FEEDBACK } from '../data/mockData';
import { generateComplaintId } from './aiService';

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

  if (isFirebaseConfigured && db) {
    try {
      const { collection, addDoc } = await import('firebase/firestore');
      const docRef = await addDoc(collection(db, 'complaints'), complaint);
      complaint.firestoreId = docRef.id;
    } catch (e) {
      console.warn('Firestore error, using local storage', e);
    }
  }

  const complaints = getLocalComplaints();
  complaints.unshift(complaint);
  saveLocalComplaints(complaints);
  return complaint;
}

export async function getComplaints() {
  if (isFirebaseConfigured && db) {
    try {
      const { collection, getDocs, orderBy, query } = await import('firebase/firestore');
      const q = query(collection(db, 'complaints'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      if (!snap.empty) {
        return snap.docs.map(d => ({ ...d.data(), firestoreId: d.id }));
      }
    } catch (e) {
      console.warn('Firestore error, using local storage', e);
    }
  }
  return getLocalComplaints();
}

export async function getComplaintById(id) {
  const all = await getComplaints();
  return all.find(c => c.id === id) || null;
}

export async function updateComplaintStatus(id, status) {
  const complaints = getLocalComplaints();
  const idx = complaints.findIndex(c => c.id === id);
  if (idx !== -1) {
    complaints[idx].status = status;
    complaints[idx].updatedAt = new Date().toISOString();
    saveLocalComplaints(complaints);
  }

  if (isFirebaseConfigured && db) {
    try {
      const { doc, updateDoc } = await import('firebase/firestore');
      const complaint = complaints[idx];
      if (complaint?.firestoreId) {
        await updateDoc(doc(db, 'complaints', complaint.firestoreId), {
          status, updatedAt: new Date().toISOString()
        });
      }
    } catch (e) { console.warn('Firestore update error', e); }
  }
}

export async function submitFeedback(data) {
  const feedback = {
    ...data,
    id: `FB-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  const all = getLocalFeedback();
  all.unshift(feedback);
  saveLocalFeedback(all);

  if (isFirebaseConfigured && db) {
    try {
      const { collection, addDoc } = await import('firebase/firestore');
      await addDoc(collection(db, 'feedback'), feedback);
    } catch (e) { console.warn('Firestore feedback error', e); }
  }
  return feedback;
}

export async function getFeedback() {
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
