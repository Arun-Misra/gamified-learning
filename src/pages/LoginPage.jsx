import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { signInWithEmail, signUpWithEmail } from '../services/authService';

export default function LoginPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      if (isSignUp) {
        await signUpWithEmail(email, password);
      } else {
        await signInWithEmail(email, password);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell app-bg-grid flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-5 gap-5 reveal-up">
        <section className="card-strong lg:col-span-2">
          <Link to="/" className="text-sm text-[#1f7a5f] hover:underline inline-block mb-3">
            ← Back to home
          </Link>
          <p className="badge mb-4">Consistency Engine</p>
          <h1 className="heading-display mb-4">Skill Quest</h1>
          <p className="text-muted mb-6">
            Build unstoppable momentum with daily missions, XP rewards, and visible growth.
          </p>

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="badge">Daily missions</span>
              <span className="text-muted">Roadmap-based progress</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="badge">XP + levels</span>
              <span className="text-muted">Game-like motivation loop</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="badge">Streak tracking</span>
              <span className="text-muted">Consistency over intensity</span>
            </div>
          </div>
        </section>

        <section className="card lg:col-span-3">
          <div className="mb-5">
            <h2 className="text-2xl font-bold mb-1">{isSignUp ? 'Create account' : 'Sign in'}</h2>
            <p className="text-muted text-sm">Use email and password to continue.</p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl text-sm bg-red-50 text-red-700 border border-red-200">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="input"
            placeholder="Email"
            required
            autoComplete="email"
          />

          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="input"
            placeholder="Password"
            required
            minLength={6}
            autoComplete={isSignUp ? 'new-password' : 'current-password'}
          />

          {isSignUp && (
            <input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="input"
              placeholder="Confirm password"
              required
              minLength={6}
              autoComplete="new-password"
            />
          )}

          <button type="submit" disabled={loading} className="btn btn-primary w-full">
            {loading ? 'Please wait...' : isSignUp ? 'Create account' : 'Sign in'}
          </button>
        </form>

        <button
          type="button"
          onClick={() => {
            setIsSignUp((previous) => !previous);
            setError(null);
          }}
          className="mt-4 text-sm text-[#1f7a5f] hover:underline"
        >
          {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Create one"}
        </button>

          <p className="text-xs text-muted text-center mt-6">
          By signing in, you agree to our Terms of Service
        </p>
        </section>
      </div>
    </div>
  );
}
