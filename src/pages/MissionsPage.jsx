import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getMissionsForToday, saveMission, completeMissionItem } from '../services/missionService';
import {
  getUserSkillProgress,
  markTopicCompleted,
  awardXP,
  updateStreak,
} from '../services/progressService';
import { fetchRoadmapBySkill } from '../services/roadmapService';
import { calculateXpReward, generateDailyMissions } from '../utils/missionGenerator';
import { flattenRoadmapTopics, getLevelXpBonus } from '../utils/roadmapUtils';
import { logActivity } from '../services/activityService';

export default function MissionsPage() {
  const { skillId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [completing, setCompleting] = useState(null);
  const [levelCompleting, setLevelCompleting] = useState(null);
  const [roadmapTopics, setRoadmapTopics] = useState([]);
  const [completedTopicIds, setCompletedTopicIds] = useState([]);

  useEffect(() => {
    const loadMissions = async () => {
      if (!user) {
        navigate('/login');
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

        if (!roadmap) {
          setError('Roadmap not found. Seed the roadmaps table first.');
          setLoading(false);
          return;
        }

        const allTopics = flattenRoadmapTopics(roadmap);
        setRoadmapTopics(allTopics);
        setCompletedTopicIds(userProgress.completedTopicIds || []);

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
            roadmapVersion: roadmap.version || 1,
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

  const handleCompleteMission = async (missionId, topicId, xpReward, difficulty) => {
    if (!user) return;

    try {
      setCompleting(missionId);

      // Update mission status
      await completeMissionItem(user.uid, skillId, missionId);

      await markTopicCompleted(user.uid, skillId, topicId);
      await logActivity({
        uid: user.uid,
        skillId,
        missionId,
        topicId,
        xpAwarded: xpReward,
        meta: { difficulty },
      });

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

      if (topicId) {
        setCompletedTopicIds((prev) => (prev.includes(topicId) ? prev : [...prev, topicId]));
      }
    } catch (err) {
      setError(err.message);
      console.error('Error completing mission:', err);
    } finally {
      setCompleting(null);
    }
  };

  const handleCompleteLevel = async (topic, levelNumber) => {
    if (!user || !topic || completedTopicIds.includes(topic.topicId)) {
      return;
    }

    try {
      setLevelCompleting(topic.topicId);
      const bonusXp = getLevelXpBonus(levelNumber);
      const xpReward = calculateXpReward(topic.difficulty || 'medium', topic.estimatedMinutes || 25) + bonusXp;

      await markTopicCompleted(user.uid, skillId, topic.topicId);
      await awardXP(user.uid, skillId, xpReward);
      await updateStreak(user.uid, skillId);
      await logActivity({
        uid: user.uid,
        skillId,
        missionId: null,
        topicId: topic.topicId,
        action: 'level_completed',
        xpAwarded: xpReward,
        meta: {
          source: 'all-levels-panel',
          levelNumber,
          difficulty: topic.difficulty || 'medium',
        },
      });

      setCompletedTopicIds((prev) => (prev.includes(topic.topicId) ? prev : [...prev, topic.topicId]));
    } catch (err) {
      setError(err.message || 'Failed to complete level');
      console.error('Error completing level:', err);
    } finally {
      setLevelCompleting(null);
    }
  };

  if (loading) {
    return (
      <div className="app-shell app-bg-grid flex items-center justify-center min-h-screen">
        <p className="text-muted">Loading missions...</p>
      </div>
    );
  }

  const completedCount = missions.filter((m) => m.status === 'completed').length;
  const skillName = skillId.charAt(0).toUpperCase() + skillId.slice(1);
  const completedLevelsCount = completedTopicIds.length;

  return (
    <div className="app-shell app-bg-grid">
      {/* Header */}
      <header className="sticky top-0 z-10 backdrop-blur bg-[#f6f4eaee] border-b border-[#d4ccb6]">
        <div className="container-app py-4 flex justify-between items-center gap-4">
          <div className="flex-1">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-[#1f7a5f] hover:underline mb-2 inline-block"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold">Today&apos;s Missions: {skillName}</h1>
          </div>
          <div className="text-right card p-3 sm:p-4 min-w-[120px]">
            <p className="text-xs text-muted">Progress</p>
            <p className="text-2xl font-bold">{completedCount}/{missions.length}</p>
            <p className="text-xs text-muted mt-1">Levels {completedLevelsCount}/{roadmapTopics.length}</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-app py-8">
        {error && (
          <div className="mb-4 p-4 rounded-xl bg-red-50 text-red-700 border border-red-200">
            {error}
          </div>
        )}

        {missions.length === 0 ? (
          <div className="text-center py-12 card reveal-up">
            <h2 className="text-xl font-semibold mb-2">No missions for today</h2>
            <p className="text-muted">
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
          <div className="space-y-4 reveal-up">
            {missions.map((mission) => (
              <div
                key={mission.missionId}
                className={`mission-card ${
                  mission.status === 'completed'
                    ? 'bg-[#eaf6ee] border-l-4 border-[#3b8f72]'
                    : ''
                }`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{mission.title}</h3>
                      {mission.missionType && (
                        <span className="badge">{mission.missionType.replace('-', ' ')}</span>
                      )}
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium border ${
                          mission.difficulty === 'easy'
                            ? 'bg-green-100 text-green-800 border-green-200'
                            : mission.difficulty === 'medium'
                            ? 'bg-yellow-100 text-yellow-800 border-yellow-200'
                            : 'bg-red-100 text-red-800 border-red-200'
                        }`}
                      >
                        {mission.difficulty}
                      </span>
                      {mission.status === 'completed' && (
                        <span className="text-green-700 font-bold">✓ Done</span>
                      )}
                    </div>
                    {mission.description && (
                      <p className="text-sm text-muted mb-2">{mission.description}</p>
                    )}
                    {Array.isArray(mission.successCriteria) && mission.successCriteria.length > 0 && (
                      <ul className="text-xs text-muted mb-2 list-disc pl-4 space-y-1">
                        {mission.successCriteria.slice(0, 3).map((criterion) => (
                          <li key={`${mission.missionId}-${criterion}`}>{criterion}</li>
                        ))}
                      </ul>
                    )}
                    <div className="flex gap-4 text-sm text-muted">
                      <span>⏱ {mission.estimatedMinutes} mins</span>
                      <span>⭐ {mission.xpReward} XP</span>
                    </div>
                  </div>

                  {mission.status !== 'completed' && (
                    <button
                      onClick={() =>
                        handleCompleteMission(
                          mission.missionId,
                          mission.topicId,
                          mission.xpReward,
                          mission.difficulty
                        )
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

        <section className="card mt-8 reveal-up">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <h2 className="text-xl sm:text-2xl font-bold">All Levels Visible</h2>
            <span className="badge">{completedLevelsCount}/{roadmapTopics.length} completed</span>
          </div>

          <p className="text-sm text-muted mb-4">
            You can complete levels beyond today&apos;s assigned missions and still earn XP.
          </p>

          <div className="max-h-[420px] overflow-y-auto pr-1 space-y-2">
            {roadmapTopics.map((topic, index) => {
              const levelNumber = index + 1;
              const isCompleted = completedTopicIds.includes(topic.topicId);

              return (
                <div
                  key={topic.topicId || `${topic.title}-${levelNumber}`}
                  className={`rounded-xl border p-3 flex flex-wrap items-center justify-between gap-3 ${
                    isCompleted
                      ? 'bg-[#eaf6ee] border-[#b9decf]'
                      : 'bg-[#fffef8] border-[#d8d2be]'
                  }`}
                >
                  <div>
                    <p className="font-semibold">Level {levelNumber}: {topic.title}</p>
                    <p className="text-xs text-muted mt-1">
                      {topic.difficulty || 'medium'} • {topic.estimatedMinutes || 25} mins • +
                      {calculateXpReward(topic.difficulty || 'medium', topic.estimatedMinutes || 25) + getLevelXpBonus(levelNumber)} XP
                    </p>
                    <div className="mt-2">
                      {topic.resourceUrl ? (
                        <a
                          href={topic.resourceUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-[#1f7a5f] hover:underline font-medium"
                        >
                          Open lesson resource
                        </a>
                      ) : (
                        <span className="text-xs text-muted">Resource: Coming soon</span>
                      )}
                    </div>
                  </div>

                  {isCompleted ? (
                    <span className="badge">Completed</span>
                  ) : (
                    <button
                      onClick={() => handleCompleteLevel(topic, levelNumber)}
                      disabled={levelCompleting === topic.topicId}
                      className="btn btn-secondary disabled:opacity-50"
                    >
                      {levelCompleting === topic.topicId ? 'Saving...' : 'Complete Level'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}
