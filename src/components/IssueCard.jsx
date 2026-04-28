import { CATEGORY_COLORS, STATUS_COLORS, DEPARTMENTS } from '../data/mockData';
import { Link } from 'react-router-dom';
import { FiArrowUp, FiMapPin, FiClock, FiShield, FiUsers, FiAlertTriangle } from 'react-icons/fi';
import { useState } from 'react';

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

function getDecayInfo(createdAt) {
  const days = Math.floor((Date.now() - new Date(createdAt).getTime()) / (24 * 60 * 60 * 1000));
  if (days < 7) return { label: '7d to Escalation', color: 'text-blue-400', pct: (days/7)*100 };
  if (days < 15) return { label: '15d to Public Flag', color: 'text-orange-400', pct: ((days-7)/8)*100 };
  return { label: '30d to Open Letter', color: 'text-red-500', pct: ((days-15)/15)*100 };
}

export default function IssueCard({ complaint, showLink = true }) {
  const [witnesses, setWitnesses] = useState(complaint.witnesses || 0);
  const [isWitnessed, setIsWitnessed] = useState(false);
  
  const cat = CATEGORY_COLORS[complaint.category] || CATEGORY_COLORS.Other;
  const st = STATUS_COLORS[complaint.status] || STATUS_COLORS.Pending;
  const dept = DEPARTMENTS[complaint.department] || DEPARTMENTS.Other;
  const decay = getDecayInfo(complaint.createdAt);

  const handleVerify = (e) => {
    e.preventDefault();
    if (!isWitnessed) {
      setWitnesses(prev => prev + 1);
      setIsWitnessed(true);
    }
  };

  return (
    <div className="card hover:border-civic-500/30 border border-slate-700/30 transition-all duration-300 hover:shadow-glow group relative">
      {/* Community Verified Badge */}
      {(witnesses >= 3 || complaint.isVerified) && (
        <div className="absolute -top-2 -right-2 bg-gradient-to-r from-civic-600 to-sky-600 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-glow flex items-center gap-1 z-10 border border-white/10">
          <FiShield size={10} /> VERIFIED
        </div>
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`badge ${cat.badge}`}>{dept.icon} {complaint.category}</span>
          <span className={`badge ${st.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${st.dot} inline-block`}></span>
            {complaint.status}
          </span>
          {complaint.escalationLevel > 0 && (
            <span className="badge bg-red-500/10 text-red-400 border-red-500/20">
              <FiAlertTriangle size={10} /> Lvl {complaint.escalationLevel} Escalated
            </span>
          )}
        </div>
        <span className="text-xs text-slate-500 whitespace-nowrap flex items-center gap-1">
          <FiClock size={11} />{timeAgo(complaint.createdAt)}
        </span>
      </div>

      {/* ID */}
      <p className="text-xs text-civic-400 font-mono mb-1">{complaint.id}</p>

      {/* Title */}
      <h3 className="text-white font-semibold text-base mb-2 group-hover:text-civic-300 transition-colors leading-snug">
        {complaint.title}
      </h3>

      {/* Decay Timer */}
      {complaint.status !== 'Resolved' && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${decay.color}`}>{decay.label}</span>
            <span className="text-slate-500 text-[10px]">{timeAgo(complaint.createdAt)} elapsed</span>
          </div>
          <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
            <div className={`h-full bg-current transition-all duration-500 ${decay.color}`} style={{ width: `${decay.pct}%` }} />
          </div>
        </div>
      )}

      {/* AI Summary */}
      {complaint.aiSummary && (
        <div className="bg-civic-900/30 border border-civic-500/20 rounded-lg px-3 py-2 mb-3">
          <p className="text-xs text-civic-300 font-medium mb-0.5">🤖 AI Summary</p>
          <p className="text-slate-300 text-sm leading-snug">{complaint.aiSummary}</p>
        </div>
      )}

      {/* Location */}
      {complaint.location?.address && (
        <p className="text-slate-400 text-xs flex items-center gap-1 mb-3">
          <FiMapPin size={11} className="text-civic-400" /> {complaint.location.address}
        </p>
      )}

      {/* Witness Section */}
      <div className="flex items-center gap-3 mb-4 p-2 bg-slate-800/50 rounded-lg border border-slate-700/30">
        <div className="flex items-center gap-1 text-slate-400 text-[10px] font-medium">
          <FiUsers size={12} className="text-civic-400" /> {witnesses} Witnesses
        </div>
        <button 
          onClick={handleVerify}
          disabled={isWitnessed}
          className={`text-[10px] font-bold px-2 py-1 rounded transition-all ${isWitnessed ? 'bg-green-500/20 text-green-400' : 'bg-civic-500/10 text-civic-400 hover:bg-civic-500/20'}`}
        >
          {isWitnessed ? '✓ Witnessed' : '+ Verify as Witness'}
        </button>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-slate-400 text-xs">
          <FiArrowUp size={12} className="text-civic-400" />
          <span>{complaint.upvotes} upvotes</span>
        </div>
        {showLink && (
          <Link
            to={`/status?id=${complaint.id}`}
            className="text-xs text-civic-400 hover:text-civic-300 font-medium transition-colors"
          >
            View Details →
          </Link>
        )}
      </div>
    </div>
  );
}

