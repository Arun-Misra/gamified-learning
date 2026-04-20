import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { signInWithGoogle } from '../services/authService';

export default function LoginPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (user) {
    navigate('/onboarding');
    return null;
  }

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      navigate('/onboarding');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="card max-w-md w-full mx-4">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">Skill Quest</h1>
        <p className="text-gray-600 mb-6">
          Turn your learning journey into an epic adventure with daily missions and gamified progress.
        </p>

        {error && (
          <div className="mb-4 p-3 bg-danger/10 text-danger rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="btn btn-primary w-full"
        >
          {loading ? 'Signing in...' : 'Sign in with Google'}
        </button>

        <p className="text-xs text-gray-500 text-center mt-6">
          By signing in, you agree to our Terms of Service
        </p>
      </div>
    </div>
  );
}
