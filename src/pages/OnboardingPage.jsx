import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { initializeUserSkill } from '../services/progressService';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState('');
  const [skill, setSkill] = useState('');
  const [dailyMinutes, setDailyMinutes] = useState('30');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const categories = ['Study', 'Health'];
  const skillsByCategory = {
    Study: ['Python', 'DSA'],
    Health: ['Gym'],
  };

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Save to Supabase and navigate
      setLoading(true);
      setError(null);
      try {
        const skillId = skill.toLowerCase().replace(' ', '-');
        await initializeUserSkill(user.uid, skillId, category, parseInt(dailyMinutes));
        navigate('/dashboard');
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="app-shell app-bg-grid flex items-center justify-center px-4 py-10">
      <div className="card max-w-2xl w-full mx-4 reveal-up">
        <div className="flex flex-wrap gap-2 items-center justify-between mb-6">
          <h1 className="heading-display text-2xl sm:text-3xl">Set Up Your Journey</h1>
          <span className="badge">Step {step} of 3</span>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl text-sm bg-red-50 text-red-700 border border-red-200">
            {error}
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold mb-3">Choose a Category</h2>
            <p className="text-muted text-sm mb-4">Start broad. You can add more skills later.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    category === cat
                      ? 'border-[#1f7a5f] bg-[#1f7a5f14]'
                      : 'border-[#d7d2be] hover:border-[#1f7a5f]'
                  }`}
                >
                  <p className="font-semibold">{cat}</p>
                  <p className="text-xs text-muted mt-1">
                    {cat === 'Study' ? 'Deep work and technical growth' : 'Fitness and physical progress'}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold mb-3">Choose a Skill</h2>
            <p className="text-muted text-sm mb-4">Pick one skill to focus your daily routine.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {category &&
                skillsByCategory[category].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSkill(s)}
                    className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                      skill === s
                        ? 'border-[#1f7a5f] bg-[#1f7a5f14]'
                        : 'border-[#d7d2be] hover:border-[#1f7a5f]'
                    }`}
                  >
                    <p className="font-semibold">{s}</p>
                    <p className="text-xs text-muted mt-1">Daily quest track</p>
                  </button>
                ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold mb-3">Daily Time Commitment</h2>
            <p className="text-muted text-sm mb-4">Set a realistic target you can sustain.</p>
            <input
              type="number"
              value={dailyMinutes}
              onChange={(e) => setDailyMinutes(e.target.value)}
              className="input"
              placeholder="Minutes per day"
              min="5"
              max="480"
            />
            <p className="text-sm text-muted mt-2">
              {dailyMinutes} minutes per day
            </p>
          </div>
        )}

        <div className="flex gap-3 mt-8">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className="btn btn-secondary flex-1 disabled:opacity-50"
          >
            Back
          </button>
          <button
            onClick={handleNext}
            disabled={
              loading ||
              (step === 1 && !category) ||
              (step === 2 && !skill) ||
              (step === 3 && !dailyMinutes)
            }
            className="btn btn-primary flex-1 disabled:opacity-50"
          >
            {loading ? 'Saving...' : step === 3 ? 'Start' : 'Next'}
          </button>
        </div>

        <div className="flex gap-2 justify-center mt-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`h-2.5 rounded-full transition-all ${
                i <= step ? 'w-8 bg-[#1f7a5f]' : 'w-2.5 bg-[#cec8b4]'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
