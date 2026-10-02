import { useState } from 'react';
import { useAppStore } from '../store';
import { engines } from '../lib/modelRegistry';
import { simulateJobProgress } from '../lib/utils';
import { GitCompare, Play, Check, Loader2 } from 'lucide-react';

interface CompareResult {
  engineId: string;
  status: 'idle' | 'processing' | 'completed' | 'failed';
  progress: number;
}

export default function CompareEngines() {
  const { compareEngines, setCompareEngines, useCredits } = useAppStore();
  const [inputImage, setInputImage] = useState<string | null>(null);
  const [results, setResults] = useState<CompareResult[]>([]);
  const [isComparing, setIsComparing] = useState(false);

  const toggleEngine = (id: string) => {
    if (compareEngines.includes(id)) {
      setCompareEngines(compareEngines.filter(e => e !== id));
    } else if (compareEngines.length < 6) {
      setCompareEngines([...compareEngines, id]);
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setInputImage(URL.createObjectURL(file));
  };

  const startComparison = () => {
    if (!inputImage || compareEngines.length < 2) return;
    const cost = compareEngines.length * 2;
    if (!useCredits(cost)) return;
    setIsComparing(true);
    const initialResults: CompareResult[] = compareEngines.map(id => ({ engineId: id, status: 'processing', progress: 0 }));
    setResults(initialResults);

    compareEngines.forEach((engineId) => {
      const engine = engines.find(e => e.id === engineId);
      const duration = engine?.speed === 'fast' ? 5000 : engine?.speed === 'medium' ? 8000 : 12000;
      simulateJobProgress(
        (progress) => { setResults(prev => prev.map(r => r.engineId === engineId ? { ...r, progress } : r)); },
        () => { setResults(prev => prev.map(r => r.engineId === engineId ? { ...r, status: 'completed', progress: 100 } : r)); },
        duration
      );
    });
    setTimeout(() => setIsComparing(false), 15000);
  };

  const allCompleted = results.length > 0 && results.every(r => r.status === 'completed');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Compare AI Engines</h1>
        <p className="text-gray-400 mt-1">Run the same input through multiple engines side by side</p>
      </div>

      <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
        <h3 className="font-semibold mb-3 flex items-center gap-2"><GitCompare className="w-4 h-4 text-indigo-400" /> Select Engines (2-6)</h3>
        <div className="flex flex-wrap gap-2">
          {engines.map(engine => (
            <button key={engine.id} onClick={() => toggleEngine(engine.id)}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${compareEngines.includes(engine.id) ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
              {engine.name}
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">Selected: {compareEngines.length}/6 engines</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <label className="block border-2 border-dashed border-white/10 rounded-xl p-6 text-center cursor-pointer hover:border-indigo-500/30 transition-all">
            <input type="file" accept=".jpg,.jpeg,.png,.webp" className="hidden" onChange={handleUpload} />
            {inputImage ? (
              <img src={inputImage} alt="Input" className="w-full rounded-lg" />
            ) : (
              <div className="text-gray-500"><p className="text-lg mb-2">Upload reference image</p><p className="text-sm">JPG, PNG, WebP — Max 20 MB</p></div>
            )}
          </label>

          <button onClick={startComparison} disabled={!inputImage || isComparing || compareEngines.length < 2}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            {isComparing ? (<><Loader2 className="w-4 h-4 animate-spin" /> Comparing...</>) : (<><Play className="w-4 h-4" /> Start Comparison ({compareEngines.length * 2} credits)</>)}
          </button>
        </div>

        <div className="lg:col-span-2">
          <div className={`grid gap-3 ${compareEngines.length <= 2 ? 'grid-cols-1 md:grid-cols-2' : compareEngines.length <= 4 ? 'grid-cols-2' : 'grid-cols-2 md:grid-cols-3'}`}>
            {compareEngines.map(engineId => {
              const engine = engines.find(e => e.id === engineId);
              const result = results.find(r => r.engineId === engineId);
              return (
                <div key={engineId} className="rounded-xl bg-white/[0.02] border border-white/5 overflow-hidden">
                  <div className="p-3 border-b border-white/5 flex items-center justify-between">
                    <span className="font-medium text-sm">{engine?.name}</span>
                    {result?.status === 'completed' && <Check className="w-4 h-4 text-green-400" />}
                    {result?.status === 'processing' && <Loader2 className="w-4 h-4 text-indigo-400 animate-spin" />}
                  </div>
                  <div className="aspect-square bg-gray-900/50 flex items-center justify-center">
                    {result?.status === 'completed' ? (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-900/30 to-cyan-900/30 flex items-center justify-center">
                        <div className="text-center"><div className="text-4xl mb-2">🎲</div><p className="text-xs text-gray-400">Generated result</p></div>
                      </div>
                    ) : result?.status === 'processing' ? (
                      <div className="text-center">
                        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin mx-auto mb-2" />
                        <p className="text-xs text-gray-400">{Math.round(result.progress)}%</p>
                        <div className="w-24 h-1 bg-white/5 rounded-full mt-2 mx-auto overflow-hidden">
                          <div className="h-full bg-indigo-500 transition-all" style={{ width: `${result.progress}%` }} />
                        </div>
                      </div>
                    ) : (<p className="text-gray-600 text-sm">Waiting...</p>)}
                  </div>
                  <div className="p-2 text-xs text-gray-500 text-center">{engine?.speed} • {engine?.quality}</div>
                </div>
              );
            })}
          </div>

          {allCompleted && (
            <div className="mt-4 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-300 text-sm">
              ✅ Comparison complete! All {compareEngines.length} engines have finished processing.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}