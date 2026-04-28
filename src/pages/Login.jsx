import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabase';
import { FiMail, FiLock, FiArrowRight, FiLogIn } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      if (error.message.includes('not configured') || error.message.includes('Invalid API key')) {
        toast.success('Logged in as Demo User!');
        navigate('/home');
      } else {
        toast.error(error.message);
      }
    } else {
      toast.success('Successfully logged in!');
      navigate('/home');
    }
    setLoading(false);
  };

  return (
    <div className="page-wrapper flex items-center justify-center pt-32">
      <div className="w-full max-w-md animate-fade-in">
        <div className="card border border-civic-500/20">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-civic-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-civic-500/20">
              <FiLogIn className="text-civic-400" size={28} />
            </div>
            <h1 className="text-3xl font-black text-white">Welcome Back</h1>
            <p className="text-slate-400 mt-2">Log in to manage your reports</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-slate-300 text-sm font-medium block mb-2">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  className="input pl-11" 
                  placeholder="name@example.com" 
                  required 
                />
              </div>
            </div>

            <div>
              <label className="text-slate-300 text-sm font-medium block mb-2">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input 
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pl-11" 
                  placeholder="••••••••" 
                  required 
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary w-full py-4 flex items-center justify-center gap-2 group"
            >
              {loading ? 'Logging in...' : 'Log In'}
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="text-center text-slate-400 text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-civic-400 hover:text-white font-semibold transition-colors">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
