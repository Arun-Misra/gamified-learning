import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logOut } from '../services/authService';
import { db } from '../services/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { calculateLevel, progressToNextLevel } from '../utils/leveling';

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
        const q = query(
          collection(db, 'userSkills'),
          where('uid', '==', user.uid)
        );
        const snapshot = await getDocs(q);
        const loadedSkills = [];

        snapshot.forEach((doc) => {
          const data = doc.data();
          loadedSkills.push({
            id: doc.id,
            ...data,
            level: calculateLevel(data.xp || 0),
            progressPercent: progressToNextLevel(data.xp || 0),
          });
        });

        setSkills(loadedSkills);
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
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading your skills...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container-app py-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Skill Quest</h1>
            <p className="text-sm text-gray-600">{user?.displayName || 'Welcome'}</p>
          </div>
          <button onClick={handleLogout} className="btn btn-secondary">
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-app py-8">
        {error && (
          <div className="mb-4 p-4 bg-danger/10 text-danger rounded-lg">
            Error loading skills: {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Empty State */}
          {skills.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <h2 className="text-xl font-semibold mb-2">No skills yet</h2>
              <p className="text-gray-600 mb-4">Start a new skill to begin your journey</p>
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
                className="card hover:shadow-lg hover:-translate-y-1 transition-all cursor-pointer"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold">{skill.skillId}</h3>
                  <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                    {skill.category}
                  </span>
                </div>

                <div className="space-y-3">
                  {/* Level Display */}
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Level</span>
                      <span className="text-lg font-bold text-primary">{skill.level}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${skill.progressPercent}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500 mt-1">
                      {skill.xp} XP
                    </span>
                  </div>

                  {/* Streak */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">🔥 Streak</span>
                    <span className="text-lg font-bold">{skill.streakCount}</span>
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
