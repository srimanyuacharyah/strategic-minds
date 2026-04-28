import { FiZap, FiInfo } from 'react-icons/fi';
import { CATEGORY_COLORS, DEPARTMENTS } from '../data/mockData';

export default function AIConfidenceBadge({ category, confidence, reasoning }) {
  if (!category) return null;
  const cat = CATEGORY_COLORS[category] || CATEGORY_COLORS.Other;
  const dept = DEPARTMENTS[category] || DEPARTMENTS.Other;

  return (
    <div className="rounded-2xl border border-civic-500/30 bg-gradient-to-br from-civic-900/40 to-slate-900/40 p-4 animate-fade-in">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-civic-500/20 flex items-center justify-center">
          <FiZap size={14} className="text-civic-400" />
        </div>
        <span className="text-civic-400 font-semibold text-sm">AI Classification Result</span>
      </div>

      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl">{dept.icon}</span>
        <div>
          <p className="text-white font-bold text-lg">{category}</p>
          <p className="text-slate-400 text-sm">{dept.name}</p>
        </div>
      </div>

      {/* Confidence bar */}
      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-slate-400">AI Confidence</span>
          <span className="text-xs font-bold text-civic-300">{confidence}%</span>
        </div>
        <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-civic-500 to-sky-400 transition-all duration-700"
            style={{ width: `${confidence}%` }}
          />
        </div>
      </div>

      {/* Department routing */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-slate-800/50 rounded-lg p-2">
          <p className="text-slate-500 mb-0.5">Routed to</p>
          <p className="text-slate-200 font-medium">{dept.name.split('(')[0].trim()}</p>
        </div>
        <div className="bg-slate-800/50 rounded-lg p-2">
          <p className="text-slate-500 mb-0.5">Helpline</p>
          <p className="text-civic-300 font-mono font-medium">{dept.phone}</p>
        </div>
      </div>

      {reasoning && (
        <div className="mt-3 flex items-start gap-2 text-xs text-slate-400">
          <FiInfo size={12} className="text-civic-400 mt-0.5 shrink-0" />
          <span>{reasoning}</span>
        </div>
      )}
    </div>
  );
}
