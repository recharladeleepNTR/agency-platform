import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Clapperboard, Eye, EyeOff, KeyRound, Mail, Lock, ShieldCheck, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { apiRequest } from '../api/client';

const Login = () => {
  const [mode, setMode]         = useState('login'); // 'login' | 'send_otp' | 'reset_password'
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  
  // OTP Reset State
  const [otp, setOtp]                 = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const [error, setError]       = useState('');
  const [message, setMessage]   = useState('');
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  // 1. Handle Admin Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    try {
      const res = await apiRequest('POST', '/auth/login', { email: cleanEmail, password });
      if (res.data && res.data.success && res.data.token) {
        localStorage.setItem('adminToken', res.data.token);
        setLoading(false);
        navigate('/admin');
        return;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid User ID or Password.');
      setLoading(false);
      return;
    }

    setError('Invalid User ID or Password.');
    setLoading(false);
  };

  // 2. Handle Send OTP to Email
  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    try {
      const res = await apiRequest('POST', '/auth/send-otp', { email: cleanEmail });
      if (res.data && res.data.success) {
        setMessage(`✅ OTP sent successfully to ${cleanEmail}. Check your inbox!`);
        setMode('reset_password');
      } else {
        setError(res.data?.message || 'Failed to send OTP email.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error connecting to email service.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Handle Verify OTP and Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    const cleanEmail = email.trim().toLowerCase();

    try {
      const res = await apiRequest('POST', '/auth/reset-password', {
        email: cleanEmail,
        otp: otp.trim(),
        newPassword
      });

      if (res.data && res.data.success) {
        setMessage('🎉 Password reset successfully! Logging you into Admin Dashboard...');
        if (res.data.token) {
          localStorage.setItem('adminToken', res.data.token);
        }
        setTimeout(() => {
          navigate('/admin');
        }, 1200);
      } else {
        setError(res.data?.message || 'Invalid or expired OTP code.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid 6-digit OTP code.');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = 'w-full bg-[#180926] border-2 border-lazyAccent/35 text-white font-medium rounded-xl px-4 py-3.5 focus:outline-none focus:border-lazyAccent focus:ring-2 focus:ring-lazyAccent/50 transition-all placeholder:text-white/40 text-sm shadow-inner';

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-6 relative bg-lazyBg py-12">
      {/* Background ambient glow */}
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
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-lazyAccent to-lazyDeep flex items-center justify-center shadow-lg">
              <Clapperboard className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight text-white">
              Lazy<span className="text-lazyAccent">dition</span>
            </span>
          </div>

          {/* Mode Titles */}
          {mode === 'login' && (
            <>
              <h1 className="text-2xl font-black text-center text-white mb-1 tracking-tight">Admin Login</h1>
              <p className="text-lazyText/60 text-sm text-center mb-6 font-medium">Sign in to manage your platform</p>
            </>
          )}

          {mode === 'send_otp' && (
            <>
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={() => { setMode('login'); setError(''); setMessage(''); }}
                  className="text-xs font-bold text-lazyAccent flex items-center gap-1 hover:underline"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
                </button>
              </div>
              <h1 className="text-2xl font-black text-center text-white mb-1 tracking-tight">Forgot Password?</h1>
              <p className="text-lazyText/60 text-sm text-center mb-6 font-medium">We'll send a 6-digit OTP code to your email</p>
            </>
          )}

          {mode === 'reset_password' && (
            <>
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={() => { setMode('send_otp'); setError(''); setMessage(''); }}
                  className="text-xs font-bold text-lazyAccent flex items-center gap-1 hover:underline"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Resend OTP
                </button>
              </div>
              <h1 className="text-2xl font-black text-center text-white mb-1 tracking-tight">Reset Password</h1>
              <p className="text-lazyText/60 text-sm text-center mb-6 font-medium">Enter OTP sent to <span className="text-white font-bold">{email}</span></p>
            </>
          )}



          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="mb-5 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm text-center font-bold"
            >
              {error}
            </motion.div>
          )}

          {message && (
            <motion.div
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              className="mb-5 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm text-center font-bold flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              <span>{message}</span>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {/* ── 1. LOGIN FORM ── */}
            {mode === 'login' && (
              <motion.form key="login-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-extrabold text-white mb-2">User ID / Email</label>
                  <input
                    type="email" required
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    className={inputCls} placeholder="lazydition@gmail.com"
                  />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-extrabold text-white">Password</label>
                    <button
                      type="button"
                      onClick={() => { setMode('send_otp'); setError(''); setMessage(''); }}
                      className="text-xs font-extrabold text-lazyAccent hover:text-white transition-colors"
                    >
                      Forgot Password?
                    </button>
                  </div>
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
                  className="w-full mt-4 bg-gradient-to-r from-lazyAccent to-lazyDeep text-white font-extrabold py-4 rounded-xl transition-all shadow-[0_0_24px_rgba(148,148,255,0.3)] hover:shadow-[0_0_40px_rgba(148,148,255,0.5)] disabled:opacity-50 flex items-center justify-center gap-2 text-base cursor-pointer"
                >
                  {loading
                    ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in...</>
                    : 'Sign In to Dashboard'
                  }
                </motion.button>
              </motion.form>
            )}

            {/* ── 2. SEND OTP FORM ── */}
            {mode === 'send_otp' && (
              <motion.form key="send-otp-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleSendOTP} className="space-y-4">
                <div>
                  <label className="block text-sm font-extrabold text-white mb-2">Admin Email Address</label>
                  <input
                    type="email" required
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    className={inputCls} placeholder="lazydition@gmail.com"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full mt-4 bg-gradient-to-r from-lazyAccent to-lazyDeep text-white font-extrabold py-4 rounded-xl transition-all shadow-[0_0_24px_rgba(148,148,255,0.3)] hover:shadow-[0_0_40px_rgba(148,148,255,0.5)] disabled:opacity-50 flex items-center justify-center gap-2 text-base cursor-pointer"
                >
                  {loading
                    ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending OTP to Email...</>
                    : <><Mail className="w-5 h-5" /> Send 6-Digit OTP Code</>
                  }
                </motion.button>
              </motion.form>
            )}

            {/* ── 3. RESET PASSWORD WITH OTP FORM ── */}
            {mode === 'reset_password' && (
              <motion.form key="reset-password-form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-extrabold text-white mb-2">Enter 6-Digit OTP Code</label>
                  <input
                    type="text" required maxLength={6}
                    value={otp} onChange={(e) => setOtp(e.target.value)}
                    className={`${inputCls} text-center tracking-[0.4em] font-mono text-xl uppercase`} placeholder="123456"
                  />
                </div>

                <div>
                  <label className="block text-sm font-extrabold text-white mb-2">New Password</label>
                  <div className="relative">
                    <input
                      type={showPw ? 'text' : 'password'} required
                      value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                      className={`${inputCls} pr-12`} placeholder="Enter new password"
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
                  className="w-full mt-4 bg-gradient-to-r from-lazyAccent to-lazyDeep text-white font-extrabold py-4 rounded-xl transition-all shadow-[0_0_24px_rgba(148,148,255,0.3)] hover:shadow-[0_0_40px_rgba(148,148,255,0.5)] disabled:opacity-50 flex items-center justify-center gap-2 text-base cursor-pointer"
                >
                  {loading
                    ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Verifying OTP & Resetting...</>
                    : <><ShieldCheck className="w-5 h-5" /> Reset Password & Sign In</>
                  }
                </motion.button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
