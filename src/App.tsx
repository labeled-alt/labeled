import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { Dashboard } from './components/Dashboard';
import { LabelingInterface } from './components/LabelingInterface';
import { Project } from './lib/supabase';

type View = 'landing' | 'auth' | 'dashboard' | 'labeling';

function AppContent() {
  const { user, loading } = useAuth();
  const [view, setView] = useState<View>('landing');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (user) {
    if (selectedProject) {
      return (
        <LabelingInterface
          project={selectedProject}
          onBack={() => setSelectedProject(null)}
        />
      );
    }
    return <Dashboard onSelectProject={setSelectedProject} />;
  }

  if (view === 'auth') {
    return <AuthPage onBack={() => setView('landing')} />;
  }

  return <LandingPage onGetStarted={() => setView('auth')} />;
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
