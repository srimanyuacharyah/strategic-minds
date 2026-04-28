import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiSearch, FiMapPin, FiClock, FiArrowUp } from 'react-icons/fi';
import { getComplaints, getComplaintById } from '../services/dbService';
import { CATEGORY_COLORS, STATUS_COLORS, DEPARTMENTS } from '../data/mockData';
import LoadingSpinner from '../components/LoadingSpinner';
import IssueCard from '../components/IssueCard';
import toast from 'react-hot-toast';
import { useLanguage } from '../context/LanguageContext';

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const TIMELINE_STEPS = [
  { status: 'Pending', label: 'Complaint Registered', desc: 'Your complaint has been received and is being reviewed.', icon: '📋' },
  { status: 'In Progress', label: 'Under Investigation', desc: 'The concerned department is actively working on this issue.', icon: '🔧' },
  { status: 'Resolved', label: 'Issue Resolved', desc: 'The problem has been fixed. Please verify and give feedback.', icon: '✅' },
];

function DetailView({ complaint, onBack }) {
  const [newProposal, setNewProposal] = useState('');
  const cat = CATEGORY_COLORS[complaint.category] || CATEGORY_COLORS.Other;
  const statusOrder = { Pending: 0, 'In Progress': 1, Resolved: 2 };
  const currentStep = statusOrder[complaint.status] ?? 0;
  const dept = DEPARTMENTS[complaint.department] || DEPARTMENTS.Other;
  
  const daysOld = Math.floor((Date.now() - new Date(complaint.createdAt).getTime()) / (24 * 60 * 60 * 1000));
  
  const openLetter = `Dear ${dept.name},\n\nI am writing to express my deep concern regarding the unresolved issue: "${complaint.title}" (ID: ${complaint.id}), which was reported on ${new Date(complaint.createdAt).toLocaleDateString()}. \n\nIt has been ${daysOld} days since this was first brought to your attention. This issue is causing significant distress to our community. We demand immediate action to resolve this matter and ensure the safety and well-being of our citizens.\n\nSincerely,\nA concerned citizen of CivicAI`;

  const handleShare = () => {
    const text = encodeURIComponent(`📢 EMERGENCY ESCALATION: This civic issue has been ignored for ${daysOld} days! Check it out on CivicAI. #CivicAI #Governance #TechFusion`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  return (
    <div className="animate-slide-up space-y-5">
      <button onClick={onBack} className="text-civic-400 hover:text-civic-300 text-sm flex items-center gap-1 transition-colors">
        ← Back to all complaints
      </button>

      {/* Escalation Alerts */}
      {daysOld >= 15 && complaint.status !== 'Resolved' && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-center gap-4 animate-pulse">
          <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center text-red-500 text-2xl shrink-0">🚩</div>
          <div>
            <p className="text-red-400 font-bold text-sm uppercase tracking-wider">Public Transparency Flag</p>
            <p className="text-red-300/70 text-xs">This issue has been flagged in the public feed due to 15+ days of inactivity.</p>
          </div>
        </div>
      )}

      <div className="card">
        <div className="flex items-start justify-between gap-3 flex-wrap mb-4">
          <div>
            <p className="text-xs text-civic-400 font-mono mb-1">{complaint.id}</p>
            <h2 className="text-xl font-bold text-white">{complaint.title}</h2>
          </div>
          <span className={`badge ${STATUS_COLORS[complaint.status]?.badge || 'badge-pending'}`}>
            <span className={`w-2 h-2 rounded-full ${STATUS_COLORS[complaint.status]?.dot} inline-block`} />
            {complaint.status}
          </span>
        </div>
        <p className="text-slate-300 leading-relaxed mb-4">{complaint.description}</p>
        <div className="flex flex-wrap gap-4 text-sm text-slate-400">
          <span className="flex items-center gap-1"><FiMapPin size={13} className="text-civic-400" />{complaint.location?.address}</span>
          <span className="flex items-center gap-1"><FiClock size={13} className="text-civic-400" />Reported {timeAgo(complaint.createdAt)}</span>
          <span className="flex items-center gap-1"><FiArrowUp size={13} className="text-civic-400" />{complaint.upvotes} upvotes</span>
        </div>
      </div>

      {/* Fix Proposals Section */}
      <div className="card">
        <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
          💡 Collaborative Fix Proposals
        </h3>
        <div className="space-y-3 mb-6">
          {(complaint.proposals || []).map((prop, i) => (
            <div key={i} className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/50 flex items-start justify-between gap-4">
              <div>
                <p className="text-white text-sm font-medium">{prop.text}</p>
                <p className="text-[10px] text-slate-500 mt-1">Suggested by <span className="text-civic-400">{prop.user || 'Anonymous'}</span></p>
              </div>
              <div className="flex items-center gap-1 text-slate-400 text-xs bg-slate-900 px-2 py-1 rounded-lg">
                <FiArrowUp size={10} className="text-civic-400" /> {prop.upvotes || 0}
              </div>
            </div>
          ))}
          {(!complaint.proposals || complaint.proposals.length === 0) && (
            <p className="text-slate-500 text-xs italic">No solutions proposed yet. Be the first!</p>
          )}
        </div>
        <div className="flex gap-2">
          <input 
            value={newProposal}
            onChange={(e) => setNewProposal(e.target.value)}
            className="input text-sm flex-1" 
            placeholder="Suggest a fix (e.g. use concrete gutters)..." 
          />
          <button 
            onClick={() => {
              if (newProposal) {
                toast.success('Proposal submitted for community review!');
                setNewProposal('');
              }
            }}
            className="btn-primary px-4 text-xs font-bold"
          >
            Submit Fix
          </button>
        </div>
      </div>

      {/* Open Letter Generator */}
      {daysOld >= 30 && complaint.status !== 'Resolved' && (
        <div className="card bg-gradient-to-r from-red-950/40 to-slate-900/40 border border-red-500/30">
          <h3 className="text-red-400 font-bold mb-3 flex items-center gap-2">
            ✉️ 30-Day Auto-Generated Open Letter
          </h3>
          <div className="bg-black/40 p-4 rounded-xl border border-slate-800 mb-4">
            <pre className="text-slate-300 text-xs whitespace-pre-wrap font-serif leading-relaxed">
              {openLetter}
            </pre>
          </div>
          <button 
            onClick={handleShare}
            className="btn-primary w-full py-3 bg-red-600 hover:bg-red-500 shadow-glow flex items-center justify-center gap-2"
          >
            🚀 Share Open Letter to Social Media
          </button>
        </div>
      )}

      {/* Timeline */}
      <div className="card">
        <h3 className="text-white font-semibold mb-5">Status Timeline</h3>
        <div className="space-y-4">
          {TIMELINE_STEPS.map((step, idx) => {
            const done = idx <= currentStep;
            const active = idx === currentStep;
            return (
              <div key={step.status} className={`relative flex gap-4 timeline-item ${done ? '' : 'opacity-40'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 transition-all ${
                  active ? 'bg-civic-600 ring-4 ring-civic-500/30 scale-110' :
                  done ? 'bg-accent-500/20 border border-accent-500/30' : 'bg-slate-800 border border-slate-700'
                }`}>
                  {step.icon}
                </div>
                <div className="flex-1 pb-4">
                  <p className={`font-semibold text-sm ${active ? 'text-civic-300' : done ? 'text-white' : 'text-slate-500'}`}>{step.label}</p>
                  <p className="text-slate-400 text-xs mt-0.5">{step.desc}</p>
                  {active && (
                    <p className="text-xs text-civic-400 mt-1">Last updated: {timeAgo(complaint.updatedAt)}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Department */}
      <div className="card">
        <h3 className="text-white font-semibold mb-3">Assigned Department</h3>
        <div className="flex items-start gap-4">
          <span className="text-3xl">{dept.icon}</span>
          <div>
            <p className="text-white font-medium">{dept.name}</p>
            <p className="text-slate-400 text-sm mt-1">📞 {dept.phone}</p>
            <p className="text-slate-400 text-sm">✉️ {dept.email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StatusTracker() {
  const { t } = useLanguage();
  const [params] = useSearchParams();
  const [searchId, setSearchId] = useState(params.get('id') || '');
  const [complaints, setComplaints] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    getComplaints().then(data => { setComplaints(data); setLoading(false); });
  }, []);

  useEffect(() => {
    const id = params.get('id');
    if (id && complaints.length > 0) {
      const found = complaints.find(c => c.id === id);
      if (found) setSelected(found);
    }
  }, [params, complaints]);

  const handleSearch = () => {
    const found = complaints.find(c => c.id.toLowerCase() === searchId.trim().toLowerCase());
    if (found) setSelected(found);
    else toast.error('Complaint ID not found. Try: CMP-2024-001');
  };

  const filtered = filter === 'All' ? complaints : complaints.filter(c => c.status === filter);

  return (
    <div className="page-wrapper">
      <div className="page-container">
        <div className="mb-8 animate-fade-in">
          <h1 className="section-title text-4xl">{t('track')}</h1>
          <p className="text-slate-400">{t('heroSub')}</p>
        </div>

        {selected ? (
          <DetailView complaint={selected} onBack={() => setSelected(null)} />
        ) : (
          <>
            {/* Search */}
            <div className="card mb-6 animate-slide-up">
              <p className="text-slate-300 font-medium mb-3">🔍 {t('search')}</p>
              <div className="flex gap-3">
                <input
                  value={searchId}
                  onChange={e => setSearchId(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  className="input flex-1"
                  placeholder="e.g. CMP-2024-001"
                />
                <button onClick={handleSearch} className="btn-primary px-5 flex items-center gap-2">
                  <FiSearch /> {t('search') || 'Search'}
                </button>
              </div>
            </div>

            {/* Filter */}
            <div className="flex gap-2 mb-6 flex-wrap">
              {['All', 'Pending', 'In Progress', 'Resolved'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    filter === f ? 'bg-civic-600 text-white shadow-glow' : 'glass text-slate-400 hover:text-white border border-slate-700 hover:border-civic-500/40'
                  }`}
                >
                  {/* Use the correct key: 'inprogress' not 'in progress' */}
                  {f === 'In Progress' ? t('inprogress') : (t(f.toLowerCase()) || f)}{' '}
                  {f === 'All' ? `(${complaints.length})` : `(${complaints.filter(c => c.status === f).length})`}
                </button>
              ))}
            </div>

            {/* List */}
            {loading ? <LoadingSpinner text="Loading complaints..." /> : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map(c => (
                  <div key={c.id} onClick={() => setSelected(c)} className="cursor-pointer">
                    <IssueCard complaint={c} showLink={false} />
                  </div>
                ))}
                {filtered.length === 0 && (
                  <div className="col-span-3 text-center py-16 text-slate-500">
                    <p className="text-5xl mb-4">🔍</p>
                    <p className="text-lg">No complaints found for this filter.</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
