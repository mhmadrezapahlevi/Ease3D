import { useState, useRef, useEffect, Suspense } from 'react';
import { useAppStore } from '../store';
import { generateFromImage, generateFromText, checkBackendHealth, type TripoGenerationResult } from '../services/tripo';
import { Upload, Settings, Download, Eye, Wand2, Sparkles, AlertCircle, CheckCircle, Loader2, ExternalLink, Zap, Box, Image as ImageIcon, RefreshCw } from 'lucide-react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Grid, Environment, useGLTF } from '@react-three/drei';

// Loading Component for 3D Model
function ModelLoader() {
  return (
    <mesh>
      <boxGeometry args={[0.5, 0.5, 0.5]} />
      <meshStandardMaterial color="#8b5cf6" wireframe />
    </mesh>
  );
}

// 3D Model Loader Component
function ModelViewer({ modelUrl }: { modelUrl: string }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3;
    }
  });

  const { scene } = useGLTF(modelUrl);

  return (
    <group ref={groupRef} scale={2}>
      <primitive object={scene} />
    </group>
  );
}

// Fallback 3D Model
function FallbackModel() {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <dodecahedronGeometry args={[1, 0]} />
        <meshStandardMaterial color="#8b5cf6" roughness={0.3} metalness={0.1} />
      </mesh>
      <mesh position={[0, -0.7, 0]} receiveShadow>
        <cylinderGeometry args={[1.2, 1.4, 0.2, 32]} />
        <meshStandardMaterial color="#1e1b4b" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.3, 0.05, 8, 32]} />
        <meshStandardMaterial color="#06b6d4" emissive="#06b6d4" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

type GenerationMode = 'image-to-3d' | 'text-to-3d';

const MODEL_VERSIONS = [
  { id: 'v3.1-20260211', label: 'v3.1 (Latest)', desc: 'Best quality' },
  { id: 'P1-20260311', label: 'P1 (Low-Poly)', desc: 'Optimized for games' },
  { id: 'v3.0-20250812', label: 'v3.0', desc: 'Stable' },
];

