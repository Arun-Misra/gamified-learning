import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { logOut } from '../services/authService';
import { calculateLevel, progressToNextLevel } from '../utils/leveling';
import { listUserSkills } from '../services/progressService';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUserSkills = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const loadedSkills = await listUserSkills(user.uid);

        setSkills(
          loadedSkills.map((skill) => ({
            ...skill,
            level: skill.level || calculateLevel(skill.xp || 0),
            progressPercent: progressToNextLevel(skill.xp || 0),
          }))
        );
        setError(null);
      } catch (err) {
        setError(err.message);
        console.error('Error loading skills:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUserSkills();
  }, [user]);

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="app-shell app-bg-grid flex items-center justify-center min-h-screen">
        <p className="text-muted">Loading your skills...</p>
      </div>
    );
  }

  return (
    <div className="app-shell app-bg-grid">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur bg-[#f6f4eaee] border-b border-[#d4ccb6]">
        <div className="container-app py-4 flex justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Skill Quest</h1>
            <p className="text-sm text-muted">{user?.displayName || 'Welcome'}</p>
          </div>
          <button onClick={handleLogout} className="btn btn-danger">
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-app py-8">
        <section className="card-strong mb-7 reveal-up">
          <p className="badge mb-3">Mission Console</p>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Track your streak. Grow your level.</h2>
          <p className="text-muted max-w-2xl">
            Pick a skill card to open today&apos;s quests and keep your learning momentum alive.
          </p>
        </section>

        {error && (
          <div className="mb-4 p-4 rounded-xl bg-red-50 text-red-700 border border-red-200">
            Error loading skills: {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Empty State */}
          {skills.length === 0 ? (
            <div className="col-span-full card text-center py-12">
              <h2 className="text-xl font-semibold mb-2">No skills yet</h2>
              <p className="text-muted mb-4">Start a new skill to begin your journey</p>
              <button
                onClick={() => navigate('/onboarding')}
                className="btn btn-primary"
              >
                Add Your First Skill
              </button>
            </div>
          ) : (
            skills.map((skill) => (
              <div
                key={skill.id}
                onClick={() => navigate(`/missions/${skill.skillId}`)}
                className="card hover:-translate-y-1 transition-all cursor-pointer reveal-up"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold uppercase tracking-wide">{skill.skillId}</h3>
                  <span className="badge">
                    {skill.category}
                  </span>
                </div>

                <div className="space-y-3">
                  {/* Level Display */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Level</span>
                      <span className="text-lg font-bold text-[#1f7a5f]">{skill.level}</span>
                    </div>
                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{ width: `${skill.progressPercent}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted mt-1">
                      {skill.xp} XP
                    </span>
                  </div>

                  {/* Streak */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">🔥 Streak</span>
                    <span className="text-lg font-bold text-[#2b5f4e]">{skill.streakCount}</span>
                  </div>

                  {/* Daily Minutes */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">⏱ Daily Goal</span>
                    <span className="text-sm">{skill.dailyMinutes} min</span>
                  </div>
                </div>

                <button
                  className="btn btn-primary w-full mt-4"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/missions/${skill.skillId}`);
                  }}
                >
                  View Missions →
                </button>
              </div>
            ))
          )}
        </div>

        {/* Add Skill Button */}
        {skills.length > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => navigate('/onboarding')}
              className="btn btn-secondary"
            >
              + Add Another Skill
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
