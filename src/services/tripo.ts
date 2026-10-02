// Tripo AI API Service - Frontend
// Communicates with backend server that handles Tripo AI API calls

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export interface TripoGenerationResult {
  success: boolean;
  taskId: string;
  modelUrl?: string;
  originalModelUrl?: string;
  renderedImageUrl?: string;
  baseModelUrl?: string;
}

export interface GenerationOptions {
  modelVersion?: string;
  texture?: boolean;
  pbr?: boolean;
  faceLimit?: number;
  negativePrompt?: string;
  enableImageAutofix?: boolean;
}

/**
 * Generate 3D model from text using Tripo AI
 */
export async function generateFromText(
  prompt: string,
  options: GenerationOptions = {}
): Promise<TripoGenerationResult> {
  const response = await fetch(`${API_BASE_URL}/api/tripo/text-to-3d`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt,
      negativePrompt: options.negativePrompt || '',
      modelVersion: options.modelVersion || 'v3.1-20260211',
      texture: options.texture !== false,
      pbr: options.pbr !== false,
      faceLimit: options.faceLimit,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.details || error.error || 'Generation failed');
  }

  const result = await response.json();

  // Add originalModelUrl for direct download
  if (result.modelUrl && result.modelUrl.startsWith('/api/proxy-model')) {
    const urlParams = new URLSearchParams(result.modelUrl.split('?')[1]);
    result.originalModelUrl = urlParams.get('url');
  }

  return result;
}

/**
 * Generate 3D model from image using Tripo AI
 */
export async function generateFromImage(
  imageFile: File,
  options: GenerationOptions = {}
): Promise<TripoGenerationResult> {
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('modelVersion', options.modelVersion || 'v3.1-20260211');
  formData.append('texture', String(options.texture !== false));
  formData.append('pbr', String(options.pbr !== false));

  if (options.faceLimit) {
    formData.append('faceLimit', String(options.faceLimit));
  }

  if (options.enableImageAutofix) {
    formData.append('enableImageAutofix', 'true');
  }

  const response = await fetch(`${API_BASE_URL}/api/tripo/image-to-3d`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.details || error.error || 'Generation failed');
  }

  const result = await response.json();

  // Add originalModelUrl for direct download
  if (result.modelUrl && result.modelUrl.startsWith('/api/proxy-model')) {
    const urlParams = new URLSearchParams(result.modelUrl.split('?')[1]);
    result.originalModelUrl = urlParams.get('url');
  }

  return result;
}

/**
 * Check if backend is available
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * Get task status
 */
export async function getTaskStatus(taskId: string): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api/tripo/task/${taskId}`);

  if (!response.ok) {
    throw new Error('Failed to get task status');
  }

  return await response.json();
}
