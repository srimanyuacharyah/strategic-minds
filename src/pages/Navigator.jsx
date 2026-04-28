import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiExternalLink, FiPhone, FiMail } from 'react-icons/fi';
import { NAVIGATOR_FLOW, DEPARTMENTS } from '../data/mockData';

export default function Navigator() {
  const [history, setHistory] = useState(['start']);
  const current = history[history.length - 1];
  const node = NAVIGATOR_FLOW[current];

  const choose = (next) => setHistory(h => [...h, next]);
  const back = () => setHistory(h => h.length > 1 ? h.slice(0, -1) : h);
  const reset = () => setHistory(['start']);

  const dept = node?.result ? DEPARTMENTS[node.result.dept] || DEPARTMENTS.Other : null;
  const isEmergency = node?.result?.title?.includes('EMERGENCY');

  return (
    <div className="page-wrapper">
      <div className="page-container max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="section-title text-4xl">🧭 Service Navigator</h1>
          <p className="text-slate-400">Answer a few questions and we'll guide you to the exact government service you need.</p>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {history.map((id, i) => {
            const n = NAVIGATOR_FLOW[id];
            const label = i === 0 ? 'Start' : id.replace('_result', '').replace(/_/g, ' ');
            return (
              <span key={id} className="flex items-center gap-2">
                {i > 0 && <span className="text-slate-600">›</span>}
                <span className={`text-xs px-2 py-1 rounded-lg capitalize ${i === history.length - 1 ? 'bg-civic-600/30 text-civic-300 border border-civic-500/30' : 'text-slate-500'}`}>
                  {label}
                </span>
              </span>
            );
          })}
        </div>

        {/* Card */}
        <div className="card animate-slide-up">
          {node?.result ? (
            /* RESULT */
            <div>
              {isEmergency && (
                <div className="bg-red-500/20 border border-red-500/40 rounded-xl p-3 mb-4 text-center">
                  <p className="text-red-300 font-bold text-sm">⚠️ THIS IS AN EMERGENCY — CALL IMMEDIATELY</p>
                </div>
              )}
              <h2 className="text-xl font-bold text-white mb-4">{node.result.title}</h2>

              {/* Department */}
              {dept && (
                <div className="bg-civic-900/30 border border-civic-500/20 rounded-xl p-4 mb-5">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-3xl">{dept.icon}</span>
                    <div>
                      <p className="text-white font-semibold">{dept.name}</p>
                      <p className="text-slate-400 text-sm">Assigned Department</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <a href={`tel:${dept.phone}`} className="flex items-center gap-2 text-sm text-civic-300 hover:text-white transition-colors">
                      <FiPhone size={13} /> {dept.phone}
                    </a>
                    <a href={`mailto:${dept.email}`} className="flex items-center gap-2 text-sm text-civic-300 hover:text-white transition-colors">
                      <FiMail size={13} /> {dept.email}
                    </a>
                  </div>
                </div>
              )}

              {/* Steps */}
              <div className="mb-4">
                <p className="text-slate-300 font-semibold text-sm mb-3">📋 What to do:</p>
                <ol className="space-y-3">
                  {node.result.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <span className="w-6 h-6 bg-civic-600/30 text-civic-400 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">{i + 1}</span>
                      <span className="text-slate-300 text-sm leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Tip */}
              {node.result.tip && (
                <div className="bg-accent-500/10 border border-accent-500/20 rounded-xl p-3 mb-5">
                  <p className="text-accent-400 text-sm">💡 <strong>Pro tip:</strong> {node.result.tip}</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <Link to="/report" className="btn-primary flex-1 text-center flex items-center justify-center gap-2">
                  📸 Report This Issue <FiExternalLink size={14} />
                </Link>
                <button onClick={reset} className="btn-secondary flex-1">Start Over</button>
              </div>
            </div>
          ) : (
            /* QUESTION */
            <div>
              <p className="text-slate-400 text-sm mb-2 font-medium">Step {history.length} of ~3</p>
              <h2 className="text-xl font-bold text-white mb-6">{node?.question}</h2>
              <div className="space-y-3">
                {node?.options?.map((opt) => (
                  <button
                    key={opt.next}
                    onClick={() => choose(opt.next)}
                    className="w-full text-left glass hover:bg-civic-500/10 border border-slate-700 hover:border-civic-500/40 rounded-xl px-5 py-4 text-slate-200 hover:text-white transition-all duration-200 hover:translate-x-1 font-medium"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        {history.length > 1 && (
          <div className="mt-4">
            <button onClick={back} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors">
              <FiArrowLeft size={14} /> Go Back
            </button>
          </div>
        )}

        {/* Info panel */}
        <div className="mt-8 card bg-slate-900/40">
          <p className="text-slate-400 text-sm font-medium mb-3">🏛️ All Government Departments</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {Object.entries(DEPARTMENTS).map(([key, d]) => (
              <div key={key} className="flex items-center gap-2 text-xs text-slate-400">
                <span>{d.icon}</span>
                <span className="truncate">{d.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
