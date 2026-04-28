import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { FiAlertCircle, FiCompass, FiMessageSquare, FiBarChart2, FiArrowRight, FiChevronRight } from 'react-icons/fi';
import StatsCounter from '../components/StatsCounter';
import IssueCard from '../components/IssueCard';
import { getComplaints } from '../services/firebaseService';

const features = [
  { icon: <FiAlertCircle size={24} />, label: 'Report Issue', desc: 'Submit complaints with photo & location. AI auto-classifies and routes instantly.', path: '/report', color: 'from-orange-500/20 to-red-500/10', border: 'border-orange-500/30', btn: 'Report Now' },
  { icon: <FiCompass size={24} />, label: 'Find Service', desc: 'Not sure who to contact? Our AI navigator guides you to the right government service.', path: '/navigator', color: 'from-civic-500/20 to-blue-500/10', border: 'border-civic-500/30', btn: 'Get Guided' },
  { icon: <FiBarChart2 size={24} />, label: 'Track Status', desc: 'Monitor your complaint in real-time from Pending → In Progress → Resolved.', path: '/status', color: 'from-green-500/20 to-teal-500/10', border: 'border-green-500/30', btn: 'Track Now' },
  { icon: <FiMessageSquare size={24} />, label: 'Give Feedback', desc: 'Rate your experience. AI analyses sentiment to improve government responsiveness.', path: '/feedback', color: 'from-purple-500/20 to-pink-500/10', border: 'border-purple-500/30', btn: 'Share Feedback' },
];

const TYPING_WORDS = ['Roads', 'Water Supply', 'Electricity', 'Waste', 'Public Services'];

export default function Home() {
  const [wordIdx, setWordIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [recent, setRecent] = useState([]);

  // Typewriter
  useEffect(() => {
    const word = TYPING_WORDS[wordIdx];
    let timeout;
    if (!isDeleting && displayed.length < word.length) {
      timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 100);
    } else if (!isDeleting && displayed.length === word.length) {
      timeout = setTimeout(() => setIsDeleting(true), 1800);
    } else if (isDeleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length - 1)), 60);
    } else if (isDeleting && displayed.length === 0) {
      setIsDeleting(false);
      setWordIdx((i) => (i + 1) % TYPING_WORDS.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, isDeleting, wordIdx]);

  useEffect(() => {
    getComplaints().then(data => setRecent(data.slice(0, 3)));
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-20 px-4">
        {/* Background blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-civic-600/20 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute top-40 right-1/4 w-80 h-80 bg-sky-600/15 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-0 left-1/2 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass px-4 py-2 rounded-full mb-6 text-sm">
            <span className="w-2 h-2 bg-accent-400 rounded-full animate-ping-slow" />
            <span className="text-civic-300 font-medium">AI-Powered Citizen Platform</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white mb-4 leading-tight tracking-tight">
            Fix Your City's<br />
            <span className="gradient-text">{displayed}</span>
            <span className="animate-pulse text-civic-400">|</span>
          </h1>

          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            CivicAI transforms citizen complaints into <strong className="text-white">structured, actionable intelligence</strong> — guiding you to the right government service in seconds.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/report" className="btn-primary flex items-center gap-2 text-base w-full sm:w-auto justify-center">
              <FiAlertCircle /> Report an Issue
              <FiArrowRight className="ml-1" />
            </Link>
            <Link to="/navigator" className="btn-secondary flex items-center gap-2 text-base w-full sm:w-auto justify-center">
              <FiCompass /> Find the Right Service
            </Link>
          </div>
        </div>

        {/* Floating cards */}
        <div className="hidden lg:flex absolute right-8 top-1/3 flex-col gap-3 animate-float" style={{ animationDelay: '0s' }}>
          <div className="glass rounded-xl px-4 py-3 text-sm max-w-[200px]">
            <span className="text-green-400 font-bold">✓ Resolved</span>
            <p className="text-slate-300 text-xs mt-0.5">Street light fixed in 2 days</p>
          </div>
          <div className="glass rounded-xl px-4 py-3 text-sm max-w-[200px]">
            <span className="text-blue-400 font-bold">🤖 AI Classified</span>
            <p className="text-slate-300 text-xs mt-0.5">Road → PWD Department</p>
          </div>
        </div>
        <div className="hidden lg:block absolute left-8 top-1/2 animate-float" style={{ animationDelay: '2s' }}>
          <div className="glass rounded-xl px-4 py-3 text-sm max-w-[180px]">
            <span className="text-yellow-400 font-bold">📊 97% Confidence</span>
            <p className="text-slate-300 text-xs mt-0.5">Water supply issue detected</p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatsCounter value={1240} label="Issues Reported" icon="📋" />
          <StatsCounter value={891} label="Issues Resolved" icon="✅" />
          <StatsCounter value={97} label="AI Accuracy" icon="🤖" suffix="%" />
          <StatsCounter value={48} label="Avg. Resolution (hrs)" icon="⚡" />
        </div>
      </section>

      {/* Feature Cards */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white mb-2">Everything You Need</h2>
          <p className="text-slate-400">One platform. Every citizen service. Powered by AI.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {features.map((f) => (
            <Link
              key={f.path}
              to={f.path}
              className={`group card bg-gradient-to-br ${f.color} border ${f.border} hover:shadow-glow transition-all duration-300 hover:-translate-y-1`}
            >
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} border ${f.border} flex items-center justify-center text-civic-400 group-hover:scale-110 transition-transform shrink-0`}>
                  {f.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg mb-1 group-hover:text-civic-300 transition-colors">{f.label}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-3">{f.desc}</p>
                  <span className="inline-flex items-center gap-1 text-civic-400 text-sm font-medium group-hover:gap-2 transition-all">
                    {f.btn} <FiChevronRight size={14} />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Issues */}
      {recent.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white">Recent Community Reports</h2>
              <p className="text-slate-400 text-sm mt-1">Live issues reported by citizens</p>
            </div>
            <Link to="/status" className="text-civic-400 hover:text-civic-300 text-sm font-medium flex items-center gap-1 transition-colors">
              View All <FiArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {recent.map(c => <IssueCard key={c.id} complaint={c} />)}
          </div>
        </section>
      )}

      {/* CTA Banner */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <div className="gradient-border rounded-3xl p-8 md:p-12 text-center bg-civic-gradient relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-civic-900/80 to-slate-900/90 rounded-3xl" />
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
              See a Problem? Report It Now.
            </h2>
            <p className="text-slate-300 mb-6 max-w-xl mx-auto">
              AI classifies, routes & summarizes your complaint in seconds. Government dashboard updates instantly.
            </p>
            <Link to="/report" className="btn-primary inline-flex items-center gap-2 text-base">
              <FiAlertCircle /> Start Reporting <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
