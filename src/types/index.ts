export interface AIEngine {
  id: string;
  name: string;
  provider: string;
  capabilities: EngineCapability[];
  description: string;
  freeTierAvailable: boolean;
  maxResolution?: number;
  speed: 'fast' | 'medium' | 'slow';
  quality: 'standard' | 'high' | 'ultra';
}

export type EngineCapability =
  | 'image-to-3d'
  | 'multi-view'
  | 'text-to-3d'
  | 'rigging'
  | 'animation'
  | 'retopology'
  | 'texture-refinement'
  | 'part-segmentation';

export type ExportFormat = 'glb' | 'obj' | 'fbx' | 'stl' | 'usdz' | 'blend' | 'dae' | '3mf';
export type InputFormat = 'jpg' | 'jpeg' | 'png' | 'webp';

export interface Job {
  id: string;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number;
  engine: string;
  inputType: 'image' | 'multi-view' | 'text' | 'batch';
  inputs: string[];
  outputs?: string[];
  createdAt: Date;
  completedAt?: Date;
  error?: string;
}

export interface BatchItem {
  id: string;
  file: File | null;
  fileName: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  jobId?: string;
  preview?: string;
}

export interface ImageModel {
  id: string;
  name: string;
  provider: string;
  description: string;
  styles: string[];
}

export interface StylePreset {
  id: string;
  name: string;
  icon: string;
  description: string;
  prompt: string;
}

export interface CreditBalance {
  total: number;
  used: number;
  remaining: number;
}

export type ViewerMode = 'textured' | 'wireframe' | 'uv-map' | 'solid';
export type AspectRatio = '1:1' | '2:3' | '3:2' | '4:3' | '3:4' | '9:16' | '16:9';