export default function TripoStudio() {
  const { useCredits } = useAppStore();
  const [mode, setMode] = useState<GenerationMode>('text-to-3d');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [result, setResult] = useState<TripoGenerationResult | null>(null);
  const [error, setError] = useState('');
  const [modelError, setModelError] = useState('');
  const [backendAvailable, setBackendAvailable] = useState<boolean | null>(null);
  const [modelVersion, setModelVersion] = useState('v3.1-20260211');
  const [enablePBR, setEnablePBR] = useState(true);
  const [enableTexture, setEnableTexture] = useState(true);
  const [negativePrompt, setNegativePrompt] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log('🎯 TripoStudio page loaded!');
    alert('✅ Tripo AI Studio loaded! This is the REAL API page.');
    checkBackendHealth().then((available) => {
      console.log('🔌 Backend available:', available);
      setBackendAvailable(available);
    });
  }, []);

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file');
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError('File size must be under 20MB');
      return;
    }

    setError('');
    setUploadedFile(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setModelError('');
  };

  const handleGenerate = async () => {
    if (mode === 'image-to-3d' && !uploadedFile) {
      setError('Please upload an image first');
      return;
    }
    if (mode === 'text-to-3d' && !prompt.trim()) {
      setError('Please enter a text prompt');
      return;
    }
    if (backendAvailable === false) {
      setError('Backend server is not running. Please start the server first.');
      return;
    }
    if (!useCredits(3)) {
      setError('Insufficient credits');
      return;
    }

    setIsProcessing(true);
    setError('');
    setModelError('');
    setResult(null);
    setProgress(0);
    setProgressMessage('Creating task...');

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 3;
        });

        setProgressMessage(prev => {
          const messages = [
            'Creating task...',
            'Generating 3D mesh...',
            'Adding textures...',
            'Applying PBR materials...',
            'Optimizing model...',
            'Almost done...',
          ];
          const currentIndex = messages.indexOf(prev);
          return messages[Math.min(currentIndex + 1, messages.length - 1)] || messages[0];
        });
      }, 5000);

      let generationResult: TripoGenerationResult;

      if (mode === 'image-to-3d' && uploadedFile) {
        generationResult = await generateFromImage(uploadedFile, {
          modelVersion,
          texture: enableTexture,
          pbr: enablePBR,
          enableImageAutofix: true,
        });
      } else {
        generationResult = await generateFromText(prompt, {
          modelVersion,
          texture: enableTexture,
          pbr: enablePBR,
          negativePrompt,
        });
      }

      clearInterval(progressInterval);
      setProgress(100);
      setProgressMessage('Complete!');

      console.log('✅ Generation result:', generationResult);

      if (!generationResult.modelUrl) {
        throw new Error('No model URL returned from API');
      }

      setResult(generationResult);
    } catch (err) {
      console.error('❌ Generation error:', err);
      setError(err instanceof Error ? err.message : 'Generation failed');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadOriginal = () => {
    if (result?.originalModelUrl) {
      window.open(result.originalModelUrl, '_blank');
    }
  };

  return (
    <div className="space-y-6">
      {/* DEBUG BANNER - VERY VISIBLE */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-2 border-emerald-400">
        <div className="flex items-center gap-3">
          <div className="text-4xl">🚀</div>
          <div>
            <h2 className="text-xl font-bold">TRIPO AI STUDIO - LIVE API</h2>
            <p className="text-sm opacity-90">
              ✅ This page is connected to Tripo AI API | Backend: {backendAvailable === null ? 'Checking...' : backendAvailable ? '✅ Connected' : '❌ Offline'}
            </p>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
              <Box className="w-6 h-6 text-white" />
            </div>
            Tripo AI Studio
          </h1>
          <p className="text-gray-400 mt-1">
            Generate 3D models from images or text using Tripo AI
          </p>
        </div>

        {/* Backend Status */}
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm ${
          backendAvailable === null ? 'bg-gray-500/10 text-gray-400' :
          backendAvailable ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
          'bg-red-500/10 text-red-400 border border-red-500/20'
        }`}>
          {backendAvailable === null ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : backendAvailable ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          <span>
            {backendAvailable === null ? 'Checking server...' :
             backendAvailable ? 'Backend Connected' : 'Backend Offline'}
          </span>
        </div>
      </div>

      {/* Backend Not Available Warning */}
      {backendAvailable === false && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-300 mb-1">Backend Server Not Running</h3>
              <p className="text-sm text-amber-200/80 mb-3">
                To use Tripo AI, you need to start the backend server first:
              </p>
              <div className="bg-black/30 rounded-lg p-3 font-mono text-xs text-amber-100">
                <p className="text-gray-400"># 1. Open a new terminal</p>
                <p>cd server</p>
                <p className="text-gray-400 mt-2"># 2. Install dependencies</p>
                <p>npm install</p>
                <p className="text-gray-400 mt-2"># 3. Start the server</p>
                <p>npm start</p>
              </div>
              <a
                href="https://platform.tripo3d.ai/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-3 text-sm text-amber-300 hover:text-amber-200"
              >
                Manage API Keys <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Mode Selection */}
      <div className="flex gap-2">
        <button
          onClick={() => { setMode('text-to-3d'); setResult(null); setError(''); setModelError(''); }}
          className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
            mode === 'text-to-3d'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'
              : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
          }`}
        >
          <Wand2 className="w-5 h-5" />
          Text to 3D
        </button>
        <button
          onClick={() => { setMode('image-to-3d'); setResult(null); setError(''); setModelError(''); }}
          className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
            mode === 'image-to-3d'
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'
              : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
          }`}
        >
          <ImageIcon className="w-5 h-5" />
          Image to 3D
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Left Column - Input */}
        <div className="space-y-4">
          {/* Text Prompt */}
          {mode === 'text-to-3d' && (
            <div className="space-y-3">
              <label className="text-sm font-medium text-gray-300">Describe your 3D model</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="A medieval stone castle with towers and a drawbridge..."
                className="w-full h-32 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm placeholder:text-gray-500 focus:outline-none focus:border-emerald-500/50 resize-none"
              />

              {/* Quick Prompts */}
              <div className="flex flex-wrap gap-2">
                {['A cute cat', 'Medieval sword', 'Sports car, futuristic', 'Fantasy treehouse', 'A robot character'].map(p => (
                  <button
                    key={p}
                    onClick={() => setPrompt(p)}
                    className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs text-gray-400 hover:text-white hover:bg-white/10 transition-all"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Image Upload */}
          {mode === 'image-to-3d' && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-white/10 rounded-2xl p-8 text-center cursor-pointer hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all"
            >
              {preview ? (
                <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
              ) : (
                <>
                  <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-lg font-medium mb-2">Upload an image</p>
                  <p className="text-sm text-gray-500">JPG, PNG, WebP — Max 20 MB</p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files)}
              />
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-300 text-sm flex items-start gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Settings */}
          <div className="space-y-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
            <h3 className="font-semibold flex items-center gap-2">
              <Settings className="w-4 h-4 text-emerald-400" />
              Generation Settings
            </h3>

            {/* Model Version */}
            <div>
              <label className="text-xs text-gray-400 mb-2 block">Model Version</label>
              <div className="space-y-2">
                {MODEL_VERSIONS.map(version => (
                  <button
                    key={version.id}
                    onClick={() => setModelVersion(version.id)}
                    className={`w-full p-3 rounded-lg text-left transition-all flex items-center justify-between ${
                      modelVersion === version.id
                        ? 'bg-emerald-600/20 border-emerald-500/50 border'
                        : 'bg-white/[0.02] border border-white/5 hover:border-white/10'
                    }`}
                  >
                    <div>
                      <div className="font-medium text-sm">{version.label}</div>
                      <div className="text-xs text-gray-500">{version.desc}</div>
                    </div>
                    {modelVersion === version.id && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggles */}
            <div className="flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enableTexture}
                  onChange={(e) => setEnableTexture(e.target.checked)}
                  className="w-4 h-4 rounded bg-white/5 border-white/20 text-emerald-600"
                />
                <span className="text-sm text-gray-300">Texture</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={enablePBR}
                  onChange={(e) => setEnablePBR(e.target.checked)}
                  className="w-4 h-4 rounded bg-white/5 border-white/20 text-emerald-600"
                />
                <span className="text-sm text-gray-300">PBR Materials</span>
              </label>
            </div>

            {/* Negative Prompt */}
            {mode === 'text-to-3d' && (
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Negative Prompt (optional)</label>
                <input
                  type="text"
                  value={negativePrompt}
                  onChange={(e) => setNegativePrompt(e.target.value)}
                  placeholder="blurry, low quality, deformed..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:border-emerald-500/50"
                />
              </div>
            )}
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={isProcessing || (mode === 'text-to-3d' ? !prompt.trim() : !uploadedFile) || backendAvailable === false}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating... {Math.round(progress)}%
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate 3D Model (3 credits)
              </>
            )}
          </button>

          {/* Progress Bar */}
          {isProcessing && (
            <div className="space-y-2">
              <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-400 text-center">{progressMessage}</p>
              <p className="text-xs text-gray-500 text-center">
                ⏱️ Typical generation takes 10-120 seconds
              </p>
            </div>
          )}
        </div>

        {/* Right Column - 3D Viewer */}
        <div className="space-y-4">
          {result ? (
            <>
              {/* 3D Model Viewer */}
              <div className="relative w-full h-[400px] rounded-xl overflow-hidden bg-gray-900 border border-white/5">
                <Canvas shadows camera={{ position: [3, 2, 3], fov: 50 }}>
                  <ambientLight intensity={0.4} />
                  <directionalLight position={[5, 5, 5]} intensity={1} castShadow />
                  <pointLight position={[-3, 2, -3]} intensity={0.5} color="#06b6d4" />

                  <Suspense fallback={<ModelLoader />}>
                    {result.modelUrl && !modelError ? (
                      <ModelViewer modelUrl={result.modelUrl} />
                    ) : (
                      <FallbackModel />
                    )}
                  </Suspense>

                  <Grid args={[10, 10]} cellColor="#1e1b4b" sectionColor="#4f46e5" fadeDistance={15} position={[0, -0.8, 0]} />
                  <OrbitControls enableDamping dampingFactor={0.05} />
                  <Environment preset="city" />
                </Canvas>

                {/* Success Badge */}
                <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-green-500/80 text-white text-xs font-medium flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Generated Successfully
                </div>

                {/* Model Load Error */}
                {modelError && (
                  <div className="absolute bottom-4 left-4 right-4 px-3 py-2 rounded-lg bg-red-500/80 text-white text-xs flex items-center gap-2">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    <span>⚠️ {modelError}</span>
                  </div>
                )}

                {/* Warning about URL expiry */}
                {!modelError && (
                  <div className="absolute bottom-4 left-4 right-4 px-3 py-2 rounded-lg bg-amber-500/80 text-white text-xs flex items-center gap-2">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    <span>⚠️ Model URL expires in 5 minutes. Download now!</span>
                  </div>
                )}
              </div>

              {/* Rendered Image Preview */}
              {result.renderedImageUrl && (
                <div className="rounded-xl overflow-hidden border border-white/5">
                  <img src={result.renderedImageUrl} alt="Rendered Preview" className="w-full" />
                  <p className="text-xs text-gray-500 text-center py-2 bg-white/[0.02]">AI Rendered Preview</p>
                </div>
              )}

              {/* Download Options */}
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Download className="w-4 h-4 text-cyan-400" />
                  Download 3D Model
                </h3>
                <div className="space-y-2">
                  {result.originalModelUrl && (
                    <button
                      onClick={handleDownloadOriginal}
                      className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-medium hover:opacity-90 transition-all flex items-center justify-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download GLB Model (Direct from Tripo)
                    </button>
                  )}
                  {result.renderedImageUrl && (
                    <a
                      href={result.renderedImageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full px-4 py-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-gray-300"
                    >
                      <Download className="w-4 h-4" />
                      Download Preview Image
                    </a>
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-3 text-center">
                  Compatible with: Blender, Unity, Unreal Engine, Three.js, Babylon.js
                </p>
              </div>

              {/* Retry Button if Model Failed to Load */}
              {modelError && (
                <button
                  onClick={handleGenerate}
                  className="w-full py-3 rounded-xl bg-amber-600 text-white font-medium hover:bg-amber-500 transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Retry Generation
                </button>
              )}
            </>
          ) : (
            /* Empty State */
            <div className="h-[400px] rounded-xl bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center text-gray-500">
              <Eye className="w-16 h-16 mb-4 opacity-30" />
              <p className="text-lg">3D Preview</p>
              <p className="text-sm">
                {mode === 'text-to-3d' ? 'Enter a prompt and generate' : 'Upload an image and generate'}
              </p>
            </div>
          )}

          {/* Info Box */}
          <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
            <div className="flex items-start gap-2">
              <Zap className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-gray-400">
                <p className="font-medium text-emerald-300 mb-1">Powered by Tripo AI</p>
                <p>
                  Tripo generates high-quality 3D models with PBR textures.
                  Generation typically takes 10-120 seconds. Model URLs expire after 5 minutes.
                </p>
                <a
                  href="https://platform.tripo3d.ai/docs/generation"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 mt-2 text-emerald-300 hover:text-emerald-200"
                >
                  View API Documentation <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
