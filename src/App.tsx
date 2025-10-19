import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LandingPage } from './components/LandingPage';
import { AuthPage } from './components/AuthPage';
import { Dashboard } from './components/Dashboard';
import { LabelingInterface } from './components/LabelingInterface';
import { Project, SUPABASE_CONFIGURED } from './lib/supabase';

type View = 'landing' | 'auth' | 'dashboard' | 'labeling';

function AppContent() {
  const { user, loading } = useAuth();
  const [view, setView] = useState<View>('landing');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  // Show a clear error page when Supabase env vars are missing at build/deploy time
  if (!SUPABASE_CONFIGURED) {
    return <SupabaseMissing />;
  }
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

function SupabaseMissing() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white text-black p-6">
      <div className="max-w-2xl text-center">
        <h1 className="text-2xl font-bold mb-4">Supabase not configured</h1>
        <p className="mb-4 text-gray-700">This site was deployed without the required Supabase environment variables, so the app cannot connect.</p>
        <div className="text-left bg-gray-50 border border-gray-100 rounded p-4 text-sm">
          <div className="font-medium mb-2">What to set in your Netlify site settings</div>
          <ul className="list-disc pl-5 space-y-1">
            <li><code>VITE_SUPABASE_URL</code> — your Supabase REST/JS URL (starts with https://...)</li>
            <li><code>VITE_SUPABASE_ANON_KEY</code> — your Supabase anon public key</li>
          </ul>
        </div>
        <p className="mt-4 text-gray-600">After adding these variables in Netlify (Site settings → Build & deploy → Environment), trigger a new deploy or clear cache + deploy.</p>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
