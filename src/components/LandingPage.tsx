import React from 'react';
import { Database, Download, Tag, ArrowRight, Upload, Sparkles, CheckCircle2, Zap } from 'lucide-react';
import Logo from './Logo';

// Simple Typewriter component: types the provided text one char at a time with a blinking caret.
function Typewriter({ text, speed = 40 }: { text: string; speed?: number }) {
  const [pos, setPos] = React.useState(0);
  const [visible, setVisible] = React.useState(true);

  React.useEffect(() => {
    const t = setInterval(() => setVisible(v => !v), 500);
    return () => clearInterval(t);
  }, []);

  React.useEffect(() => {
    if (pos >= text.length) return;
    const id = window.setTimeout(() => setPos(p => Math.min(text.length, p + 1)), speed);
    return () => clearTimeout(id);
  }, [pos, text, speed]);

  return (
    <span aria-live="polite" className="inline-block">
      <span>{text.slice(0, pos)}</span>
      <span className="inline-block w-1 align-middle ml-1" aria-hidden style={{ opacity: visible ? 1 : 0 }}>
        <span className="h-6 border-r-2 border-black" />
      </span>
    </span>
  );
}

function InteractiveNeon() {
  const ref = React.useRef<HTMLDivElement | null>(null);
  const pulseRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    return () => {
      if (pulseRef.current) window.clearTimeout(pulseRef.current);
    };
  }, []);

  const setVars = (el: HTMLElement | null, x = 0, y = 0, pulse = 0) => {
    if (!el) return;
    el.style.setProperty('--mx', String(x));
    el.style.setProperty('--my', String(y));
    el.style.setProperty('--pulse', String(pulse));
  };

  const onPointerMove: React.PointerEventHandler = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / rect.width; // -0.5..0.5-ish
    const dy = (e.clientY - cy) / rect.height;
    // scale to nicer tilt
    setVars(el, dx * 18, dy * -10, 0);
  };

  const onPointerLeave: React.PointerEventHandler = () => {
    setVars(ref.current, 0, 0, 0);
  };

  const triggerPulse = () => {
    const el = ref.current;
    if (!el) return;
    setVars(el, Number(getComputedStyle(el).getPropertyValue('--mx') || 0), Number(getComputedStyle(el).getPropertyValue('--my') || 0), 1);
    if (pulseRef.current) window.clearTimeout(pulseRef.current);
    pulseRef.current = window.setTimeout(() => setVars(el, 0, 0, 0), 420);
  };

  const onKeyDown: React.KeyboardEventHandler = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      triggerPulse();
    }
  };

  return (
    <div
      ref={ref}
      role="button"
      tabIndex={0}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onClick={triggerPulse}
      onKeyDown={onKeyDown}
      className="neon-shape-wrapper w-40 h-40 md:w-56 md:h-56 focus:ring-4 focus:ring-indigo-200/40 rounded-lg"
      aria-pressed={false}
      style={{ ['--mx' as any]: 0, ['--my' as any]: 0, ['--pulse' as any]: 0 }}
    >
      <div className="neon-shape interactive" aria-hidden />
      <div className="neon-glow" aria-hidden />
    </div>
  );
}

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  const [demoTags, setDemoTags] = React.useState<{ id: string; label: string; selected: boolean }[]>([
    { id: 't1', label: 'cat', selected: false },
    { id: 't2', label: 'outdoor', selected: false },
    { id: 't3', label: 'sunny', selected: false },
  ]);

  const toggleDemoTag = (id: string) => {
    setDemoTags((t) => t.map(tag => tag.id === id ? { ...tag, selected: !tag.selected } : tag));
  };
  // smooth scroll progress using requestAnimationFrame + lerp
  React.useEffect(() => {
    const target = { value: 0 };
    const current = { value: 0 };
    let rafId: number | null = null;

    const getPct = () => {
      const scrolled = window.scrollY || window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      return docHeight > 0 ? (scrolled / docHeight) * 100 : 0;
    };

    const updateTarget = () => {
      target.value = getPct();
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      current.value = lerp(current.value, target.value, 0.12);
      const bar = document.getElementById('scroll-progress-bar');
      if (bar) bar.style.width = current.value + '%';
      rafId = requestAnimationFrame(animate);
    };

    updateTarget();
    rafId = requestAnimationFrame(animate);
    window.addEventListener('scroll', updateTarget, { passive: true });
    window.addEventListener('resize', updateTarget);

    return () => {
      window.removeEventListener('scroll', updateTarget);
      window.removeEventListener('resize', updateTarget);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div className="min-h-screen bg-white text-black">
      {/* Scroll progress bar */}
      <div className="fixed top-0 left-0 right-0 h-1 z-50 bg-transparent">
        <div id="scroll-progress-bar" className="h-1 bg-gradient-to-r from-violet-600 to-indigo-600 transition-all w-0" />
      </div>
      {/* Navbar */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <Logo size={36} />
              <span className="text-lg font-bold">LabelIed</span>
            </div>
            <button
              onClick={onGetStarted}
              className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-medium rounded-lg hover:opacity-90 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-violet-600/20"
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-white"></div>
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-white"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
          <style>{`
            .neon-shape-wrapper { position: relative; display: inline-block; }
            .neon-shape {
              width: 100%; height: 100%;
              border-radius: 40% 60% 50% 50% / 55% 45% 65% 35%;
              background: radial-gradient(circle at 30% 20%, rgba(99,102,241,0.95), transparent 25%),
                          linear-gradient(135deg, rgba(29,78,216,0.85), rgba(139,92,246,0.9) 60%);
              transform: rotate3d(1, 1, 0, 20deg) translateZ(0);
              filter: blur(0.25px) saturate(140%);
              animation: morph 6s ease-in-out infinite, beat 2s ease-in-out infinite;
              box-shadow: 0 8px 40px rgba(99,102,241,0.18), inset 0 -6px 24px rgba(99,102,241,0.08);
              position: relative;
            }

            .neon-shape.interactive {
              cursor: pointer;
              transition: transform 220ms cubic-bezier(.2,.9,.2,1), box-shadow 220ms;
              /* use CSS vars set by JS to tilt/translate and pulse */
              transform: translate3d(calc(var(--mx, 0) * 1px), calc(var(--my, 0) * 1px), 0) rotate3d(1,1,0,20deg) scale(calc(1 + (var(--pulse, 0) * 0.06)));
              will-change: transform;
            }

            .neon-glow {
              position: absolute; inset: -8px; border-radius: inherit;
              background: radial-gradient(circle at 30% 30%, rgba(99,102,241,0.22), transparent 20%),
                          radial-gradient(circle at 70% 70%, rgba(99,102,241,0.16), transparent 25%);
              filter: blur(12px);
              pointer-events: none;
              transform: scale(1.02);
              animation: glowShift 8s ease-in-out infinite;
            }

            @keyframes morph {
              0% { border-radius: 42% 58% 48% 52% / 52% 48% 62% 38%; transform: rotate3d(1,1,0,18deg) scale(1); }
              25% { border-radius: 58% 42% 44% 56% / 45% 55% 38% 62%; transform: rotate3d(1,-1,0,16deg) scale(1.04); }
              50% { border-radius: 50% 50% 60% 40% / 60% 40% 50% 50%; transform: rotate3d(-1,1,0,22deg) scale(0.98) translateY(-4px); }
              75% { border-radius: 44% 56% 52% 48% / 48% 52% 58% 42%; transform: rotate3d(0.8,0.6,0,20deg) scale(1.03); }
              100% { border-radius: 42% 58% 48% 52% / 52% 48% 62% 38%; transform: rotate3d(1,1,0,18deg) scale(1); }
            }

            @keyframes beat {
              0%, 100% { box-shadow: 0 8px 40px rgba(99,102,241,0.18), inset 0 -6px 24px rgba(99,102,241,0.08); }
              50% { box-shadow: 0 18px 60px rgba(99,102,241,0.26), inset 0 -10px 36px rgba(99,102,241,0.12); transform: scale(1.02); }
            }

            @keyframes glowShift {
              0% { transform: translateY(0) scale(1.02); opacity: 1 }
              50% { transform: translateY(-6px) scale(1.06); opacity: 0.85 }
              100% { transform: translateY(0) scale(1.02); opacity: 1 }
            }
          `}</style>
          <div className="text-center">
            <div className="inline-flex items-center space-x-2 px-4 py-2 bg-black text-white text-sm font-medium mb-8 rounded-full">
              <Sparkles className="w-4 h-4" />
              <span>Simple Data Labeling for AI</span>
            </div>
            <div className="flex items-center justify-center gap-8 flex-col md:flex-row">
                  <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-tight md:whitespace-normal max-w-2xl">
                <Typewriter text={"Turn messy data into reliable models — faster."} />
              </h1>

              {/* Neon morphing 3D-ish shape */}
              <div className="mt-6 md:mt-0">
                    <div className="ml-0 md:ml-4 lg:ml-8">
                      <InteractiveNeon />
                    </div>
              </div>
            </div>
            <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
              Label images and text with a simple, human-friendly interface. Ship clean datasets for training with less time and fewer mistakes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={onGetStarted}
                className="group inline-flex items-center space-x-2 px-6 py-3 bg-black text-white text-sm font-medium rounded hover:opacity-95 transition-all"
              >
                Start Labeling
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
  <section className="py-24 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-3 p-4 rounded-xl bg-white border border-gray-100">
              <div className="w-10 h-10 bg-gray-100 flex items-center justify-center rounded-lg">
                <Upload className="w-5 h-5 text-black" />
              </div>
              <h3 className="text-base font-semibold text-black">Upload Your Data</h3>
              <p className="text-sm text-gray-600">
                Upload your images or text data that needs labeling. Support for various file formats.
              </p>
            </div>

            <div className="space-y-4 p-6 rounded-xl bg-white border border-gray-100">
              <div className="w-12 h-12 bg-gray-100 flex items-center justify-center rounded-lg">
                <Tag className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-lg font-semibold text-black">Label with Ease</h3>
              <p className="text-gray-600">
                Simple and intuitive interface for labeling your data. Perfect for both beginners and experts.
              </p>
            </div>

            <div className="space-y-4 p-6 rounded-xl bg-white border border-gray-100">
              <div className="w-12 h-12 bg-gray-100 flex items-center justify-center rounded-lg">
                <Download className="w-6 h-6 text-black" />
              </div>
              <h3 className="text-lg font-semibold text-black">Export & Use</h3>
              <p className="text-gray-600">
                Export your labeled data in various formats ready to be used in your AI models.
              </p>
            </div>
          </div>
        </div>
      </section>

  {/* Why Choose Us Section */}
  <section className="py-24 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-4 text-black">Why Choose LabelIed?</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3 p-3 rounded-lg bg-white border border-gray-100">
                  <div className="flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-black" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-black">Simple & Intuitive</h3>
                    <p className="text-gray-600">
                      Designed with simplicity in mind. No complex setup or learning curve required.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 rounded-lg bg-white border border-gray-100">
                  <div className="flex-shrink-0">
                    <Database className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-black">Multiple Data Types</h3>
                    <p className="text-gray-600">
                      Support for both image and text data labeling. More formats coming soon.
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4 p-4 rounded-lg bg-white border border-gray-100">
                  <div className="flex-shrink-0">
                    <Zap className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2 text-black">Fast & Efficient</h3>
                    <p className="text-gray-600">
                      Optimized for speed and efficiency. Label more data in less time.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl shadow-violet-600/20 bg-white border border-gray-100">
                {/* small animated demo */}
                <style>{`
                  @keyframes popIn { 0% { transform: translateY(8px) scale(.95); opacity:0 } 60% { opacity:1; transform: translateY(0) scale(1.04) } 100% { transform: translateY(0) scale(1); } }
                  .demo-tag { opacity: 0; transform: translateY(8px) scale(.95); animation: popIn 560ms cubic-bezier(.2,.8,.2,1) forwards; }
                `}</style>
                <div className="relative h-full w-full bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
                  <div className="w-10/12 h-4/5 bg-gradient-to-br from-violet-500 to-indigo-500 rounded-xl relative overflow-hidden">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
                    {/* mock image area */}
                    <div className="absolute left-4 top-4 w-32 h-20 bg-white/30 rounded-md" />
                    {/* animated tags (interactive) */}
                    <div className="absolute left-6 bottom-6 flex space-x-2">
                      {demoTags.map((t, i) => (
                        <button
                          key={t.id}
                          onClick={() => toggleDemoTag(t.id)}
                          aria-pressed={t.selected}
                          className={`demo-tag inline-flex items-center px-2.5 py-1 rounded-full text-xs shadow-sm transition-colors ${
                            t.selected ? 'bg-white text-indigo-700' : 'bg-white/90 text-gray-900'
                          }`}
                          style={{ animationDelay: `${0.15 + i * 0.2}s` }}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="text-sm font-semibold mb-1">Try it — in seconds</h4>
                  <p className="text-sm text-gray-600">Upload an image, click label chips to tag content, and export your labeled dataset as JSON. The demo above shows tags appearing as you label.</p>

                  <div className="mt-3 bg-white/80 border border-gray-100 rounded-md p-3 text-xs text-gray-800">
                    <div className="font-medium text-sm text-gray-900 mb-1">Selected labels (preview)</div>
                    <pre className="max-h-28 overflow-auto text-[11px]">{JSON.stringify(demoTags.filter(d => d.selected).map(d => d.label), null, 2)}</pre>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight">
            Ready to Start Labeling?
          </h2>
          <p className="text-base text-gray-600 mb-8 max-w-xl mx-auto">
            Create your free account and start building your first labeled dataset in minutes.
          </p>
          <button
            onClick={onGetStarted}
            className="group inline-flex items-center space-x-2 px-6 py-3 bg-black text-white text-sm font-medium rounded hover:opacity-95 transition-all"
          >
            Get Started Free
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <p className="mt-6 text-zinc-500">No credit card required • Free forever</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-3">
              <Logo size={28} />
              <span className="text-xl font-bold">LabelIed</span>
            </div>
            <p className="text-gray-600">Data labeling made simple for everyone</p>
          </div>
        </div>
      </footer>
    </div>
  );
}