import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { logOut } from '../services/authService';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);

  const handleLogout = async () => {
    try {
      await logOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  useEffect(() => {
    // TODO: Fetch user skills from Firestore
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container-app py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Skill Quest</h1>
            <p className="text-sm text-gray-600">{user?.displayName || 'Welcome'}</p>
          </div>
          <button onClick={handleLogout} className="btn btn-secondary">
            Sign Out
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-app py-8">
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
                Add Skill
              </button>
            </div>
          ) : (
            skills.map((skill) => (
              <div key={skill.id} className="card hover:shadow-lg transition-shadow">
                <h3 className="text-lg font-semibold mb-2">{skill.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{skill.category}</p>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium">Level: {skill.level}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">XP: {skill.xp}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium">Streak: {skill.streak}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
