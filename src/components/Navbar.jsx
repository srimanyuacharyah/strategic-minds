import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiLogOut, FiUser, FiZap, FiGlobe } from 'react-icons/fi';
import { supabase } from '../config/supabase';
import toast from 'react-hot-toast';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar() {
  const { lang, setLang, t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [user, setUser] = useState(null);

  const navLinks = [
    { path: '/home', label: t('dashboard') },
    { path: '/report', label: t('reportButton') },
    { path: '/status', label: t('track') || 'Track Status' },
    { path: '/navigator', label: t('navigator') || 'Find Service' },
    { path: '/admin', label: t('admin') || 'Admin' },
  ];

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    
    return () => {
      window.removeEventListener('scroll', handler);
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => setOpen(false), [location]);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Logged out successfully');
      navigate('/');
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass-dark shadow-lg' : 'bg-transparent'}`}>
      <div className="max-w-full mx-auto px-6 md:px-12 h-20 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-10 h-10 bg-gradient-to-br from-civic-500 to-sky-500 rounded-xl flex items-center justify-center shadow-glow group-hover:scale-110 transition-transform">
            <FiZap className="text-white" size={22} />
          </div>
          <span className="text-2xl font-black text-white tracking-tighter">CivicAI</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-6">
          {navLinks.map(l => (
            <Link
              key={l.path}
              to={l.path}
              className={`nav-link ${location.pathname === l.path ? 'nav-link-active' : ''}`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Auth & Lang Buttons */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-2 bg-slate-800/50 p-1 rounded-lg border border-slate-700">
            {['en', 'hi', 'kn'].map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-3 py-1 rounded-md text-xs font-bold uppercase transition-all ${lang === l ? 'bg-civic-600 text-white shadow-glow' : 'text-slate-500 hover:text-slate-300'}`}
              >
                {l}
              </button>
            ))}
          </div>

          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-slate-300 text-sm font-medium">
                <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700">
                  <FiUser size={14} className="text-civic-400" />
                </div>
                <span className="hidden lg:inline">{user.email.split('@')[0]}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="text-slate-400 hover:text-red-400 transition-colors p-2"
                title="Log Out"
              >
                <FiLogOut size={18} />
              </button>
              <Link to="/report" className="btn-primary py-2 px-6 text-base font-bold">
                {t('reportButton')}
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-slate-300 hover:text-white font-semibold text-lg transition-colors">
                {t('login')}
              </Link>
              <Link to="/signup" className="btn-primary py-2 px-6 text-base font-bold">
                {t('signup')}
              </Link>
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden text-slate-300 hover:text-white transition-colors p-2"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden glass-dark border-t border-slate-700/50 px-4 py-6 flex flex-col gap-4 animate-slide-up">
          <div className="flex justify-center gap-4 mb-4">
            {['en', 'hi', 'kn'].map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-4 py-2 rounded-xl text-sm font-bold uppercase ${lang === l ? 'bg-civic-600 text-white' : 'bg-slate-800 text-slate-500'}`}
              >
                {l}
              </button>
            ))}
          </div>
          {navLinks.map(l => (
            <Link
              key={l.path}
              to={l.path}
              className={`nav-link text-xl py-2 ${location.pathname === l.path ? 'nav-link-active' : ''}`}
            >
              {l.label}
            </Link>
          ))}
          <hr className="border-slate-800" />
          {user ? (
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-3 px-1">
                <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center">
                  <FiUser className="text-civic-400" />
                </div>
                <span className="text-slate-300 font-medium text-lg">{user.email}</span>
              </div>
              <button onClick={handleLogout} className="btn-secondary w-full text-red-400 border-red-500/30 text-lg">
                Log Out
              </button>
              <Link to="/report" className="btn-primary w-full text-center text-lg">
                {t('reportButton')}
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Link to="/login" className="btn-secondary w-full text-center">{t('login')}</Link>
              <Link to="/signup" className="btn-primary w-full text-center">{t('signup')}</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
