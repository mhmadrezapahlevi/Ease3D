import { ExportFormat } from '../types';

export const MAX_FILE_SIZE = 20 * 1024 * 1024;
export const ACCEPTED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export const EXPORT_FORMATS: { id: ExportFormat; name: string; description: string }[] = [
  { id: 'glb', name: 'GLB', description: 'Binary glTF — ideal for web & AR' },
  { id: 'obj', name: 'OBJ', description: 'Universal mesh format' },
  { id: 'fbx', name: 'FBX', description: 'Autodesk format for games/film' },
  { id: 'stl', name: 'STL', description: '3D printing standard' },
  { id: 'usdz', name: 'USDZ', description: 'Apple AR Quick Look' },
  { id: 'blend', name: 'BLEND', description: 'Blender native format' },
  { id: 'dae', name: 'DAE', description: 'Collada interchange format' },
  { id: '3mf', name: '3MF', description: 'Modern 3D printing format' },
];

export const CONVERTER_FORMATS = [
  { id: 'stl', name: 'STL' },
  { id: 'obj', name: 'OBJ' },
  { id: 'glb', name: 'GLB' },
  { id: 'ply', name: 'PLY' },
  { id: '3mf', name: '3MF' },
  { id: 'fbx', name: 'FBX' },
  { id: 'dae', name: 'DAE' },
];

export function validateFile(file: File): { valid: boolean; error?: string } {
  if (!ACCEPTED_MIME_TYPES.includes(file.type)) {
    return { valid: false, error: `Invalid file type. Accepted: JPG, PNG, WebP` };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, error: `File too large (${(file.size / 1024 / 1024).toFixed(1)} MB). Maximum: 20 MB` };
  }
  return { valid: true };
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
}

export function simulateJobProgress(
  onUpdate: (progress: number) => void,
  onComplete: () => void,
  durationMs: number = 8000
): () => void {
  let elapsed = 0;
  const interval = 100;
  const timer = setInterval(() => {
    elapsed += interval;
    const progress = Math.min((elapsed / durationMs) * 100, 100);
    onUpdate(progress);
    if (progress >= 100) {
      clearInterval(timer);
      onComplete();
    }
  }, interval);
  return () => clearInterval(timer);
}