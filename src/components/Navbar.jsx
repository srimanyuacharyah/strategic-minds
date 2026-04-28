import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiMenu, FiX, FiShield } from 'react-icons/fi';

const links = [
  { path: '/', label: 'Home' },
  { path: '/report', label: 'Report Issue' },
  { path: '/status', label: 'Track Status' },
  { path: '/navigator', label: 'Find Service' },
  { path: '/feedback', label: 'Feedback' },
  { path: '/admin', label: '🏛️ Admin' },
];

export default function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => setOpen(false), [location]);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass-dark shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 bg-gradient-to-br from-civic-500 to-sky-500 rounded-xl flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
            <FiShield className="text-white text-lg" />
          </div>
          <span className="text-white font-bold text-xl tracking-tight">
            Civic<span className="gradient-text">AI</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          {links.map(l => (
            <Link
              key={l.path}
              to={l.path}
              className={`nav-link ${location.pathname === l.path ? 'nav-link-active' : ''}`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:block">
          <Link to="/report" className="btn-primary py-2 px-4 text-sm">
            Report Issue
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-slate-300 hover:text-white transition-colors"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden glass-dark border-t border-slate-700/50 px-4 py-4 flex flex-col gap-3 animate-slide-up">
          {links.map(l => (
            <Link
              key={l.path}
              to={l.path}
              className={`nav-link text-base py-2 border-b border-slate-800 ${location.pathname === l.path ? 'nav-link-active' : ''}`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </nav>
  );
}
