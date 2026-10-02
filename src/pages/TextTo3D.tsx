import { useState } from 'react';
import { useAppStore } from '../store';
import { getTextTo3DEngines } from '../lib/modelRegistry';
import { generateId, simulateJobProgress } from '../lib/utils';
import { Type, Sparkles, RotateCcw } from 'lucide-react';
import Viewer3D from '../components/Viewer3D';

export default function TextTo3D() {
  const { selectedEngine, setSelectedEngine, useCredits, addJob, updateJob } = useAppStore();
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showViewer, setShowViewer] = useState(false);
  const [guidanceScale, setGuidanceScale] = useState(7.5);
  const textEngines = getTextTo3DEngines();

  const handleGenerate = () => {
    if (!prompt.trim()) return;
    if (!useCredits(3)) return;
    setIsProcessing(true); setProgress(0); setShowViewer(false);
    const jobId = generateId();
    addJob({ id: jobId, status: 'processing', progress: 0, engine: selectedEngine, inputType: 'text', inputs: [prompt], createdAt: new Date() });
    simulateJobProgress(
      (p) => { setProgress(p); updateJob(jobId, { progress: p }); },
      () => { setIsProcessing(false); setShowViewer(true); updateJob(jobId, { status: 'completed', progress: 100, completedAt: new Date() }); },
      10000
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Text to 3D</h1>
        <p className="text-gray-400 mt-1">Generate 3D models directly from text descriptions</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Describe your 3D model</label>
            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)}
              placeholder="A medieval stone castle with towers and a drawbridge..."
              className="w-full h-32 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm placeholder:text-gray-500 focus:outline-none focus:border-indigo-500/50 resize-none" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Negative prompt (optional)</label>
            <input type="text" placeholder="blurry, low quality, deformed..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm placeholder:text-gray-500 focus:outline-none focus:border-indigo-500/50" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">AI Engine</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {textEngines.map(engine => (
                <button key={engine.id} onClick={() => setSelectedEngine(engine.id)}
                  className={`p-3 rounded-lg text-left text-xs transition-all ${selectedEngine === engine.id ? 'bg-indigo-600/20 border-indigo-500/50 border' : 'bg-white/[0.02] border border-white/5 hover:border-white/10'}`}>
                  <div className="font-semibold text-sm">{engine.name}</div>
                  <div className="text-gray-500 mt-0.5">{engine.speed}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Guidance Scale: {guidanceScale}</label>
            <input type="range" min="1" max="20" step="0.5" value={guidanceScale}
              onChange={(e) => setGuidanceScale(parseFloat(e.target.value))} className="w-full accent-indigo-500" />
            <div className="flex justify-between text-xs text-gray-500"><span>Creative</span><span>Precise</span></div>
          </div>

          <button onClick={handleGenerate} disabled={isProcessing || !prompt.trim()}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            {isProcessing ? (<><RotateCcw className="w-5 h-5 animate-spin" /> Generating... {Math.round(progress)}%</>) : (<><Sparkles className="w-5 h-5" /> Generate 3D Model (3 credits)</>)}
          </button>

          {isProcessing && (
            <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          )}

          <div className="space-y-2">
            <p className="text-xs text-gray-500">Try these prompts:</p>
            <div className="flex flex-wrap gap-2">
              {['A cute robot character', 'Medieval sword', 'Sports car, futuristic', 'Fantasy treehouse'].map(p => (
                <button key={p} onClick={() => setPrompt(p)}
                  className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-all">
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {showViewer ? (
            <Viewer3D className="h-[500px]" />
          ) : (
            <div className="h-[500px] rounded-xl bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center text-gray-500">
              <Type className="w-16 h-16 mb-4 opacity-30" />
              <p className="text-lg">3D Preview</p>
              <p className="text-sm">Enter a text prompt and generate</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}