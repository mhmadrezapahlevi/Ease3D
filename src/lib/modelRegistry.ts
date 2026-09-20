import { AIEngine, ImageModel, StylePreset } from '../types';

export const engines: AIEngine[] = [
  { id: 'meshy', name: 'Meshy', provider: 'Meshy AI', capabilities: ['image-to-3d', 'text-to-3d', 'texture-refinement', 'retopology'], description: 'Fast image-to-3D with PBR textures', freeTierAvailable: true, speed: 'fast', quality: 'high' },
  { id: 'tripo', name: 'Tripo', provider: 'Tripo AI', capabilities: ['image-to-3d', 'multi-view', 'text-to-3d', 'rigging', 'animation'], description: 'Multi-view with auto-rigging', freeTierAvailable: true, speed: 'medium', quality: 'high' },
  { id: 'hunyuan', name: 'Hunyuan3D', provider: 'Tencent', capabilities: ['image-to-3d', 'text-to-3d', 'texture-refinement'], description: 'Open-source high-fidelity 3D', freeTierAvailable: true, speed: 'medium', quality: 'high' },
  { id: 'rodin', name: 'Rodin', provider: 'Deemos', capabilities: ['image-to-3d', 'multi-view', 'part-segmentation', 'retopology'], description: 'High-detail with segmentation', freeTierAvailable: true, speed: 'slow', quality: 'ultra' },
  { id: 'prism-3', name: 'Prism 3.0', provider: 'Prism Labs', capabilities: ['image-to-3d', 'text-to-3d', 'texture-refinement', 'retopology'], description: 'Enhanced texture engine', freeTierAvailable: true, speed: 'medium', quality: 'high' },
  { id: 'prism-turbo', name: 'Prism Turbo', provider: 'Prism Labs', capabilities: ['image-to-3d', 'text-to-3d'], description: 'Fast generation', freeTierAvailable: true, speed: 'fast', quality: 'standard' },
  { id: 'csm', name: 'CSM', provider: 'CSM AI', capabilities: ['image-to-3d', 'text-to-3d', 'animation'], description: 'Single image to animated 3D', freeTierAvailable: true, speed: 'medium', quality: 'high' },
  { id: 'luma-genie', name: 'Luma Genie', provider: 'Luma AI', capabilities: ['text-to-3d', 'image-to-3d'], description: 'NeRF-based generation', freeTierAvailable: true, speed: 'slow', quality: 'high' },
  { id: 'point-e', name: 'Point-E', provider: 'OpenAI', capabilities: ['text-to-3d', 'image-to-3d'], description: 'Point cloud 3D generation', freeTierAvailable: true, speed: 'fast', quality: 'standard' },
  { id: 'shap-e', name: 'Shap-E', provider: 'OpenAI', capabilities: ['text-to-3d', 'image-to-3d'], description: 'Explicit 3D generation', freeTierAvailable: true, speed: 'medium', quality: 'standard' },
  { id: 'stable-3d', name: 'Stable 3D', provider: 'Stability AI', capabilities: ['image-to-3d', 'text-to-3d', 'texture-refinement'], description: 'SD-based 3D pipeline', freeTierAvailable: true, speed: 'medium', quality: 'high' },
  { id: 'instantmesh', name: 'InstantMesh', provider: 'Tencent', capabilities: ['image-to-3d', 'retopology'], description: 'Instant mesh from single view', freeTierAvailable: true, speed: 'fast', quality: 'standard' },
  { id: 'wonder3d', name: 'Wonder3D', provider: 'Wonder Studios', capabilities: ['image-to-3d', 'multi-view', 'texture-refinement'], description: 'Multi-view consistent 3D', freeTierAvailable: true, speed: 'medium', quality: 'high' },
  { id: 'dreamgaussian', name: 'DreamGaussian', provider: 'Research', capabilities: ['image-to-3d', 'text-to-3d'], description: 'Gaussian splatting 3D', freeTierAvailable: true, speed: 'fast', quality: 'high' },
  { id: 'magic3d', name: 'Magic3D', provider: 'NVIDIA', capabilities: ['text-to-3d', 'image-to-3d', 'texture-refinement'], description: 'High-res coarse-to-fine', freeTierAvailable: true, speed: 'slow', quality: 'ultra' },
  { id: 'syncdreamer', name: 'SyncDreamer', provider: 'Research', capabilities: ['image-to-3d', 'multi-view'], description: 'Synchronized multi-view', freeTierAvailable: true, speed: 'medium', quality: 'high' },
];

export const imageModels: ImageModel[] = [
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'OpenAI', description: 'High-quality image generation', styles: ['realistic', 'cartoon', 'render'] },
  { id: 'midjourney', name: 'Midjourney', provider: 'Midjourney', description: 'Artistic 3D-looking renders', styles: ['realistic', 'artistic', 'cinematic'] },
  { id: 'flux-kontext', name: 'Flux Kontext', provider: 'Black Forest Labs', description: 'Fast context-aware style transfer', styles: ['cartoon', 'render', 'clay'] },
];

export const stylePresets: StylePreset[] = [
  { id: 'ghibli', name: 'Ghibli', icon: '🏯', description: 'Studio Ghibli style', prompt: 'Studio Ghibli anime style' },
  { id: 'action-figure', name: 'Action Figure', icon: '🦸', description: 'Collectible figure', prompt: 'collectible action figure, plastic texture' },
  { id: 'clay', name: 'Clay', icon: '🏺', description: 'Claymation look', prompt: 'claymation style, clay material' },
  { id: 'lego', name: 'Lego', icon: '🧱', description: 'Lego minifigure', prompt: 'Lego minifigure style' },
  { id: 'pixar', name: 'Pixar', icon: '🎬', description: 'Pixar 3D animation', prompt: 'Pixar 3D animation style' },
  { id: 'disney', name: 'Disney', icon: '🏰', description: 'Classic Disney', prompt: 'Disney animation style' },
  { id: 'cartoon', name: 'Cartoon', icon: '🎨', description: '2.5D cartoon', prompt: '2.5D cartoon render' },
  { id: 'simpsons', name: 'Simpsons', icon: '🍩', description: 'Simpsons style', prompt: 'Simpsons cartoon style' },
  { id: 'oil-painting', name: 'Oil Painting', icon: '🖼️', description: 'Classical oil', prompt: 'oil painting style' },
  { id: 'cyberpunk', name: 'Cyberpunk', icon: '🌃', description: 'Neon aesthetic', prompt: 'cyberpunk style, neon lights' },
  { id: 'pixel', name: 'Pixel Art', icon: '👾', description: 'Retro pixel', prompt: 'pixel art style, 16-bit' },
  { id: 'pet-human', name: 'Pet to Human', icon: '🐾', description: 'Anthropomorphic', prompt: 'anthropomorphic, dressed in clothes' },
  { id: 'isometric', name: 'Isometric', icon: '📐', description: 'Isometric view', prompt: 'isometric 3D view' },
  { id: 'low-poly', name: 'Low Poly', icon: '💎', description: 'Low polygon', prompt: 'low poly 3D style' },
  { id: 'realistic-3d', name: 'Realistic 3D', icon: '🔮', description: 'Photorealistic', prompt: 'photorealistic 3D render' },
];

export function getEnginesByCapability(capability: string): AIEngine[] {
  return engines.filter(e => e.capabilities.includes(capability as any));
}

export function getTextTo3DEngines(): AIEngine[] {
  return getEnginesByCapability('text-to-3d');
}