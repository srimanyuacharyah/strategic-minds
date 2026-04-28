import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiShield, FiMapPin, FiZap, FiBarChart2, FiUsers } from 'react-icons/fi';
import StatsCounter from '../components/StatsCounter';

import { useLanguage } from '../context/LanguageContext';

const SERVICES = ['Water Supply', 'Electricity', 'Waste Management', 'Public Services', 'Roads'];

export default function Landing() {
  const { t } = useLanguage();
  const [typedText, setTypedText] = useState('');
  const [serviceIndex, setServiceIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentService = SERVICES[serviceIndex];
    const typeSpeed = isDeleting ? 50 : 100;
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        setTypedText(currentService.substring(0, typedText.length + 1));
        if (typedText.length === currentService.length) {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        setTypedText(currentService.substring(0, typedText.length - 1));
        if (typedText.length === 0) {
          setIsDeleting(false);
          setServiceIndex((serviceIndex + 1) % SERVICES.length);
        }
      }
    }, typeSpeed);

    return () => clearTimeout(timeout);
  }, [typedText, isDeleting, serviceIndex]);

  return (
    <div className="min-h-screen bg-slate-950 overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-gradient-to-b from-civic-600/30 to-transparent blur-[140px] pointer-events-none" />
      
      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-4">
        <div className="max-w-full mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass border border-civic-500/30 mb-10 animate-float">
            <span className="w-3 h-3 bg-civic-400 rounded-full animate-ping" />
            <span className="text-civic-300 text-sm font-black uppercase tracking-widest">{t('heroBadge') || 'Live: Building the Digital Bridge'}</span>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black text-white mb-8 tracking-tighter">
            {t('heroTitle')} <br />
            <span className="gradient-text glow-text min-h-[1.2em] inline-block">
              {typedText}<span className="animate-pulse ml-1">|</span>
            </span>
          </h1>
          
          <p className="text-slate-400 text-xl md:text-3xl max-w-5xl mx-auto mb-14 animate-slide-up font-medium leading-relaxed">
            {t('heroSub')}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 animate-slide-up" style={{ animationDelay: '200ms' }}>
            <Link to="/signup" className="btn-primary w-full sm:w-auto px-12 py-5 text-xl flex items-center justify-center gap-3 group shadow-glow">
              {t('movement') || 'Join the Movement'} <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
            </Link>
            <Link to="/home" className="btn-secondary w-full sm:w-auto px-12 py-5 text-xl">
              {t('dashboardBtn') || 'Launch Dashboard'}
            </Link>
          </div>
        </div>
      </section>

      {/* Animated Service Symbols Track */}
      <div className="bg-slate-900/40 py-10 border-y border-white/5 relative overflow-hidden">
        <div className="flex items-center gap-20 animate-bridge whitespace-nowrap">
          { [
            { icon: '🛣️', label: 'Road Works' },
            { icon: '🚰', label: 'Water Supply' },
            { icon: '💡', label: 'Electricity' },
            { icon: '🗑️', label: 'Waste Management' },
            { icon: '🌳', label: 'Public Parks' },
            { icon: '🏥', label: 'Health Services' },
            { icon: '👮', label: 'Public Safety' },
            { icon: '🚌', label: 'Transit' },
            { icon: '🏗️', label: 'Infrastructure' },
          ].map((s, i) => (
            <div key={i} className="flex items-center gap-4 group">
              <span className="text-4xl group-hover:scale-125 transition-transform">{s.icon}</span>
              <span className="text-slate-400 font-black uppercase tracking-widest text-lg">{s.label}</span>
            </div>
          ))}
          {/* Duplicate for seamless loop if needed, but animate-bridge is linear */}
        </div>
      </div>

      {/* Broad Stats Display */}
      <section className="py-32 px-6">
        <div className="max-w-full mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-black text-white mb-4">Live Performance Metrics</h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              Transforming citizen complaints into structured, actionable government intelligence.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <StatsCounter value={98} label="Resolved Complaints" icon="✅" suffix="%" />
            <StatsCounter value={1450} label="Reports Received" icon="📥" />
            <StatsCounter value={12} label="Pending Action" icon="⏳" suffix="%" />
            <StatsCounter value={45} label="In Progress" icon="⚙️" suffix="%" />
          </div>
        </div>
      </section>

      {/* Smart Bridge Flow Visualization */}
      <section className="relative py-32 overflow-hidden bg-slate-950">
        <div className="max-w-full mx-auto px-6 relative">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16 relative z-10">
            {/* Citizen Hub */}
            <div className="flex flex-col items-center gap-6 group">
              <div className="relative">
                <div className="absolute -inset-8 bg-civic-500/20 rounded-full blur-3xl group-hover:bg-civic-500/40 transition-all duration-500" />
                <div className="relative w-32 h-32 bg-slate-800 rounded-[2.5rem] flex items-center justify-center border-2 border-civic-500/30 shadow-glow">
                  <FiUsers size={60} className="text-civic-400" />
                </div>
              </div>
              <h3 className="text-white font-black tracking-[0.2em] uppercase text-sm">Citizen Hub</h3>
            </div>

            {/* The Bridge */}
            <div className="flex-1 w-full h-40 relative hidden lg:block">
              <div className="absolute top-1/2 left-0 right-0 h-1.5 bg-gradient-to-r from-civic-500/20 via-civic-400 to-sky-500/20 rounded-full shadow-[0_0_20px_rgba(99,102,241,0.3)]" />
              {[
                { icon: '📄', label: 'Report', delay: '0s' },
                { icon: '🤖', label: 'AI Analysis', delay: '2s' },
                { icon: '📡', label: 'Routing', delay: '4s' }
              ].map((item, i) => (
                <div key={i} className="absolute top-1/2 -translate-y-1/2 animate-bridge" style={{ animationDelay: item.delay }}>
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center border-2 border-civic-400/50 shadow-2xl">
                      <span className="text-2xl">{item.icon}</span>
                    </div>
                    <span className="text-lg text-civic-300 font-black uppercase tracking-tighter">{item.label}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Government Hub */}
            <div className="flex flex-col items-center gap-6 group">
              <div className="relative">
                <div className="absolute -inset-8 bg-sky-500/20 rounded-full blur-3xl group-hover:bg-sky-500/40 transition-all duration-500" />
                <div className="relative w-32 h-32 bg-slate-800 rounded-[2.5rem] flex items-center justify-center border-2 border-sky-500/30 shadow-glow">
                  <FiShield size={60} className="text-sky-400" />
                </div>
              </div>
              <h3 className="text-white font-black tracking-[0.2em] uppercase text-sm">Government Portal</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4 bg-slate-950">
        <div className="max-w-full mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<FiZap className="text-civic-400" />}
              title={t('feat1Title') || 'AI Classification'}
              description={t('feat1Desc') || 'Our advanced AI automatically categorizes reports with 95% accuracy.'}
            />
            <FeatureCard 
              icon={<FiMapPin className="text-sky-400" />}
              title={t('feat2Title') || 'Smart Geolocation'}
              description={t('feat2Desc') || 'Precise issue tracking with interactive heatmaps for priority zones.'}
            />
            <FeatureCard 
              icon={<FiShield className="text-accent-400" />}
              title={t('feat3Title') || 'Verified Governance'}
              description={t('feat3Desc') || 'Transparent tracking from submission to resolution.'}
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto card bg-gradient-to-r from-civic-900/40 to-slate-900/40 border border-civic-500/20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <StatItem label="Active Users" value="12k+" />
            <StatItem label="Issues Resolved" value="8,400+" />
            <StatItem label="Avg Response" value="2.4h" />
            <StatItem label="Departments" value="15+" />
          </div>
        </div>
      </section>

      {/* Footer-like CTA */}
      <section className="py-32 px-4 text-center">
        <h2 className="text-4xl font-bold text-white mb-8">Ready to make an impact?</h2>
        <Link to="/report" className="btn-primary px-10 py-5 text-xl font-bold rounded-2xl shadow-glow transition-all hover:scale-105 active:scale-95 inline-flex items-center gap-3">
          Report Your First Issue <FiArrowRight />
        </Link>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="card hover:border-civic-500/40 transition-all duration-300 group">
      <div className="w-12 h-12 bg-slate-800 rounded-xl flex items-center justify-center text-2xl mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-slate-400 text-base leading-relaxed">{description}</p>
    </div>
  );
}

function StatItem({ label, value }) {
  return (
    <div>
      <p className="text-3xl md:text-4xl font-black text-white mb-1">{value}</p>
      <p className="text-slate-500 text-base font-medium uppercase tracking-wider">{label}</p>
    </div>
  );
}
