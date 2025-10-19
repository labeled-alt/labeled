import { useState, useEffect } from 'react';
import { Tag, Plus, LogOut, FolderOpen, Image, FileText, Trash2, Sun, Moon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Project } from '../lib/supabase';

interface DashboardProps {
  onSelectProject: (project: Project) => void;
}

export function Dashboard({ onSelectProject }: DashboardProps) {
  const { signOut, user } = useAuth();
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
    } catch {
      return 'light';
    }
  });
  const [projects, setProjects] = useState<Project[]>([]);
  const [projectStats, setProjectStats] = useState<Record<string, { files: number; text: number; images: number; percent: number }>>({});
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectType, setProjectType] = useState<'image' | 'text'>('image');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try {
      localStorage.setItem('theme', theme);
    } catch {}
  }, [theme]);

  const loadProjects = async () => {
    setLoading(true);
    const { data, error } = await (supabase as any)
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) setProjects(data);
    setLoading(false);

    if (data && data.length > 0) {
      // fetch datasets for these projects in one query
      try {
  const ids = (data as Project[]).map((p) => p.id);
        const { data: ds, error: dsErr } = await supabase
          .from('datasets')
          .select('id, project_id, file_type, content')
          .in('project_id', ids);

        if (!dsErr && ds) {
          const stats: Record<string, { files: number; text: number; images: number; percent: number }> = {};
          for (const p of data) stats[p.id] = { files: 0, text: 0, images: 0, percent: 0 };
          for (const d of ds) {
            const pId = (d as any).project_id as string;
            if (!stats[pId]) continue;
            stats[pId].files += 1;
            if ((d as any).content) stats[pId].text += 1;
            else if ((d as any).file_type && (d as any).file_type.startsWith('image/')) stats[pId].images += 1;
          }
          for (const k of Object.keys(stats)) {
            const s = stats[k];
            const pct = s.files === 0 ? 0 : Math.round((s.images + s.text) / s.files * 100);
            s.percent = pct;
          }
          setProjectStats(stats);
        }
      } catch (err) {
        console.error('Error loading dataset stats', err);
      }
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setCreating(true);
    setCreateError(null);
    try {
      // Ensure the user's profile exists (projects.user_id references profiles.id)
      const profileUpsert = await supabase.from('profiles').upsert(
        { id: user.id, email: user.email },
        { onConflict: 'id' }
      );
      if (profileUpsert.error) {
        console.error('Error upserting profile before project create', profileUpsert.error);
        setCreateError(profileUpsert.error.message || JSON.stringify(profileUpsert.error));
        setCreating(false);
        return;
      }

      const { data, error } = await supabase
        .from('projects')
        .insert({
          user_id: user.id,
          name: projectName,
          description: projectDescription,
          type: projectType,
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating project', error);
        setCreateError(error.message || JSON.stringify(error));
      } else if (data) {
        setProjects(prev => [data, ...prev]);
        setShowCreateModal(false);
        setProjectName('');
        setProjectDescription('');
        setProjectType('image');
      }
    } catch (err) {
      console.error('Unexpected error creating project', err);
      setCreateError((err as Error).message || 'Unknown error');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteProject = async (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this project?')) return;
    const { error } = await supabase.from('projects').delete().eq('id', projectId);
    if (!error) setProjects(prev => prev.filter(p => p.id !== projectId));
  };

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-black text-white' : 'bg-white text-black'}`}>
      <nav className={`border-b sticky top-0 z-50 ${theme === 'dark' ? 'border-zinc-800 bg-black/80 backdrop-blur-sm' : 'border-gray-200 bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 ${theme === 'dark' ? 'bg-gradient-to-br from-violet-600 to-indigo-600' : 'bg-gray-100'} flex items-center justify-center rounded-lg shadow-lg`}>
                <Tag className={`w-4 h-4 ${theme === 'dark' ? 'text-white' : 'text-black'}`} />
              </div>
              <span className={`text-lg font-bold ${theme === 'dark' ? 'bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent' : 'text-black'}`}>LabelIed</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
                className={`inline-flex items-center p-2 rounded-md text-sm transition-colors ${theme === 'dark' ? 'text-zinc-400 hover:text-white' : 'text-gray-700 hover:text-black'}`}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-white" /> : <Moon className="w-4 h-4 text-black" />}
              </button>
              <button
                onClick={() => signOut()}
                className={`inline-flex items-center space-x-2 px-3 py-2 text-sm font-medium ${theme === 'dark' ? 'text-zinc-400 hover:text-white' : 'text-gray-700 hover:text-black'} transition-colors`}
              >
                <LogOut className={`w-4 h-4 ${theme === 'dark' ? '' : ''}`} />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">Your Projects</h1>
            <p className="text-zinc-400 text-sm">Create and manage your data labeling projects</p>
            {user?.email && (
              <p className="text-sm mt-1">Welcome, <span className={`${theme === 'dark' ? 'text-white' : 'text-gray-800 font-semibold'}`}>{user.email}</span></p>
            )}
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium rounded-lg shadow-lg shadow-violet-600/20 hover:opacity-90 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8 text-zinc-500">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className={`text-center py-12 border border-dashed rounded-lg p-8 ${theme === 'dark' ? 'border-zinc-800' : 'border-gray-200 bg-white'}`}>
            <FolderOpen className={`w-16 h-16 mx-auto mb-4 ${theme === 'dark' ? 'text-zinc-400' : 'text-gray-400'}`} />
            <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? '' : 'text-gray-900'}`}>No projects yet</h3>
            <p className={`${theme === 'dark' ? 'text-zinc-400' : 'text-gray-600'} text-sm mb-4`}>Create your first project to start labeling data</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium rounded-lg shadow-lg shadow-violet-600/20 hover:opacity-90 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create Project</span>
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => onSelectProject(project)}
                className={`${theme === 'dark' ? 'group p-4 bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-lg hover:border-violet-600/40' : 'group p-4 bg-white border border-gray-100 rounded-lg hover:border-violet-600/40'} transition-colors cursor-pointer`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center rounded-lg shadow-lg shadow-violet-600/20">
                    {project.type === 'image' ? (
                      <Image className="w-4 h-4 text-white" />
                    ) : (
                      <FileText className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <button
                    onClick={(e) => handleDeleteProject(project.id, e)}
                    className={`p-2 transition-colors ${theme === 'dark' ? 'text-zinc-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500'}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <h3 className={`${theme === 'dark' ? 'font-semibold text-white' : 'font-semibold text-gray-900'} mb-1 truncate`}>{project.name}</h3>
                <p className={`${theme === 'dark' ? 'text-sm text-zinc-400' : 'text-sm text-gray-600'} mb-4 line-clamp-2`}>{project.description}</p>
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <div className="flex items-center space-x-3 text-sm">
                      <span className={`${theme === 'dark' ? 'text-xs text-zinc-400' : 'text-xs text-gray-500'}`}>Files</span>
                      <span className="text-sm font-semibold">{projectStats[project.id]?.files ?? 0}</span>
                      <span className={`${theme === 'dark' ? 'text-xs text-zinc-400' : 'text-xs text-gray-500'}`}>Text</span>
                      <span className="text-sm font-semibold">{projectStats[project.id]?.text ?? 0}</span>
                      <span className={`${theme === 'dark' ? 'text-xs text-zinc-400' : 'text-xs text-gray-500'}`}>Images</span>
                      <span className="text-sm font-semibold">{projectStats[project.id]?.images ?? 0}</span>
                    </div>
                    <span className={`${theme === 'dark' ? 'text-xs text-zinc-500' : 'text-xs text-gray-500'}`}>{projectStats[project.id]?.percent ?? 0}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded mt-2 overflow-hidden">
                    <div className="h-2 bg-violet-600" style={{ width: `${projectStats[project.id]?.percent ?? 0}%` }} />
                  </div>
                </div>
                <div className={`flex items-center justify-between text-xs font-medium ${theme === 'dark' ? 'text-zinc-500' : 'text-gray-500'}`}>
                  <span className="uppercase tracking-wide">{project.type}</span>
                  <span>{new Date(project.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className={`w-full max-w-md p-6 rounded-lg border ${theme === 'dark' ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-gray-200'}`}>
        <h2 className={`${theme === 'dark' ? 'text-lg font-bold mb-4 bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent' : 'text-lg font-bold mb-4 text-gray-900'}`}>Create New Project</h2>
            <form onSubmit={handleCreateProject} className="space-y-4">
              {createError && (
                <div className="text-sm text-red-400 bg-red-900/10 p-3 rounded">{createError}</div>
              )}
              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-zinc-400' : 'text-gray-700'}`}>Project Name</label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-600/50 transition-all ${theme === 'dark' ? 'bg-black border border-zinc-800 text-white' : 'bg-white border border-gray-200 text-black'}`}
                  placeholder="My Project"
                  required
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-1 ${theme === 'dark' ? 'text-zinc-400' : 'text-gray-700'}`}>Description</label>
                <textarea
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  className={`w-full px-3 py-2 rounded-lg placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-600/50 transition-all resize-none ${theme === 'dark' ? 'bg-black border border-zinc-800 text-white' : 'bg-white border border-gray-200 text-black'}`}
                  rows={3}
                  placeholder="Optional description..."
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 ${theme === 'dark' ? 'text-zinc-400' : 'text-gray-700'}`}>Data Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setProjectType('image')}
                    className={`p-3 flex items-center justify-center rounded-lg transition-all ${
                      projectType === 'image'
                        ? 'bg-violet-600 border border-violet-500 text-white'
                        : (theme === 'dark' ? 'border border-zinc-800 text-zinc-400' : 'border border-gray-200 text-gray-700')
                    }`}
                  >
                    <Image className="w-4 h-4 mr-2" />
                    <span className="text-sm">Images</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setProjectType('text')}
                    className={`p-3 flex items-center justify-center rounded-lg transition-all ${
                      projectType === 'text'
                        ? 'bg-violet-600 border border-violet-500 text-white'
                        : (theme === 'dark' ? 'border border-zinc-800 text-zinc-400' : 'border border-gray-200 text-gray-700')
                    }`}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    <span className="text-sm">Text</span>
                  </button>
                </div>
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setProjectName('');
                    setProjectDescription('');
                  }}
                  className={`flex-1 py-2 text-sm transition-colors border rounded-lg ${theme === 'dark' ? 'text-zinc-400 hover:text-white border border-zinc-800' : 'text-gray-700 hover:text-black border border-gray-200'}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium rounded-lg shadow-lg shadow-violet-600/20 hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create Project'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
