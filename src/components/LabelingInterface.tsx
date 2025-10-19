import { useState, useEffect } from 'react';
import { ArrowLeft, Upload, Tag as TagIcon, Download, Trash2, ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { supabase, Project, Dataset, Label } from '../lib/supabase';

interface LabelingInterfaceProps {
  project: Project;
  onBack: () => void;
}

export function LabelingInterface({ project, onBack }: LabelingInterfaceProps) {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [labels, setLabels] = useState<Label[]>([]);
  const [newLabel, setNewLabel] = useState('');
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    loadDatasets();
  }, [project.id]);

  useEffect(() => {
    if (datasets.length > 0) {
      loadLabels(datasets[currentIndex].id);
    }
  }, [currentIndex, datasets]);

  const loadDatasets = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('datasets')
      .select('*')
      .eq('project_id', project.id)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setDatasets(data);
    }
    setLoading(false);
  };

  const loadLabels = async (datasetId: string) => {
    const { data, error } = await supabase
      .from('labels')
      .select('*')
      .eq('dataset_id', datasetId)
      .order('created_at', { ascending: true });

    if (!error && data) {
      setLabels(data);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setUploadError(null);

    for (const file of Array.from(files)) {
      if (project.type === 'image') {
        try {
          // try upload to Supabase Storage bucket 'datasets'
          const ext = file.name.split('.').pop();
          const filePath = `${project.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
          const { error: uploadError } = await supabase.storage.from('datasets').upload(filePath, file, { cacheControl: '3600', upsert: false });
          if (uploadError) {
            console.warn('Storage upload failed, falling back to base64', uploadError);
            const reader = new FileReader();
            reader.onloadend = async () => {
              const base64 = (reader.result as string) || '';
              const safeBase64 = base64.replace(/\u0000/g, '');
              const { error: insertError } = await supabase.from('datasets').insert({
                project_id: project.id,
                file_name: file.name,
                file_url: safeBase64,
                file_type: file.type,
              });
              if (insertError) {
                console.error('Error inserting dataset (base64 fallback)', insertError);
                setUploadError(insertError.message || JSON.stringify(insertError));
              }
            };
            reader.readAsDataURL(file);
          } else {
            // get public URL
            const { data: urlData } = supabase.storage.from('datasets').getPublicUrl(filePath);
            const publicUrl = urlData.publicUrl;
            const { error: insertError } = await supabase.from('datasets').insert({
              project_id: project.id,
              file_name: file.name,
              file_url: publicUrl,
              file_type: file.type,
            });
            if (insertError) {
              console.error('Error inserting dataset (storage path)', insertError);
              setUploadError(insertError.message || JSON.stringify(insertError));
            }
          }
        } catch (err) {
          console.error('Error uploading image', err);
          setUploadError((err as Error).message || String(err));
        }
      } else {
        const text = await file.text();
        const safeText = text.replace(/\u0000/g, '');
        const { error: insertError } = await supabase.from('datasets').insert({
          project_id: project.id,
          file_name: file.name,
          content: safeText,
          file_type: file.type,
        });
        if (insertError) {
          console.error('Error inserting text dataset', insertError);
          setUploadError(insertError.message || JSON.stringify(insertError));
        }
      }
    }

    // reload datasets after uploads complete
    await loadDatasets();
    setUploading(false);
  };

  const handleAddLabel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim() || datasets.length === 0) return;

    const currentDataset = datasets[currentIndex];
    const { data, error } = await supabase
      .from('labels')
      .insert({
        dataset_id: currentDataset.id,
        label_text: newLabel.trim(),
      })
      .select()
      .single();

    if (!error && data) {
      setLabels([...labels, data]);
      setNewLabel('');
    }
  };

  const handleDeleteLabel = async (labelId: string) => {
    await supabase.from('labels').delete().eq('id', labelId);
    setLabels(labels.filter(l => l.id !== labelId));
  };

  const handleDeleteDataset = async () => {
    if (datasets.length === 0) return;
    if (!confirm('Delete this item?')) return;

    const currentDataset = datasets[currentIndex];
    await supabase.from('datasets').delete().eq('id', currentDataset.id);

    const newDatasets = datasets.filter(d => d.id !== currentDataset.id);
    setDatasets(newDatasets);

    if (currentIndex >= newDatasets.length && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleExport = () => {
    const exportData = datasets.map(dataset => {
      const datasetLabels = labels.filter(l => l.dataset_id === dataset.id);
      return {
        file_name: dataset.file_name,
        content: dataset.content || dataset.file_url,
        labels: datasetLabels.map(l => l.label_text),
      };
    });

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name}-labeled-data.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const currentDataset = datasets[currentIndex];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Projects</span>
            </button>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2 px-4 py-2 border border-gray-300 hover:border-black cursor-pointer transition-colors">
                <Upload className="w-4 h-4" />
                <span>{uploading ? 'Uploading...' : 'Upload Files'}</span>
                <input
                  type="file"
                  multiple
                  accept={project.type === 'image' ? 'image/*' : '.txt,.csv,.json'}
                  onChange={handleFileUpload}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
              {uploadError && <div className="text-sm text-red-500">{uploadError}</div>}
              <button
                onClick={handleExport}
                disabled={datasets.length === 0}
                className="flex items-center space-x-2 px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                <Download className="w-4 h-4" />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
          <p className="text-gray-600">{project.description || 'No description'}</p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Loading...</div>
        ) : datasets.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-gray-300">
            <Upload className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold mb-2">No data uploaded</h3>
            <p className="text-gray-600 mb-6">
              Upload {project.type === 'image' ? 'images' : 'text files'} to start labeling
            </p>
            <label className="inline-flex items-center space-x-2 px-6 py-3 bg-black text-white hover:bg-gray-800 cursor-pointer transition-colors">
              <Upload className="w-5 h-5" />
              <span>Upload Files</span>
              <input
                type="file"
                multiple
                accept={project.type === 'image' ? 'image/*' : '.txt,.csv,.json'}
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            {uploadError && <p className="text-sm text-red-500 mt-3">{uploadError}</p>}
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            <div>
              <div className="border border-gray-200 p-4 mb-4">
                {project.type === 'image' ? (
                  <img
                    src={currentDataset.file_url!}
                    alt={currentDataset.file_name}
                    className="w-full h-auto max-h-96 object-contain"
                  />
                ) : (
                  <div className="bg-gray-50 p-4 max-h-96 overflow-y-auto">
                    <pre className="text-sm whitespace-pre-wrap break-words">
                      {currentDataset.content}
                    </pre>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                  disabled={currentIndex === 0}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 hover:border-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <span className="text-sm text-gray-600">
                  {currentIndex + 1} / {datasets.length}
                </span>

                <button
                  onClick={() => setCurrentIndex(Math.min(datasets.length - 1, currentIndex + 1))}
                  disabled={currentIndex === datasets.length - 1}
                  className="flex items-center space-x-2 px-4 py-2 border border-gray-300 hover:border-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">
                  <strong>File:</strong> {currentDataset.file_name}
                </p>
                <button
                  onClick={handleDeleteDataset}
                  className="flex items-center space-x-2 text-sm text-red-600 hover:text-red-700 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete this item</span>
                </button>
              </div>
            </div>

            <div>
              <div className="border border-gray-200 p-6">
                <h2 className="text-xl font-bold mb-4 flex items-center space-x-2">
                  <TagIcon className="w-5 h-5" />
                  <span>Labels</span>
                </h2>

                <form onSubmit={handleAddLabel} className="mb-6">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={newLabel}
                      onChange={(e) => setNewLabel(e.target.value)}
                      placeholder="Enter label..."
                      className="flex-1 px-4 py-2 border border-gray-300 focus:outline-none focus:border-black transition-colors"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-black text-white hover:bg-gray-800 transition-colors"
                    >
                      <Save className="w-5 h-5" />
                    </button>
                  </div>
                </form>

                <div className="space-y-2">
                  {labels.length === 0 ? (
                    <p className="text-gray-500 text-sm text-center py-8">
                      No labels yet. Add labels above.
                    </p>
                  ) : (
                    labels.map((label) => (
                      <div
                        key={label.id}
                        className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200"
                      >
                        <span className="font-medium">{label.label_text}</span>
                        <button
                          onClick={() => handleDeleteLabel(label.id)}
                          className="text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <div className="mt-4 p-4 bg-gray-50 border border-gray-200">
                <h3 className="font-semibold mb-2">Tips:</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Add multiple labels to describe your data</li>
                  <li>• Use consistent naming for better results</li>
                  <li>• Navigate with Previous/Next buttons</li>
                  <li>• Export when finished to download your labeled dataset</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
