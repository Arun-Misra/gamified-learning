import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMissionsForToday, saveMission, completeMissionItem } from '../services/missionService';
import { getUserSkillProgress } from '../services/progressService';
import { fetchRoadmapBySkill } from '../services/roadmapService';
import { generateDailyMissions } from '../utils/missionGenerator';
import { awardXP, updateStreak } from '../services/progressService';

export default function MissionsPage() {
  const { skillId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completing, setCompleting] = useState(null);

  useEffect(() => {
    const loadMissions = async () => {
      if (!user) {
        navigate('/');
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Fetch user progress and roadmap
        const userProgress = await getUserSkillProgress(user.uid, skillId);
        const roadmap = await fetchRoadmapBySkill(skillId);

        if (!userProgress) {
          setError('Skill not found. Please complete onboarding first.');
          setLoading(false);
          return;
        }

        // Try to load existing missions for today
        let todaysMissions = await getMissionsForToday(user.uid, skillId);

        if (!todaysMissions || !todaysMissions.items) {
          // Generate new missions
          const generatedMissions = generateDailyMissions(
            roadmap,
            userProgress,
            userProgress.dailyMinutes
          );

          if (generatedMissions.length === 0) {
            setMissions([]);
            setLoading(false);
            return;
          }

          // Save generated missions
          await saveMission(user.uid, skillId, {
            items: generatedMissions,
            statusSummary: {
              total: generatedMissions.length,
              completed: 0,
            },
          });

          setMissions(generatedMissions);
        } else {
          setMissions(todaysMissions.items || []);
        }
      } catch (err) {
        setError(err.message);
        console.error('Error loading missions:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMissions();
  }, [user, skillId, navigate]);

  const handleCompleteMission = async (missionId, xpReward) => {
    if (!user) return;

    try {
      setCompleting(missionId);

      // Update mission status
      await completeMissionItem(user.uid, skillId, missionId);

      // Award XP and update streak
      await awardXP(user.uid, skillId, xpReward);
      await updateStreak(user.uid, skillId);

      // Update local state
      setMissions((prev) =>
        prev.map((m) =>
          m.missionId === missionId
            ? { ...m, status: 'completed', completedAt: new Date() }
            : m
        )
      );
    } catch (err) {
      setError(err.message);
      console.error('Error completing mission:', err);
    } finally {
      setCompleting(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">Loading missions...</p>
      </div>
    );
  }

  const completedCount = missions.filter((m) => m.status === 'completed').length;
  const skillName = skillId.charAt(0).toUpperCase() + skillId.slice(1);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container-app py-4 flex justify-between items-center">
          <div className="flex-1">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-primary hover:underline mb-2 inline-block"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold">Today's Missions: {skillName}</h1>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Progress</p>
            <p className="text-2xl font-bold">{completedCount}/{missions.length}</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-app py-8">
        {error && (
          <div className="mb-4 p-4 bg-danger/10 text-danger rounded-lg">
            {error}
          </div>
        )}

        {missions.length === 0 ? (
          <div className="text-center py-12 card">
            <h2 className="text-xl font-semibold mb-2">No missions for today</h2>
            <p className="text-gray-600">
              Great job! You've completed all available missions for today. Come back tomorrow!
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn btn-primary mt-4"
            >
              Back to Dashboard
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {missions.map((mission) => (
              <div
                key={mission.missionId}
                className={`card transition-all ${
                  mission.status === 'completed'
                    ? 'bg-green-50 border-l-4 border-green-500'
                    : 'hover:shadow-md'
                }`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{mission.title}</h3>
                      <span
                        className={`text-xs px-2 py-1 rounded font-medium ${
                          mission.difficulty === 'easy'
                            ? 'bg-green-100 text-green-800'
                            : mission.difficulty === 'medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {mission.difficulty}
                      </span>
                      {mission.status === 'completed' && (
                        <span className="text-green-600 font-bold">✓ Done</span>
                      )}
                    </div>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span>⏱ {mission.estimatedMinutes} mins</span>
                      <span>⭐ {mission.xpReward} XP</span>
                    </div>
                  </div>

                  {mission.status !== 'completed' && (
                    <button
                      onClick={() =>
                        handleCompleteMission(mission.missionId, mission.xpReward)
                      }
                      disabled={completing === mission.missionId}
                      className="btn btn-primary whitespace-nowrap disabled:opacity-50"
                    >
                      {completing === mission.missionId ? 'Saving...' : 'Mark Done'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
