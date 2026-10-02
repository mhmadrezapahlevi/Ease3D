import { useState, useRef } from 'react';
import { useAppStore } from '../store';
import { imageModels, stylePresets } from '../lib/modelRegistry';
import { validateFile } from '../lib/utils';
import { Palette, Upload, Sparkles, Download, Loader2, Wand2, Smartphone, Image as ImageIcon, Maximize2 } from 'lucide-react';
import { AspectRatio } from '../types';

export default function StyleConvert() {
  const { useCredits } = useAppStore();
  const [image, setImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState('pixar');
  const [selectedModel, setSelectedModel] = useState('gpt-4o');
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  const [customPrompt, setCustomPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const validation = validateFile(file);
    if (!validation.valid) { setError(validation.error!); return; }
    setError(''); setImage(URL.createObjectURL(file)); setResultImage(null);
  };

  const handleConvert = () => {
    if (!image) { setError('Please upload an image first'); return; }
    if (!useCredits(1)) { setError('Insufficient credits'); return; }
    setIsProcessing(true); setError('');
    setTimeout(() => { setIsProcessing(false); setResultImage(image); }, 5000);
  };

  const aspectRatios: { value: AspectRatio; label: string; icon: string }[] = [
    { value: '1:1', label: 'Square', icon: '⬜' }, { value: '2:3', label: 'Portrait', icon: '📱' },
    { value: '3:2', label: 'Landscape', icon: '🖥️' }, { value: '4:3', label: 'Standard', icon: '📺' },
    { value: '9:16', label: 'Stories', icon: '📲' }, { value: '16:9', label: 'Widescreen', icon: '🎬' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">2D → 3D-Style Image Conversion</h1>
          <p className="text-gray-400 mt-1">Transform photos into stunning 3D-looking images (output is an image, not a 3D model)</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
          <Smartphone className="w-4 h-4 text-amber-400" />
          <span className="text-xs text-amber-300">Also on EaseMate App — 30 bonus credits</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-white/10 rounded-2xl p-6 text-center cursor-pointer hover:border-pink-500/30 hover:bg-pink-500/5 transition-all">
            {image ? (
              <img src={image} alt="Input" className="w-full rounded-lg max-h-48 object-contain" />
            ) : (
              <><Upload className="w-10 h-10 text-gray-500 mx-auto mb-3" /><p className="text-sm font-medium">Upload image</p><p className="text-xs text-gray-500 mt-1">JPG, PNG, WebP — Max 20 MB</p></>
            )}
            <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png,.webp" className="hidden" onChange={handleUpload} />
          </div>

          {error && (<div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm">{error}</div>)}

          <div className="space-y-2">
            <h3 className="font-semibold text-sm flex items-center gap-2"><Palette className="w-4 h-4 text-pink-400" /> Style Presets</h3>
            <div className="grid grid-cols-3 gap-2 max-h-64 overflow-y-auto pr-1">
              {stylePresets.map(style => (
                <button key={style.id} onClick={() => setSelectedStyle(style.id)}
                  className={`p-2.5 rounded-lg text-center transition-all ${selectedStyle === style.id ? 'bg-pink-600/20 border-pink-500/50 border' : 'bg-white/[0.02] border border-white/5 hover:border-white/10'}`}>
                  <span className="text-xl block mb-1">{style.icon}</span>
                  <span className="text-xs text-gray-300">{style.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-sm flex items-center gap-2"><Wand2 className="w-4 h-4 text-purple-400" /> AI Model</h3>
            <div className="space-y-2">
              {imageModels.map(model => (
                <button key={model.id} onClick={() => setSelectedModel(model.id)}
                  className={`w-full p-3 rounded-lg text-left transition-all ${selectedModel === model.id ? 'bg-purple-600/20 border-purple-500/50 border' : 'bg-white/[0.02] border border-white/5 hover:border-white/10'}`}>
                  <div className="font-medium text-sm">{model.name}</div>
                  <div className="text-xs text-gray-500">{model.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="aspect-square rounded-2xl bg-white/[0.02] border border-white/5 overflow-hidden flex items-center justify-center relative">
            {isProcessing ? (
              <div className="text-center"><Loader2 className="w-12 h-12 text-pink-400 animate-spin mx-auto mb-4" /><p className="text-sm text-gray-400">Generating 3D-style image...</p></div>
            ) : resultImage ? (
              <div className="w-full h-full relative">
                <img src={resultImage} alt="Result" className="w-full h-full object-contain" />
                <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-green-500/80 text-white text-xs font-medium">✓ HD • No Watermark</div>
              </div>
            ) : image ? (
              <img src={image} alt="Input" className="w-full h-full object-contain p-4" />
            ) : (
              <div className="text-center text-gray-500 p-8"><ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-30" /><p>Upload an image to start</p></div>
            )}
          </div>

          <button onClick={handleConvert} disabled={!image || isProcessing}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-semibold hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
            {isProcessing ? (<><Loader2 className="w-5 h-5 animate-spin" /> Processing...</>) : (<><Sparkles className="w-5 h-5" /> Convert to 3D Style (1 credit)</>)}
          </button>

          {resultImage && !isProcessing && (
            <button className="w-full py-3 rounded-xl bg-green-600 text-white font-medium hover:bg-green-500 transition-all flex items-center justify-center gap-2">
              <Download className="w-4 h-4" /> Download HD (Watermark-Free)
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-sm flex items-center gap-2"><Maximize2 className="w-4 h-4 text-cyan-400" /> Aspect Ratio</h3>
            <div className="grid grid-cols-3 gap-2">
              {aspectRatios.map(ratio => (
                <button key={ratio.value} onClick={() => setAspectRatio(ratio.value)}
                  className={`p-2.5 rounded-lg text-center transition-all ${aspectRatio === ratio.value ? 'bg-cyan-600/20 border-cyan-500/50 border' : 'bg-white/[0.02] border border-white/5 hover:border-white/10'}`}>
                  <span className="text-lg block">{ratio.icon}</span>
                  <span className="text-xs text-gray-400">{ratio.value}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Custom Instructions</h3>
            <textarea value={customPrompt} onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Additional instructions for the AI..."
              className="w-full h-24 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm placeholder:text-gray-500 focus:outline-none focus:border-pink-500/50 resize-none" />
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-3">
            <h4 className="font-medium text-sm">Perfect For:</h4>
            <div className="space-y-2">
              {[
                { icon: '🏗️', text: 'Floor plans → 3D architecture visuals' },
                { icon: '👤', text: 'Portraits → 3D avatars' },
                { icon: '📱', text: 'Social media content' },
                { icon: '🎨', text: 'Logo & brand 3D mockups' },
                { icon: '🛍️', text: 'Product visualization' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-400"><span>{item.icon}</span><span>{item.text}</span></div>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-pink-500/5 border border-pink-500/10">
            <p className="text-xs text-gray-400">
              <strong className="text-pink-300">Note:</strong> This tool generates 2D images with a 3D appearance. The output is an image file, not a 3D model file.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-gradient-to-br from-purple-600/10 to-pink-600/10 border border-purple-500/20">
            <div className="flex items-center gap-3 mb-2">
              <Smartphone className="w-8 h-8 text-purple-400" />
              <div><p className="font-semibold text-sm">EaseMate App</p><p className="text-xs text-gray-400">Get 30 bonus free credits</p></div>
            </div>
            <button className="w-full py-2 rounded-lg bg-purple-600/30 border border-purple-500/30 text-sm text-purple-300 hover:bg-purple-600/40 transition-all">
              Download App →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}