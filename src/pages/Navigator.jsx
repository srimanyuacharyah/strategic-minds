import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiExternalLink, FiPhone, FiMail, FiChevronRight } from 'react-icons/fi';
import { NAVIGATOR_FLOW, DEPARTMENTS } from '../data/mockData';
import { useLanguage } from '../context/LanguageContext';

const GOV_SCHEMES = [
  { name: 'PM Awas Yojana', desc: 'Affordable housing for all – subsidy up to ₹2.67L', url: 'https://pmaymis.gov.in', icon: '🏠', category: 'Housing' },
  { name: 'Ayushman Bharat', desc: 'Health insurance cover of ₹5 lakh per family', url: 'https://pmjay.gov.in', icon: '🏥', category: 'Health' },
  { name: 'PM Kisan Samman', desc: '₹6,000/year direct benefit to farmers', url: 'https://pmkisan.gov.in', icon: '🌾', category: 'Agriculture' },
  { name: 'Ujjwala Yojana', desc: 'Free LPG connections for BPL families', url: 'https://pmuy.gov.in', icon: '🔥', category: 'Energy' },
  { name: 'Digital India', desc: 'e-Governance and digital literacy programmes', url: 'https://digitalindia.gov.in', icon: '💻', category: 'Technology' },
  { name: 'Swachh Bharat', desc: 'Sanitation and clean India mission', url: 'https://swachhbharatmission.gov.in', icon: '🧹', category: 'Sanitation' },
  { name: 'Jal Jeevan Mission', desc: 'Tap water to every rural household by 2024', url: 'https://jaljeevanmission.gov.in', icon: '💧', category: 'Water' },
  { name: 'PM Mudra Yojana', desc: 'Loans up to ₹10L for small businesses', url: 'https://mudra.org.in', icon: '💰', category: 'Finance' },
  { name: 'Ladki Bahin Yojana', desc: 'Women empowerment – ₹1,500/month', url: '#', icon: '👩', category: 'Women' },
  { name: 'Skill India', desc: 'Free skill training and certification', url: 'https://skillindia.gov.in', icon: '🎓', category: 'Education' },
];

const MORE_GOVT_BODIES = [
  { name: 'Health Department', phone: '1800-180-1104', email: 'health@civic.gov.in', icon: '🏥', desc: 'Public health, hospitals, disease control' },
  { name: 'Education Department', phone: '1800-180-2233', email: 'education@civic.gov.in', icon: '📚', desc: 'Schools, colleges, scholarships' },
  { name: 'Environment & Forest', phone: '1800-180-4455', email: 'environment@civic.gov.in', icon: '🌳', desc: 'Pollution control, tree cutting, wildlife' },
  { name: 'Transport Department', phone: '1800-180-6677', email: 'transport@civic.gov.in', icon: '🚌', desc: 'Licenses, permits, public transport' },
  { name: 'Revenue Department', phone: '1800-180-8899', email: 'revenue@civic.gov.in', icon: '📋', desc: 'Land records, property tax, mutations' },
  { name: 'Police Department', phone: '100', email: 'police@civic.gov.in', icon: '🚔', desc: 'Law enforcement, FIR, traffic' },
  { name: 'Fire & Emergency', phone: '101', email: 'fire@civic.gov.in', icon: '🚒', desc: 'Fire safety, rescue operations' },
  { name: 'Women & Child Welfare', phone: '1091', email: 'wcw@civic.gov.in', icon: '👶', desc: 'Protection, counselling, shelters' },
  { name: 'Food & Civil Supplies', phone: '1800-180-3344', email: 'food@civic.gov.in', icon: '🍚', desc: 'Ration cards, PDS, food safety' },
  { name: 'Labour Department', phone: '1800-180-5566', email: 'labour@civic.gov.in', icon: '⚒️', desc: 'Worker rights, wages, disputes' },
];

