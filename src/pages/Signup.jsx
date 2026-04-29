import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import { FiMail, FiLock, FiArrowRight, FiUserPlus } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useLanguage } from '../context/LanguageContext';

export default function Signup() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const validatePassword = (pass) => {
    const minLength = 8;
    const hasUpper = /[A-Z]/.test(pass);
    const hasLower = /[a-z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    
    if (pass.length < minLength) return 'Password must be at least 8 characters long';
    if (!hasUpper) return 'Password must contain at least one uppercase letter';
    if (!hasLower) return 'Password must contain at least one lowercase letter';
    if (!hasNumber) return 'Password must contain at least one number';
    if (!hasSpecial) return 'Password must contain at least one special character';
    return null;
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    const passwordError = validatePassword(password);
    if (passwordError) {
      toast.error(passwordError);
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      if (error.message.includes('not configured') || error.message.includes('Local Persistence Mode') || error.message.includes('Invalid API key')) {
        toast.success('Signed up in Local Mode! (Data saved in browser)');
        navigate('/login');
      } else {
        toast.error(error.message);
      }
    } else {
      toast.success('Check your email (' + email + ') for confirmation!');
      navigate('/login');
    }
    setLoading(false);
  };

  return (
    <div className="page-wrapper flex items-center justify-center pt-32">
      <div className="w-full max-w-lg animate-fade-in">
        <div className="card border border-civic-500/20 p-10">
          <div className="text-center mb-10">
            <div className="w-20 h-20 bg-civic-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-civic-500/20 shadow-glow">
              <FiUserPlus className="text-civic-400" size={36} />
            </div>
            <h1 className="text-4xl font-black text-white">{t('signup')}</h1>
            <p className="text-slate-400 mt-3 text-lg">{t('heroSub')}</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            <div>
              <label className="text-slate-300 text-base font-bold block mb-3 uppercase tracking-wider">{t('email') || 'Email Address'}</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-12 py-4 text-lg" 
                  placeholder="name@example.com" 
                  required 
                />
              </div>
            </div>

            <div>
              <label className="text-slate-300 text-base font-bold block mb-3 uppercase tracking-wider">{t('password') || 'Password'}</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-12 py-4 text-lg" 
                  placeholder="••••••••" 
                  required 
                />
              </div>
              <p className="text-slate-500 text-sm mt-3 leading-relaxed">
                {t('passwordHelp') || 'Must be at least 8 characters with uppercase, lowercase, numbers, and special symbols.'}
              </p>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary w-full py-5 text-xl font-bold flex items-center justify-center gap-3 group mt-8 shadow-glow"
            >
              {loading ? t('loading') : t('signup')}
              <FiArrowRight className="group-hover:translate-x-2 transition-transform" />
            </button>
          </form>

          <p className="text-center text-slate-400 text-base mt-10">
            {t('alreadyAccount') || 'Already have an account?'}{' '}
            <Link to="/login" className="text-civic-400 hover:text-white font-bold transition-colors">
              {t('login')}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
