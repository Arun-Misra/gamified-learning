import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
      // Save to Firestore and navigate
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
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="card max-w-md w-full mx-4">
        <h1 className="text-2xl font-bold mb-6">Set Up Your Journey</h1>

        {error && (
          <div className="mb-4 p-3 bg-danger/10 text-danger rounded-lg text-sm">
            {error}
          </div>
        )}

        {step === 1 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Choose a Category</h2>
            <div className="space-y-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`w-full p-3 rounded-lg border-2 transition-all ${
                    category === cat
                      ? 'border-primary bg-primary/10'
                      : 'border-gray-200 hover:border-primary'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Choose a Skill</h2>
            <div className="space-y-2">
              {category &&
                skillsByCategory[category].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSkill(s)}
                    className={`w-full p-3 rounded-lg border-2 transition-all ${
                      skill === s
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-200 hover:border-primary'
                    }`}
                  >
                    {s}
                  </button>
                ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-lg font-semibold mb-4">Daily Time Commitment</h2>
            <input
              type="number"
              value={dailyMinutes}
              onChange={(e) => setDailyMinutes(e.target.value)}
              className="input"
              placeholder="Minutes per day"
              min="5"
              max="480"
            />
            <p className="text-sm text-gray-500 mt-2">
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
              className={`h-2 w-2 rounded-full transition-all ${
                i <= step ? 'bg-primary' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
