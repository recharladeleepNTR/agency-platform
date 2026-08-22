import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clapperboard, Eye, EyeOff, KeyRound } from 'lucide-react';

const Login = () => {
  const [email, setEmail]       = useState('admin@lazydition.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError]       = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Default admin credential fallback for easy dashboard access
    if (email.trim() === 'admin@lazydition.com' && password === 'admin123') {
      localStorage.setItem('adminToken', 'true');
      setLoading(false);
      navigate('/admin');
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
      localStorage.setItem('adminToken', 'true');
      navigate('/admin');
    } catch {
      setError('Invalid credentials. Use admin@lazydition.com / admin123');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = 'w-full bg-[#180926] border-2 border-lazyAccent/35 text-white font-medium rounded-xl px-4 py-3.5 focus:outline-none focus:border-lazyAccent focus:ring-2 focus:ring-lazyAccent/50 transition-all placeholder:text-white/40 text-sm shadow-inner';

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-6 relative bg-lazyBg">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-lazyAccent/10 rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Card */}
        <div className="bg-[#140622] border-2 border-lazyAccent/30 rounded-3xl p-8 md:p-10 shadow-[0_0_50px_rgba(148,148,255,0.15)]">
          {/* Logo */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lazyAccent to-lazyDeep flex items-center justify-center shadow-lg">
              <Clapperboard className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white">
              Lazy<span className="text-lazyAccent">dition</span>
            </span>
          </div>

          <h1 className="text-2xl font-black text-center text-white mb-1 tracking-tight">Admin Login</h1>
          <p className="text-lazyText/60 text-sm text-center mb-6 font-medium">Sign in to manage your platform</p>

          {/* Preset Credentials Hint Box */}
          <div className="mb-6 p-4 rounded-xl bg-lazyAccent/10 border border-lazyAccent/30 text-xs text-lazyText flex items-center gap-3">
            <KeyRound className="w-5 h-5 text-lazyAccent flex-shrink-0" />
            <div>
              <p className="font-extrabold text-white">Default Admin Credentials:</p>
              <p className="text-white/80 font-mono mt-0.5">Email: admin@lazydition.com</p>
              <p className="text-white/80 font-mono">Password: admin123</p>
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center font-bold"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-extrabold text-white mb-2">Email</label>
              <input
                type="email" required
                value={email} onChange={(e) => setEmail(e.target.value)}
                className={inputCls} placeholder="admin@lazydition.com"
              />
            </div>
            <div>
              <label className="block text-sm font-extrabold text-white mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'} required
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className={`${inputCls} pr-12`} placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-lazyAccent hover:text-white transition-colors"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full mt-3 bg-gradient-to-r from-lazyAccent to-lazyDeep text-white font-extrabold py-4 rounded-xl transition-all shadow-[0_0_24px_rgba(148,148,255,0.3)] hover:shadow-[0_0_40px_rgba(148,148,255,0.5)] disabled:opacity-50 flex items-center justify-center gap-2 text-base"
            >
              {loading
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</>
                : 'Sign In to Dashboard'
              }
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
