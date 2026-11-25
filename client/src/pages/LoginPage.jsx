import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function fillDemoCredentials() {
    setMode('login');
    setEmail('demo@shinehome.studio');
    setPassword('shinehome123');
    setError('');
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 overflow-hidden rounded-[32px] border border-charcoal/10 bg-white shadow-editorial lg:grid-cols-12">
        {/* Left Architectural Visual Panel */}
        <div className="relative hidden lg:col-span-6 lg:block">
          <img
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=85"
            alt="ShineHome Interior Concept"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/25 to-transparent p-10 flex flex-col justify-end text-white">
            <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-terracotta px-3 py-1 text-[11px] font-semibold uppercase tracking-widest">
              <Sparkles className="h-3.5 w-3.5" /> ShineHome Studio
            </span>
            <h2 className="mt-4 font-serif text-3xl font-bold leading-snug">
              Save room concepts, customize warm lighting, and collaborate with architects.
            </h2>
            <p className="mt-2 text-sm text-white/75">
              Your favorites, moodboards, and order history stay synced across every device.
            </p>
          </div>
        </div>

        {/* Right Auth Form Panel */}
        <div className="p-7 sm:p-12 lg:col-span-6">
          <div className="inline-flex rounded-full bg-sand p-1">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError('');
              }}
              className={`rounded-full px-5 py-2 text-xs font-semibold transition ${
                mode === 'login' ? 'bg-charcoal text-cream shadow-sm' : 'text-charcoal/70'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setError('');
              }}
              className={`rounded-full px-5 py-2 text-xs font-semibold transition ${
                mode === 'register' ? 'bg-charcoal text-cream shadow-sm' : 'text-charcoal/70'
              }`}
            >
              Create Account
            </button>
          </div>

          <h1 className="mt-6 font-serif text-3xl font-bold text-charcoal">
            {mode === 'login' ? 'Welcome back to ShineHome' : 'Join ShineHome Studio'}
          </h1>
          <p className="mt-2 text-sm text-charcoal/65">
            {mode === 'login'
              ? 'Sign in to access your saved architectural moodboard and orders.'
              : 'Create a free homeowner account to save designs and order curated pieces.'}
          </p>

          {error && (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {mode === 'register' && (
              <div>
                <label className="text-xs font-semibold text-charcoal/75">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Aria Sterling"
                  className="mt-1.5 w-full rounded-xl border border-charcoal/15 bg-cream/40 px-4 py-3 text-sm focus:border-terracotta focus:outline-none"
                />
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-charcoal/75">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1.5 w-full rounded-xl border border-charcoal/15 bg-cream/40 px-4 py-3 text-sm focus:border-terracotta focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-charcoal/75">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="mt-1.5 w-full rounded-xl border border-charcoal/15 bg-cream/40 px-4 py-3 text-sm focus:border-terracotta focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-charcoal py-3.5 text-sm font-semibold text-cream transition hover:bg-terracotta disabled:opacity-60"
            >
              {submitting
                ? 'Authenticating...'
                : mode === 'login'
                ? 'Sign In'
                : 'Create Account'}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="mt-6 rounded-2xl bg-sand/75 p-4 text-xs">
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="font-semibold text-charcoal">Demo Account Available</p>
                <p className="text-charcoal/65">demo@shinehome.studio &bull; shinehome123</p>
              </div>
              <button
                type="button"
                onClick={fillDemoCredentials}
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white px-3.5 py-2 font-semibold text-charcoal shadow-sm transition hover:bg-terracotta hover:text-white"
              >
                <UserCheck className="h-3.5 w-3.5" />
                Fill Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
