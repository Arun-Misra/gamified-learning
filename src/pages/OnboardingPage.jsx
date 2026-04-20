import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { initializeUserSkill } from '../services/progressService';
import { createUserGeneratedRoadmap } from '../services/roadmapService';

const slugify = (value) =>
  (value || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [step, setStep] = useState(1);
  const [goalSetupType, setGoalSetupType] = useState('preset');

  const [category, setCategory] = useState('');
  const [skill, setSkill] = useState('');

  const [customGoal, setCustomGoal] = useState('');
  const [goalType, setGoalType] = useState('custom');
  const [goalMode, setGoalMode] = useState('hybrid');
  const [knowledgeLevel, setKnowledgeLevel] = useState('beginner');
  const [targetOutcome, setTargetOutcome] = useState('');

  const [dailyMinutes, setDailyMinutes] = useState('30');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const categories = ['Study', 'Health'];
  const skillsByCategory = {
    Study: ['Python', 'DSA', 'Java'],
    Health: ['Gym'],
  };

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const parsedMinutes = parseInt(dailyMinutes, 10);

      if (goalSetupType === 'custom') {
        const baseSlug = slugify(customGoal) || `goal-${Date.now().toString(36)}`;
        const skillId = `${baseSlug}-${Date.now().toString(36).slice(-4)}`;

        await createUserGeneratedRoadmap({
          uid: user.uid,
          skillId,
          goalName: customGoal.trim(),
          goalType,
          goalMode,
          knowledgeLevel,
          sourceGoalText: customGoal.trim(),
        });

        await initializeUserSkill(user.uid, skillId, 'Custom', parsedMinutes, {
          goalMode,
          goalType,
          goalConfig: {
            source: 'custom-goal',
            knowledgeLevel,
            targetOutcome: targetOutcome.trim(),
          },
        });
      } else {
        const skillId = skill.toLowerCase().replace(/\s+/g, '-');

        await initializeUserSkill(user.uid, skillId, category, parsedMinutes, {
          goalMode: 'level',
          goalType: category.toLowerCase(),
          goalConfig: {
            source: 'preset',
          },
        });
      }

      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to finish onboarding.');
      setLoading(false);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const isStep1Invalid =
    goalSetupType === 'preset' ? !category : !customGoal.trim();

  const isStep2Invalid =
    goalSetupType === 'preset' ? !skill : !knowledgeLevel;

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
            <h2 className="text-xl font-semibold mb-3">How do you want to start?</h2>
            <p className="text-muted text-sm mb-4">
              Choose a preset track or create a custom goal for anything you want to learn.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
              {[
                {
                  id: 'preset',
                  title: 'Preset Skill',
                  desc: 'Pick Python, DSA, Java, or Gym.',
                },
                {
                  id: 'custom',
                  title: 'Custom Goal',
                  desc: 'Type any goal and we will build a plan.',
                },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setGoalSetupType(item.id)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    goalSetupType === item.id
                      ? 'border-[#1f7a5f] bg-[#1f7a5f14]'
                      : 'border-[#d7d2be] hover:border-[#1f7a5f]'
                  }`}
                >
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-xs text-muted mt-1">{item.desc}</p>
                </button>
              ))}
            </div>

            {goalSetupType === 'preset' ? (
              <div>
                <p className="text-sm font-medium mb-2">Choose a category</p>
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
            ) : (
              <div className="space-y-3">
                <input
                  type="text"
                  value={customGoal}
                  onChange={(e) => setCustomGoal(e.target.value)}
                  className="input"
                  placeholder="Example: Learn cloud architecture, improve guitar solos, crack ML interviews"
                />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <select
                    className="input"
                    value={goalType}
                    onChange={(e) => setGoalType(e.target.value)}
                  >
                    <option value="custom">Custom</option>
                    <option value="study">Study</option>
                    <option value="health">Health</option>
                    <option value="creative">Creative</option>
                    <option value="career">Career</option>
                  </select>

                  <select
                    className="input"
                    value={goalMode}
                    onChange={(e) => setGoalMode(e.target.value)}
                  >
                    <option value="hybrid">Hybrid (recommended)</option>
                    <option value="level">Level-based</option>
                    <option value="daily">Daily-based</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 2 && (
          <div>
            {goalSetupType === 'preset' ? (
              <>
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
              </>
            ) : (
              <>
                <h2 className="text-xl font-semibold mb-3">Tell us your starting point</h2>
                <p className="text-muted text-sm mb-4">
                  This helps us build the right challenge level from day one.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <select
                    className="input"
                    value={knowledgeLevel}
                    onChange={(e) => setKnowledgeLevel(e.target.value)}
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>

                  <input
                    type="text"
                    value={targetOutcome}
                    onChange={(e) => setTargetOutcome(e.target.value)}
                    className="input"
                    placeholder="Target outcome (optional): e.g. build a portfolio app"
                  />
                </div>
              </>
            )}
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
            <p className="text-sm text-muted mt-2">{dailyMinutes} minutes per day</p>
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
              (step === 1 && isStep1Invalid) ||
              (step === 2 && isStep2Invalid) ||
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
