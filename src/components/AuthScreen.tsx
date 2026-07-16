import { useState } from 'react';
import { motion } from 'motion/react';
import { Terminal, Mail, Lock, User, Eye, EyeOff, Sparkles, LogIn, UserPlus, HelpCircle } from 'lucide-react';

interface AuthScreenProps {
  onLoginSuccess: (userData: any, token: string, isRememberMe: boolean, migratingProgress?: any) => void;
  onContinueAsGuest: () => void;
  guestProgressToMigrate?: any;
}

type Mode = 'selection' | 'login' | 'signup' | 'forgot_password';

export default function AuthScreen({
  onLoginSuccess,
  onContinueAsGuest,
  guestProgressToMigrate,
}: AuthScreenProps) {
  const [mode, setMode] = useState<Mode>('selection');
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  
  // Error / Loading / Success statuses
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setError(null);
    setForgotSuccess(null);
  };

  const handleBackToSelection = () => {
    setMode('selection');
    resetForm();
  };

  const handleSwitchToLogin = () => {
    setMode('login');
    resetForm();
  };

  const handleSwitchToSignup = () => {
    setMode('signup');
    resetForm();
  };

  const handleSwitchToForgot = () => {
    setMode('forgot_password');
    resetForm();
  };

  // Submit Login
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to login');
      }

      onLoginSuccess(data, data.token, rememberMe, guestProgressToMigrate);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Submit Register
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      onLoginSuccess(data, data.token, rememberMe, guestProgressToMigrate);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Simulated Forgot Password Recovery
  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError(null);

    setTimeout(() => {
      setForgotSuccess(`Success! A password recovery email has been simulated and sent to ${email}. In a live server, this will reset your hash safely.`);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4" id="auth_container">
      <div className="w-full max-w-md bg-white border border-sky-100 rounded-3xl shadow-xl overflow-hidden p-8 space-y-6">
        
        {/* Animated Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex p-3.5 bg-gradient-to-br from-blue-500 to-sky-400 rounded-2xl shadow-md mx-auto">
            <Terminal className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Pybe
            </h1>
            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">
              Interactive Game-Based Python Tutor
            </p>
          </div>
          {guestProgressToMigrate && (
            <div className="bg-amber-50 text-amber-800 text-xs font-semibold p-2.5 rounded-xl border border-amber-200">
              ⚡ <strong>Migrating Progress:</strong> Your guest achievements (including {guestProgressToMigrate.xp} XP & lesson completions) will be saved securely to your new account!
            </div>
          )}
        </div>

        {/* MODE 1: SELECTION SCREEN */}
        {mode === 'selection' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="text-center pb-2">
              <h2 className="text-sm text-slate-600 font-bold">
                Choose how you want to start learning Python:
              </h2>
            </div>

            <button
              id="btn_to_login"
              onClick={handleSwitchToLogin}
              className="w-full flex items-center justify-between p-5 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-2xl shadow-md transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer"
            >
              <div className="flex items-center gap-3.5 text-left">
                <div className="p-2 bg-white/20 rounded-xl">
                  <LogIn className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-black text-sm">Login / Sign Up</div>
                  <div className="text-[11px] text-sky-100 font-medium">Sync achievements & study cross-device</div>
                </div>
              </div>
              <Sparkles className="h-4 w-4 text-sky-200" />
            </button>

            <button
              id="btn_to_guest"
              onClick={onContinueAsGuest}
              className="w-full flex items-center justify-between p-5 bg-white border border-slate-200 hover:border-blue-300 hover:bg-slate-50 text-slate-700 rounded-2xl shadow-sm transition-all duration-200 transform hover:-translate-y-0.5 cursor-pointer"
            >
              <div className="flex items-center gap-3.5 text-left">
                <div className="p-2 bg-slate-100 text-slate-500 rounded-xl">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-black text-sm text-slate-800">Continue as Guest</div>
                  <div className="text-[11px] text-slate-400 font-medium">Learn offline, progress saved locally</div>
                </div>
              </div>
            </button>
            
            <div className="text-center pt-2 text-[10px] text-slate-400 font-bold">
              🔒 Safe & Secure JWT & Password Hashing Active
            </div>
          </motion.div>
        )}

        {/* MODE 2: LOGIN FORM */}
        {mode === 'login' && (
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center pb-1">
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">Log In</h2>
              <button onClick={handleSwitchToSignup} className="text-xs text-blue-600 font-bold hover:underline cursor-pointer">
                Create an Account
              </button>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {error && (
                <div className="bg-rose-50 text-rose-700 text-xs font-semibold p-3 rounded-xl border border-rose-200">
                  ⚠️ {error}
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="learner@pyverse.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">Password</label>
                  <button type="button" onClick={handleSwitchToForgot} className="text-[10px] text-blue-600 font-bold hover:underline cursor-pointer">
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-3.5 w-3.5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-[11px] text-slate-500 font-bold">Remember Me</span>
                </label>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleBackToSelection}
                  className="flex-1 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {loading ? 'Logging In...' : 'Log In'}
                  <LogIn className="h-3.5 w-3.5" />
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* MODE 3: SIGNUP FORM */}
        {mode === 'signup' && (
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center pb-1">
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">Sign Up</h2>
              <button onClick={handleSwitchToLogin} className="text-xs text-blue-600 font-bold hover:underline cursor-pointer">
                Already have an Account?
              </button>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              {error && (
                <div className="bg-rose-50 text-rose-700 text-xs font-semibold p-3 rounded-xl border border-rose-200">
                  ⚠️ {error}
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">Your Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ravi Kumar"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ravi@pyverse.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Verify password"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleBackToSelection}
                  className="flex-1 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {loading ? 'Creating...' : 'Sign Up'}
                  <UserPlus className="h-3.5 w-3.5" />
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* MODE 4: FORGOT PASSWORD */}
        {mode === 'forgot_password' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-4"
          >
            <div className="pb-1">
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-wider">Password Recovery</h2>
              <p className="text-[11px] text-slate-500 font-medium mt-1">
                Enter your account email to receive simulation password recovery instructions.
              </p>
            </div>

            <form onSubmit={handleForgotSubmit} className="space-y-4">
              {error && (
                <div className="bg-rose-50 text-rose-700 text-xs font-semibold p-3 rounded-xl border border-rose-200">
                  ⚠️ {error}
                </div>
              )}

              {forgotSuccess && (
                <div className="bg-emerald-50 text-emerald-800 text-xs font-medium p-3 rounded-xl border border-emerald-200">
                  💡 {forgotSuccess}
                </div>
              )}

              <div className="space-y-1">
                <label className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="learner@pyverse.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={handleSwitchToLogin}
                  className="flex-1 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 text-xs font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  Back to Login
                </button>
                <button
                  type="submit"
                  disabled={loading || !!forgotSuccess}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {loading ? 'Sending...' : 'Reset Password'}
                  <HelpCircle className="h-3.5 w-3.5" />
                </button>
              </div>
            </form>
          </motion.div>
        )}

      </div>
    </div>
  );
}
