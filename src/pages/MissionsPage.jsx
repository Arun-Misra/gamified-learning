import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function MissionsPage() {
  const { skillId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [missions, setMissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMissions = async () => {
      try {
        // TODO: Fetch missions from Firestore
        setMissions([]);
      } catch (error) {
        console.error('Error loading missions:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadMissions();
    }
  }, [user, skillId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading missions...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container-app py-4 flex justify-between items-center">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-primary hover:underline"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold">Today's Missions</h1>
          <div></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-app py-8">
        {missions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No missions for today. Great job!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {missions.map((mission) => (
              <div key={mission.id} className="card hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{mission.title}</h3>
                    <p className="text-sm text-gray-600">{mission.description}</p>
                    <div className="mt-2 flex gap-4 text-sm">
                      <span>⏱ {mission.estimatedMinutes} mins</span>
                      <span>⭐ {mission.xpReward} XP</span>
                    </div>
                  </div>
                  <button className="btn btn-primary">
                    {mission.completed ? '✓ Done' : 'Complete'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