export default function Navigator() {
  const { t } = useLanguage();
  const [path, setPath] = useState(['start']);
  const [activeTab, setActiveTab] = useState('navigator');
  const current = path[path.length - 1];
  const node = NAVIGATOR_FLOW[current];

  const select = (next) => setPath(p => [...p, next]);
  const goBack = () => setPath(p => p.length > 1 ? p.slice(0, -1) : p);
  const reset = () => { setPath(['start']); };

  return (
    <div className="page-wrapper">
      <div className="page-container max-w-3xl mx-auto">
        <div className="mb-8 animate-fade-in text-center">
          <h1 className="text-4xl font-black text-white mb-2">🧭 {t('findService')}</h1>
          <p className="text-slate-400">{t('heroSub')}</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 mb-8 justify-center animate-slide-up">
          {[
            { key: 'navigator', label: `🧭 ${t('serviceNavigator')}` },
            { key: 'schemes', label: `🏛️ ${t('govSchemes')}` },
            { key: 'bodies', label: `📞 ${t('govBodies')}` },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === tab.key ? 'bg-civic-600 text-white shadow-glow' : 'glass text-slate-400 hover:text-white border border-slate-700/50 hover:border-civic-500/40'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Navigator Tab */}
        {activeTab === 'navigator' && (
          <div className="animate-fade-in">
            {/* Breadcrumb */}
            {path.length > 1 && (
              <div className="flex items-center gap-2 mb-4">
                <button onClick={goBack} className="text-civic-400 hover:text-white transition-colors flex items-center gap-1 text-sm">
                  <FiArrowLeft size={14} /> Back
                </button>
                <span className="text-slate-600">|</span>
                <button onClick={reset} className="text-slate-500 hover:text-white text-sm transition-colors">Start Over</button>
              </div>
            )}

            {/* Question or Result */}
            {node?.question && (
              <div className="card animate-slide-up">
                <h2 className="text-xl font-bold text-white mb-5">{node.question}</h2>
                <div className="grid gap-3">
                  {node.options.map(opt => (
                    <button key={opt.next} onClick={() => select(opt.next)}
                      className="flex items-center justify-between glass hover:border-civic-500/40 border border-slate-700/40 rounded-xl px-5 py-4 transition-all hover:bg-civic-500/5 group text-left">
                      <span className="text-slate-200 group-hover:text-white transition-colors font-medium">{opt.label}</span>
                      <FiChevronRight className="text-slate-500 group-hover:text-civic-400 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {node?.result && (
              <div className="space-y-5 animate-slide-up">
                <div className="card bg-gradient-to-br from-civic-900/40 to-slate-900/40 border border-civic-500/20">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl">{DEPARTMENTS[node.result.dept]?.icon}</span>
                    <h2 className="text-xl font-bold text-white">{node.result.title}</h2>
                  </div>
                  <div className="space-y-3 mb-5">
                    {node.result.steps.map((step, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-7 h-7 bg-civic-500/20 rounded-lg flex items-center justify-center text-civic-400 text-xs font-bold shrink-0 mt-0.5">{i + 1}</div>
                        <p className="text-slate-300 text-sm leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-4 py-3">
                    <p className="text-yellow-300 text-sm">💡 <strong>Pro Tip:</strong> {node.result.tip}</p>
                  </div>
                </div>

                {/* Department contact */}
                {DEPARTMENTS[node.result.dept] && (
                  <div className="card">
                    <h3 className="text-white font-semibold mb-3">📞 Contact Details</h3>
                    <div className="space-y-2">
                      <p className="text-slate-300 text-sm flex items-center gap-2">
                        <FiPhone size={13} className="text-civic-400" /> {DEPARTMENTS[node.result.dept].phone}
                      </p>
                      <p className="text-slate-300 text-sm flex items-center gap-2">
                        <FiMail size={13} className="text-civic-400" /> {DEPARTMENTS[node.result.dept].email}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <button onClick={reset} className="btn-secondary flex-1">{t('startOver')}</button>
                  <Link to="/report" className="btn-primary flex-1 text-center">{t('reportThisIssue')}</Link>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Government Schemes Tab */}
        {activeTab === 'schemes' && (
          <div className="space-y-4 animate-fade-in">
            <p className="text-slate-500 text-sm text-center mb-2">Explore central and state government welfare schemes</p>
            <div className="grid gap-3">
              {GOV_SCHEMES.map(s => (
                <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer"
                  className="card flex items-start gap-4 hover:border-civic-500/30 border border-slate-700/30 transition-all hover:shadow-glow group py-4">
                  <div className="w-12 h-12 bg-civic-500/10 rounded-xl flex items-center justify-center text-2xl shrink-0 group-hover:scale-110 transition-transform">{s.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-bold text-sm group-hover:text-civic-300 transition-colors">{s.name}</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-civic-500/15 text-civic-400 border border-civic-500/20 font-medium">{s.category}</span>
                    </div>
                    <p className="text-slate-400 text-xs leading-relaxed">{s.desc}</p>
                  </div>
                  <FiExternalLink size={14} className="text-slate-500 group-hover:text-civic-400 transition-colors mt-1 shrink-0" />
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Government Bodies Tab */}
        {activeTab === 'bodies' && (
          <div className="space-y-4 animate-fade-in">
            <p className="text-slate-500 text-sm text-center mb-2">Contact details for all government departments</p>

            {/* Existing departments */}
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider px-1">Core Municipal Departments</h3>
            <div className="grid gap-3">
              {Object.entries(DEPARTMENTS).map(([key, dept]) => (
                <div key={key} className="card flex items-center gap-4 py-4 border border-slate-700/30">
                  <span className="text-2xl">{dept.icon}</span>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold text-sm">{dept.name}</h4>
                    <p className="text-slate-400 text-xs mt-0.5">{key} issues</p>
                  </div>
                  <div className="text-right">
                    <a href={`tel:${dept.phone}`} className="text-civic-400 font-mono text-xs font-bold hover:text-white transition-colors block">{dept.phone}</a>
                    <p className="text-slate-500 text-[10px] mt-0.5">{dept.email}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Additional bodies */}
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider px-1 mt-6">Additional Government Bodies</h3>
            <div className="grid gap-3">
              {MORE_GOVT_BODIES.map(b => (
                <div key={b.name} className="card flex items-center gap-4 py-4 border border-slate-700/30 hover:border-civic-500/20 transition-all">
                  <span className="text-2xl">{b.icon}</span>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold text-sm">{b.name}</h4>
                    <p className="text-slate-500 text-xs mt-0.5">{b.desc}</p>
                  </div>
                  <div className="text-right">
                    <a href={`tel:${b.phone}`} className="text-civic-400 font-mono text-xs font-bold hover:text-white transition-colors block">{b.phone}</a>
                    <p className="text-slate-500 text-[10px] mt-0.5">{b.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
