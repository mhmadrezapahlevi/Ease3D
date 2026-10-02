import { useState, useRef } from 'react';
import { Image, Upload, Wand2, RotateCcw, Download, Eraser, Crop, Sliders } from 'lucide-react';
import { validateFile } from '../lib/utils';

export default function ImageStudio() {
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [prompt, setPrompt] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState('');

  const handleUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    const validation = validateFile(file);
    if (!validation.valid) { setError(validation.error!); return; }
    setError('');
    setImage(URL.createObjectURL(file));
  };

  const handleGenerateFromText = () => {
    if (!prompt.trim()) return;
    setIsProcessing(true);
    setTimeout(() => { setIsProcessing(false); }, 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Image Studio</h1>
        <p className="text-gray-400 mt-1">Create or edit reference images before 3D conversion</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex gap-2">
            <button onClick={() => fileInputRef.current?.click()}
              className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-2">
              <Upload className="w-4 h-4" /> Upload Photo
            </button>
            <button className="flex-1 py-3 rounded-xl bg-indigo-600/20 border border-indigo-500/30 hover:bg-indigo-600/30 transition-all flex items-center justify-center gap-2 text-indigo-300">
              <Wand2 className="w-4 h-4" /> Generate from Text
            </button>
          </div>

          <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png,.webp" className="hidden" onChange={(e) => handleUpload(e.target.files)} />

          {error && (<div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm">{error}</div>)}

          <div className="aspect-square rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden flex items-center justify-center">
            {image ? (
              <img src={image} alt="Preview" className="w-full h-full object-contain" />
            ) : (
              <div className="text-center text-gray-500 p-8">
                <Image className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p>Upload an image or generate from text</p>
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <input type="text" value={prompt} onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the reference image to generate..."
              className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm placeholder:text-gray-500 focus:outline-none focus:border-indigo-500/50" />
            <button onClick={handleGenerateFromText} disabled={isProcessing || !prompt.trim()}
              className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-500 disabled:opacity-50 transition-all">
              {isProcessing ? <RotateCcw className="w-4 h-4 animate-spin" /> : 'Generate'}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold">Edit Tools</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: Eraser, label: 'Remove BG' }, { icon: Crop, label: 'Crop & Resize' }, { icon: Sliders, label: 'Adjust' },
              { icon: Wand2, label: 'AI Enhance' }, { icon: Image, label: 'Inpaint' }, { icon: Download, label: 'Export' },
            ].map(tool => (
              <button key={tool.label} className="p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-indigo-500/20 transition-all flex flex-col items-center gap-2">
                <tool.icon className="w-6 h-6 text-indigo-400" />
                <span className="text-xs text-gray-400">{tool.label}</span>
              </button>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
            <h4 className="font-medium text-sm">Quick Actions</h4>
            <div className="space-y-2">
              {['Remove background (transparent)', 'Upscale to 4K resolution', 'Generate multi-angle views', 'Create normal map', 'Generate PBR texture maps'].map(action => (
                <button key={action} className="w-full text-left px-3 py-2 rounded-lg bg-white/[0.02] hover:bg-white/5 text-sm text-gray-300 transition-all">
                  → {action}
                </button>
              ))}
            </div>
          </div>

          <button className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 text-white font-semibold hover:opacity-90 transition-all">
            Use as 3D Reference →
          </button>
        </div>
      </div>
    </div>
  );
}