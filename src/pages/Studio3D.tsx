import { useState, useRef } from 'react';
import { useAppStore } from '../store';
import { engines } from '../lib/modelRegistry';
import { validateFile, generateId, simulateJobProgress, EXPORT_FORMATS } from '../lib/utils';
import { Upload, Box, Settings, Download, RotateCcw, Eye, Wrench, Paintbrush, Users, Printer, Code, Cpu } from 'lucide-react';
import Viewer3D from '../components/Viewer3D';

type Mode = 'image-to-3d' | 'multi-view' | 'batch';

export default function Studio3D() {
  const { selectedEngine, setSelectedEngine, useCredits, addJob, updateJob } = useAppStore();
  const [mode, setMode] = useState<Mode>('image-to-3d');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showViewer, setShowViewer] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    setError('');
    const newFiles: File[] = [];
    const newPreviews: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const validation = validateFile(file);
      if (!validation.valid) { setError(validation.error!); return; }
      newFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    }
    if (mode === 'multi-view' && (uploadedFiles.length + newFiles.length) > 4) {
      setError('Multi-view mode accepts maximum 4 images'); return;
    }
    setUploadedFiles(prev => [...prev, ...newFiles]);
    setPreviews(prev => [...prev, ...newPreviews]);
  };

  const handleGenerate = () => {
    if (uploadedFiles.length === 0) { setError('Please upload at least one image'); return; }
    const creditCost = mode === 'batch' ? uploadedFiles.length * 2 : 3;
    if (!useCredits(creditCost)) { setError('Insufficient credits.'); return; }
    setIsProcessing(true); setProgress(0); setShowViewer(false);
    const jobId = generateId();
    addJob({ id: jobId, status: 'processing', progress: 0, engine: selectedEngine, inputType: mode === 'batch' ? 'batch' : mode === 'multi-view' ? 'multi-view' : 'image', inputs: uploadedFiles.map(f => f.name), createdAt: new Date() });
    simulateJobProgress(
      (p) => { setProgress(p); updateJob(jobId, { progress: p }); },
      () => { setIsProcessing(false); setShowViewer(true); updateJob(jobId, { status: 'completed', progress: 100, completedAt: new Date() }); },
      mode === 'batch' ? 12000 : 8000
    );
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const filteredEngines = mode === 'multi-view'
    ? engines.filter(e => e.capabilities.includes('multi-view'))
    : engines.filter(e => e.capabilities.includes('image-to-3d'));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">3D Studio</h1>
          <p className="text-gray-400 mt-1">Convert images to textured 3D models with 15+ AI engines</p>
        </div>
        <div className="flex gap-2">
          {(['image-to-3d', 'multi-view', 'batch'] as Mode[]).map(m => (
            <button key={m} onClick={() => { setMode(m); setUploadedFiles([]); setPreviews([]); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${mode === m ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
              {m === 'image-to-3d' ? '📷 Image to 3D' : m === 'multi-view' ? '🔄 Multi-View' : '📦 Batch'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <div onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center cursor-pointer hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all">
            <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">
              {mode === 'multi-view' ? 'Upload 2-4 photos from different angles' : 'Drop images here or click to upload'}
            </p>
            <p className="text-sm text-gray-500">JPG, PNG, WebP — Max 20 MB per file</p>
            <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png,.webp" multiple={mode !== 'image-to-3d'}
              className="hidden" onChange={(e) => handleFiles(e.target.files)} />
          </div>

          {error && (<div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm">{error}</div>)}

          {previews.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {previews.map((preview, i) => (
                <div key={i} className="relative group rounded-lg overflow-hidden aspect-square bg-gray-800">
                  <img src={preview} alt="" className="w-full h-full object-cover" />
                  <button onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500/80 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                </div>
              ))}
            </div>
          )}

          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2"><Cpu className="w-4 h-4 text-indigo-400" /> AI Engine</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-2">
              {filteredEngines.map(engine => (
                <button key={engine.id} onClick={() => setSelectedEngine(engine.id)}
                  className={`p-3 rounded-lg text-left text-xs transition-all ${selectedEngine === engine.id ? 'bg-indigo-600/20 border-indigo-500/50 border' : 'bg-white/[0.02] border border-white/5 hover:border-white/10'}`}>
                  <div className="font-semibold text-sm">{engine.name}</div>
                  <div className="text-gray-500 mt-0.5">{engine.speed} • {engine.quality}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <h3 className="font-semibold flex items-center gap-2"><Settings className="w-4 h-4 text-indigo-400" /> Settings</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Quality</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm">
                  <option>Draft (Fast)</option><option>Standard</option><option>High</option><option>Ultra (8K)</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Poly Count</label>
                <select className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm">
                  <option>Auto</option><option>Low (Game-ready)</option><option>Medium</option><option>High</option>
                </select>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 mt-3">
              {[{ label: 'Quad Retopology', icon: Wrench }, { label: 'PBR Textures', icon: Paintbrush }, { label: 'Rigging', icon: Users }].map(opt => (
                <label key={opt.label} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded bg-white/5 border-white/20 text-indigo-600" />
                  <opt.icon className="w-3.5 h-3.5 text-gray-400" />
                  <span className="text-sm text-gray-300">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          <button onClick={handleGenerate} disabled={isProcessing || uploadedFiles.length === 0}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
            {isProcessing ? (<><RotateCcw className="w-5 h-5 animate-spin" />Generating... {Math.round(progress)}%</>) : (<><Box className="w-5 h-5" />Generate 3D Model (3 credits)</>)}
          </button>

          {isProcessing && (
            <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>

        <div className="space-y-4">
          {showViewer ? (
            <>
              <Viewer3D className="h-[400px]" />
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <h3 className="font-semibold mb-3 flex items-center gap-2"><Download className="w-4 h-4 text-cyan-400" /> Export (8 Formats)</h3>
                <div className="grid grid-cols-4 gap-2">
                  {EXPORT_FORMATS.map(fmt => (
                    <button key={fmt.id} className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-medium hover:bg-indigo-600/20 hover:border-indigo-500/30 transition-all" title={fmt.description}>
                      {fmt.name}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[{ label: 'Part Segmentation', icon: Box }, { label: 'AI Texture Refine', icon: Paintbrush }, { label: 'Multi-Color Print', icon: Printer }, { label: 'Blender Export', icon: Code }].map(tool => (
                  <button key={tool.label} className="p-3 rounded-lg bg-white/[0.02] border border-white/5 hover:border-indigo-500/20 transition-all text-sm flex items-center gap-2">
                    <tool.icon className="w-4 h-4 text-indigo-400" />{tool.label}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <div className="h-[400px] rounded-xl bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center text-gray-500">
              <Eye className="w-16 h-16 mb-4 opacity-30" />
              <p className="text-lg">3D Preview</p>
              <p className="text-sm">Upload an image and generate to preview</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}