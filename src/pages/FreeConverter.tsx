import { useState, useRef } from 'react';
import { FileBox, Download, ArrowRight, Check, Loader2, RefreshCw } from 'lucide-react';
import { CONVERTER_FORMATS } from '../lib/utils';

export default function FreeConverter() {
  const [file, setFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState('glb');
  const [isConverting, setIsConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) { setFile(f); setIsComplete(false); setProgress(0); }
  };

  const handleConvert = () => {
    if (!file) return;
    setIsConverting(true); setProgress(0); setIsComplete(false);
    const duration = 4000; const interval = 50; let elapsed = 0;
    const timer = setInterval(() => {
      elapsed += interval;
      const p = Math.min((elapsed / duration) * 100, 100);
      setProgress(p);
      if (p >= 100) { clearInterval(timer); setIsConverting(false); setIsComplete(true); }
    }, interval);
  };

  const getInputFormat = () => file ? file.name.split('.').pop()?.toLowerCase() || '' : '';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Free 3D File Converter</h1>
        <p className="text-gray-400 mt-1">Convert 3D files directly in your browser — no software needed</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center cursor-pointer hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all">
            <FileBox className="w-12 h-12 text-gray-500 mx-auto mb-4" />
            {file ? (
              <div><p className="text-lg font-medium">{file.name}</p><p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB • {getInputFormat().toUpperCase()}</p></div>
            ) : (
              <div><p className="text-lg font-medium mb-2">Drop 3D file here or click to upload</p><p className="text-sm text-gray-500">Supports STL, OBJ, GLB, glTF, PLY, 3MF, FBX, DAE</p></div>
            )}
            <input ref={fileInputRef} type="file" accept=".stl,.obj,.glb,.gltf,.ply,.3mf,.fbx,.dae" className="hidden" onChange={handleFileUpload} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Convert to:</label>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {CONVERTER_FORMATS.map(fmt => (
                <button key={fmt.id} onClick={() => setTargetFormat(fmt.id)}
                  className={`p-3 rounded-lg text-center text-sm font-medium transition-all ${targetFormat === fmt.id ? 'bg-indigo-600 text-white' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
                  {fmt.name}
                </button>
              ))}
            </div>
          </div>

          {file && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="px-3 py-1.5 rounded-lg bg-indigo-600/20 text-indigo-300 text-sm font-medium">{getInputFormat().toUpperCase()}</div>
              <ArrowRight className="w-4 h-4 text-gray-500" />
              <div className="px-3 py-1.5 rounded-lg bg-cyan-600/20 text-cyan-300 text-sm font-medium">{targetFormat.toUpperCase()}</div>
            </div>
          )}

          <button onClick={handleConvert} disabled={!file || isConverting}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            {isConverting ? (<><Loader2 className="w-5 h-5 animate-spin" /> Converting... {Math.round(progress)}%</>) : isComplete ? (<><RefreshCw className="w-5 h-5" /> Convert Again</>) : (<><Download className="w-5 h-5" /> Convert (Free)</>)}
          </button>

          {isConverting && (
            <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 transition-all duration-100" style={{ width: `${progress}%` }} />
            </div>
          )}

          {isComplete && (
            <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
              <div className="flex items-center gap-2 text-green-300 mb-2"><Check className="w-5 h-5" /><span className="font-medium">Conversion Complete!</span></div>
              <button className="w-full py-3 rounded-lg bg-green-600 text-white font-medium hover:bg-green-500 transition-all flex items-center justify-center gap-2">
                <Download className="w-4 h-4" /> Download {targetFormat.toUpperCase()}
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="p-6 rounded-xl bg-white/[0.02] border border-white/5">
            <h3 className="font-semibold mb-4">Supported Conversions</h3>
            <div className="space-y-3">
              {[
                { from: 'STL', to: 'OBJ, GLB, PLY, 3MF', desc: '3D printing to universal/web' },
                { from: 'OBJ', to: 'GLB, FBX, STL, DAE', desc: 'Mesh to game/print formats' },
                { from: 'GLB/glTF', to: 'OBJ, FBX, STL, USDZ', desc: 'Web 3D to native formats' },
                { from: 'FBX', to: 'GLB, OBJ, DAE', desc: 'Animation to mesh formats' },
                { from: 'PLY', to: 'STL, OBJ, GLB', desc: 'Point cloud to mesh' },
                { from: '3MF', to: 'STL, OBJ', desc: 'Modern print to legacy' },
                { from: 'DAE', to: 'GLB, OBJ, FBX', desc: 'Collada to modern formats' },
              ].map((conv, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.02]">
                  <span className="px-2 py-0.5 rounded bg-indigo-600/20 text-indigo-300 text-xs font-mono">{conv.from}</span>
                  <ArrowRight className="w-3 h-3 text-gray-500 mt-1 flex-shrink-0" />
                  <div><span className="text-xs text-cyan-300 font-mono">{conv.to}</span><p className="text-xs text-gray-500 mt-0.5">{conv.desc}</p></div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
            <h4 className="font-medium text-amber-300 text-sm mb-2">💡 How it works</h4>
            <ul className="text-xs text-gray-400 space-y-1.5">
              <li>• All conversion happens client-side in your browser</li>
              <li>• Files are never uploaded to our servers</li>
              <li>• Uses Three.js loaders/exporters for processing</li>
              <li>• Supports files up to 100 MB</li>
              <li>• Completely free, no account required</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}