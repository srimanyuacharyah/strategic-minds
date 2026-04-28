import { Link } from 'react-router-dom';
import { FiShield, FiGithub, FiTwitter } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="glass-dark border-t border-slate-800 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-gradient-to-br from-civic-500 to-sky-500 rounded-lg flex items-center justify-center">
                <FiShield className="text-white" />
              </div>
              <span className="text-white font-bold text-lg">CivicAI</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Transforming citizen complaints into structured, actionable government intelligence.
            </p>
          </div>
          <div>
            <h4 className="text-slate-300 font-semibold mb-3">Quick Links</h4>
            <div className="flex flex-col gap-2">
              {[['/', 'Home'], ['/report', 'Report Issue'], ['/status', 'Track Status'], ['/navigator', 'Find Service'], ['/admin', 'Admin Dashboard']].map(([path, label]) => (
                <Link key={path} to={path} className="text-slate-400 hover:text-civic-400 text-sm transition-colors">{label}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-slate-300 font-semibold mb-3">Emergency Helplines</h4>
            <div className="flex flex-col gap-2 text-sm text-slate-400">
              <span>⚡ Electricity Emergency: <span className="text-white">1912</span></span>
              <span>💧 Water Emergency: <span className="text-white">1800-180-5678</span></span>
              <span>🚔 Police: <span className="text-white">100</span></span>
              <span>🚑 Ambulance: <span className="text-white">108</span></span>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">© 2024 CivicAI. Built for citizens, powered by AI.</p>
          <div className="flex items-center gap-4">
            <a href="#" className="text-slate-500 hover:text-white transition-colors"><FiGithub size={18} /></a>
            <a href="#" className="text-slate-500 hover:text-white transition-colors"><FiTwitter size={18} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
