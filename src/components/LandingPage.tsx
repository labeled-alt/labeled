import { Database, Tag, Download, ArrowRight, Upload, Sparkles, CheckCircle2, Zap } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white text-black">
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-black flex items-center justify-center">
                <Tag className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold tracking-tight">LabelIed</span>
            </div>
            <button
              onClick={onGetStarted}
              className="px-8 py-3 bg-black text-white font-medium hover:bg-gray-800 transition-all hover:scale-105 active:scale-95"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-black text-white text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              <span>Simple Data Labeling for AI</span>
            </div>
            <h1 className="text-6xl md:text-8xl font-bold mb-8 tracking-tight">
              Label Data.
              <br />
              Train AI.
              <br />
              <span className="text-gray-400">Simple.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              A beautifully simple tool that helps people label data for AI — especially beginners and students learning how artificial intelligence works.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={onGetStarted}
                className="group inline-flex items-center space-x-3 px-10 py-5 bg-black text-white text-lg font-medium hover:bg-gray-800 transition-all hover:scale-105 active:scale-95"
              >
                <span>Start Labeling Free</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center space-x-2 px-10 py-5 border-2 border-black text-black text-lg font-medium hover:bg-black hover:text-white transition-all"
              >
                <span>See How It Works</span>
              </button>
            </div>
            <p className="mt-8 text-sm text-gray-500">No credit card required • Free forever</p>
          </div>
        </div>
      </section>

      <section className="border-t-2 border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group hover:scale-105 transition-transform">
              <div className="border-2 border-gray-900 p-8 bg-white h-full">
                <div className="w-16 h-16 bg-black text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Database className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-bold mb-4">Upload</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Pick or upload your data — like pictures or text. Support for multiple file formats including images, text, CSV, and JSON.
                </p>
              </div>
            </div>

            <div className="group hover:scale-105 transition-transform">
              <div className="border-2 border-gray-900 p-8 bg-white h-full">
                <div className="w-16 h-16 bg-black text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Tag className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-bold mb-4">Label</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Add names, tags, or labels to show what each piece of data is. Simple, intuitive interface that anyone can use.
                </p>
              </div>
            </div>

            <div className="group hover:scale-105 transition-transform">
              <div className="border-2 border-gray-900 p-8 bg-white h-full">
                <div className="w-16 h-16 bg-black text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Download className="w-8 h-8" />
                </div>
                <h3 className="text-3xl font-bold mb-4">Download</h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  Download your labeled data in JSON format, ready to use for training AI projects or machine learning experiments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-t-2 border-gray-900 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From upload to export in four simple steps. No complex setup, no technical barriers.
            </p>
          </div>

          <div className="space-y-24">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-black text-white text-sm font-bold mb-4">
                  <span>STEP 1</span>
                </div>
                <h3 className="text-4xl font-bold mb-6">Create Your Project</h3>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  Start by creating a new project. Choose between image labeling or text labeling based on your data type. Give your project a name and optional description to keep things organized.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1" />
                    <span className="text-gray-700 text-lg">Select project type: Images or Text</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1" />
                    <span className="text-gray-700 text-lg">Add a descriptive name and details</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1" />
                    <span className="text-gray-700 text-lg">Create unlimited projects for different datasets</span>
                  </li>
                </ul>
              </div>
              <div className="order-1 md:order-2">
                <div className="border-2 border-gray-900 bg-white p-12 aspect-square flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-black text-white flex items-center justify-center mx-auto mb-6">
                      <Tag className="w-12 h-12" />
                    </div>
                    <div className="text-2xl font-bold mb-2">New Project</div>
                    <div className="text-gray-500">Image or Text</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="border-2 border-gray-900 bg-white p-12 aspect-square flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-black text-white flex items-center justify-center mx-auto mb-6">
                      <Upload className="w-12 h-12" />
                    </div>
                    <div className="text-2xl font-bold mb-2">Upload Files</div>
                    <div className="text-gray-500">Drag & Drop</div>
                  </div>
                </div>
              </div>
              <div>
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-black text-white text-sm font-bold mb-4">
                  <span>STEP 2</span>
                </div>
                <h3 className="text-4xl font-bold mb-6">Upload Your Data</h3>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  Upload multiple files at once. For images, we support JPG, PNG, and other common formats. For text, upload TXT, CSV, or JSON files. Your data is stored securely.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1" />
                    <span className="text-gray-700 text-lg">Batch upload multiple files</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1" />
                    <span className="text-gray-700 text-lg">Preview your data before labeling</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1" />
                    <span className="text-gray-700 text-lg">Secure storage in the cloud</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="order-2 md:order-1">
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-black text-white text-sm font-bold mb-4">
                  <span>STEP 3</span>
                </div>
                <h3 className="text-4xl font-bold mb-6">Label Your Data</h3>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  Navigate through your dataset one item at a time. Add multiple labels to each item. For example, label an image as "cat", "pet", "animal". Easy navigation with previous/next buttons.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1" />
                    <span className="text-gray-700 text-lg">Add multiple labels per item</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1" />
                    <span className="text-gray-700 text-lg">Easy navigation through your dataset</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1" />
                    <span className="text-gray-700 text-lg">Edit or delete labels anytime</span>
                  </li>
                </ul>
              </div>
              <div className="order-1 md:order-2">
                <div className="border-2 border-gray-900 bg-white p-12 aspect-square flex items-center justify-center">
                  <div className="w-full">
                    <div className="bg-gray-100 h-32 mb-6 flex items-center justify-center">
                      <div className="text-gray-400 text-sm">Image Preview</div>
                    </div>
                    <div className="space-y-2">
                      <div className="border-2 border-gray-900 px-4 py-3 bg-gray-50">
                        <span className="font-bold">cat</span>
                      </div>
                      <div className="border-2 border-gray-900 px-4 py-3 bg-gray-50">
                        <span className="font-bold">pet</span>
                      </div>
                      <div className="border-2 border-gray-900 px-4 py-3 bg-gray-50">
                        <span className="font-bold">animal</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="border-2 border-gray-900 bg-black text-white p-12 aspect-square flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-24 h-24 border-2 border-white flex items-center justify-center mx-auto mb-6">
                      <Download className="w-12 h-12" />
                    </div>
                    <div className="text-2xl font-bold mb-2">Export JSON</div>
                    <div className="text-gray-400">Ready for AI Training</div>
                  </div>
                </div>
              </div>
              <div>
                <div className="inline-flex items-center space-x-2 px-4 py-2 bg-black text-white text-sm font-bold mb-4">
                  <span>STEP 4</span>
                </div>
                <h3 className="text-4xl font-bold mb-6">Export & Train</h3>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  When you're finished labeling, export your dataset as a JSON file. This format is ready to use with popular machine learning frameworks like TensorFlow, PyTorch, and scikit-learn.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start space-x-3">
                    <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1" />
                    <span className="text-gray-700 text-lg">Export in JSON format</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1" />
                    <span className="text-gray-700 text-lg">Compatible with major ML frameworks</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <CheckCircle2 className="w-6 h-6 flex-shrink-0 mt-1" />
                    <span className="text-gray-700 text-lg">Download and use immediately</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t-2 border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-5xl font-bold mb-8 tracking-tight">Built for Learning</h2>
              <p className="text-gray-600 text-xl leading-relaxed mb-8">
                LabelIed is designed with students and AI beginners in mind. No complex setup, no technical barriers — just a straightforward tool to help you understand how data labeling powers machine learning.
              </p>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-black text-white flex items-center justify-center flex-shrink-0">
                    <Zap className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-2">Zero Learning Curve</h4>
                    <p className="text-gray-600">Intuitive interface that anyone can use immediately</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-black text-white flex items-center justify-center flex-shrink-0">
                    <Database className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-2">Multiple Data Types</h4>
                    <p className="text-gray-600">Support for images and text data out of the box</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-black text-white flex items-center justify-center flex-shrink-0">
                    <Download className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xl mb-2">AI-Ready Export</h4>
                    <p className="text-gray-600">Export in formats ready for training machine learning models</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 aspect-square flex items-center justify-center border-2 border-gray-900">
              <div className="text-center p-12">
                <Tag className="w-32 h-32 mx-auto mb-6 text-gray-300" />
                <p className="text-gray-500 text-lg font-medium">Intuitive Labeling Interface</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t-2 border-gray-900 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <h2 className="text-5xl md:text-7xl font-bold mb-8 tracking-tight">
            Ready to start labeling?
          </h2>
          <p className="text-gray-400 text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
            Create your free account and start building your first labeled dataset in minutes. No credit card required.
          </p>
          <button
            onClick={onGetStarted}
            className="group inline-flex items-center space-x-3 px-10 py-5 bg-white text-black text-lg font-medium hover:bg-gray-200 transition-all hover:scale-105 active:scale-95"
          >
            <span>Get Started Free</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </section>

      <footer className="border-t-2 border-gray-900 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-black flex items-center justify-center">
                <Tag className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">LabelIed</span>
            </div>
            <p className="text-gray-600 font-medium">Data labeling made simple for everyone</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
