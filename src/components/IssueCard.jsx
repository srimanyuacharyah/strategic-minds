import { CATEGORY_COLORS, STATUS_COLORS, DEPARTMENTS } from '../data/mockData';
import { Link } from 'react-router-dom';
import { FiArrowUp, FiMapPin, FiClock } from 'react-icons/fi';

function timeAgo(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function IssueCard({ complaint, showLink = true }) {
  const cat = CATEGORY_COLORS[complaint.category] || CATEGORY_COLORS.Other;
  const st = STATUS_COLORS[complaint.status] || STATUS_COLORS.Pending;
  const dept = DEPARTMENTS[complaint.department] || DEPARTMENTS.Other;

  return (
    <div className="card hover:border-civic-500/30 border border-slate-700/30 transition-all duration-300 hover:shadow-glow group">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className={`badge ${cat.badge}`}>{dept.icon} {complaint.category}</span>
          <span className={`badge ${st.badge}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${st.dot} inline-block`}></span>
            {complaint.status}
          </span>
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

      {/* AI Summary */}
      {complaint.aiSummary && (
        <div className="bg-civic-900/30 border border-civic-500/20 rounded-lg px-3 py-2 mb-3">
          <p className="text-xs text-civic-300 font-medium mb-0.5">🤖 AI Summary</p>
          <p className="text-slate-300 text-sm leading-snug">{complaint.aiSummary}</p>
          {complaint.confidence && (
            <div className="mt-1.5 flex items-center gap-2">
              <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-civic-500 to-sky-500 rounded-full" style={{ width: `${complaint.confidence}%` }} />
              </div>
              <span className="text-xs text-civic-400 font-mono">{complaint.confidence}%</span>
            </div>
          )}
        </div>
      )}

      {/* Location */}
      {complaint.location?.address && (
        <p className="text-slate-400 text-xs flex items-center gap-1 mb-3">
          <FiMapPin size={11} className="text-civic-400" /> {complaint.location.address}
        </p>
      )}

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
