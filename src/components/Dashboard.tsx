import { useState, useEffect } from 'react';
import { Tag, Plus, LogOut, FolderOpen, Image, FileText, Trash2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Project } from '../lib/supabase';

interface DashboardProps {
  onSelectProject: (project: Project) => void;
}

export function Dashboard({ onSelectProject }: DashboardProps) {
  const { signOut, user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectType, setProjectType] = useState<'image' | 'text'>('image');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setProjects(data);
    }
    setLoading(false);
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setCreating(true);
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

    if (!error && data) {
      setProjects([data, ...projects]);
      setShowCreateModal(false);
      setProjectName('');
      setProjectDescription('');
      setProjectType('image');
    }
    setCreating(false);
  };

  const handleDeleteProject = async (projectId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
      return;
    }

    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (!error) {
      setProjects(projects.filter(p => p.id !== projectId));
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b-2 border-gray-900 sticky top-0 bg-white z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-black flex items-center justify-center">
                <Tag className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight">LabelIed</span>
            </div>
            <button
              onClick={() => signOut()}
              className="flex items-center space-x-2 px-6 py-3 text-black border-2 border-gray-900 hover:bg-black hover:text-white transition-all font-medium"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-5xl md:text-6xl font-bold mb-3 tracking-tight">My Projects</h1>
            <p className="text-gray-600 text-lg">Create and manage your data labeling projects</p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center space-x-2 px-8 py-4 bg-black text-white hover:bg-gray-800 transition-all hover:scale-105 active:scale-95 font-medium"
          >
            <Plus className="w-5 h-5" />
            <span>New Project</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="text-center py-32 border-2 border-dashed border-gray-900">
            <FolderOpen className="w-20 h-20 mx-auto mb-6 text-gray-300" />
            <h3 className="text-3xl font-bold mb-3">No projects yet</h3>
            <p className="text-gray-600 text-lg mb-8">Create your first project to start labeling data</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center space-x-2 px-8 py-4 bg-black text-white hover:bg-gray-800 transition-all hover:scale-105 active:scale-95 font-medium"
            >
              <Plus className="w-5 h-5" />
              <span>Create Project</span>
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => onSelectProject(project)}
                className="border-2 border-gray-900 p-8 hover:shadow-lg transition-all cursor-pointer group bg-white hover:scale-105"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-14 h-14 bg-black text-white flex items-center justify-center group-hover:scale-110 transition-transform">
                    {project.type === 'image' ? (
                      <Image className="w-7 h-7" />
                    ) : (
                      <FileText className="w-7 h-7" />
                    )}
                  </div>
                  <button
                    onClick={(e) => handleDeleteProject(project.id, e)}
                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <h3 className="text-2xl font-bold mb-3">{project.name}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                  {project.description || 'No description'}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 font-medium">
                  <span className="uppercase tracking-wide">{project.type}</span>
                  <span>{new Date(project.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white max-w-md w-full p-10 border-2 border-gray-900">
            <h2 className="text-3xl font-bold mb-8 tracking-tight">Create New Project</h2>
            <form onSubmit={handleCreateProject} className="space-y-6">
              <div>
                <label className="block text-sm font-bold mb-3 uppercase tracking-wide">
                  Project Name
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all"
                  placeholder="My Dataset"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-3 uppercase tracking-wide">
                  Description
                </label>
                <textarea
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-900 transition-all resize-none"
                  rows={3}
                  placeholder="Optional description..."
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-3 uppercase tracking-wide">
                  Data Type
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setProjectType('image')}
                    className={`p-4 border-2 transition-colors ${
                      projectType === 'image'
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Image className="w-8 h-8 mx-auto mb-2" />
                    <span className="font-medium">Images</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setProjectType('text')}
                    className={`p-4 border-2 transition-colors ${
                      projectType === 'text'
                        ? 'border-black bg-black text-white'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <FileText className="w-8 h-8 mx-auto mb-2" />
                    <span className="font-medium">Text</span>
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateModal(false);
                    setProjectName('');
                    setProjectDescription('');
                  }}
                  className="flex-1 py-3 border-2 border-gray-900 hover:bg-gray-100 transition-all font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 py-3 bg-black text-white hover:bg-gray-800 transition-all disabled:opacity-50 font-medium"
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
