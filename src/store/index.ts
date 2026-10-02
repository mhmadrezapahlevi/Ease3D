import { create } from 'zustand';
import { Job, BatchItem, CreditBalance, ViewerMode } from '../types';

interface AppState {
  // Navigation
  currentPage: string;
  setCurrentPage: (page: string) => void;

  // Credits
  credits: CreditBalance;
  addCredits: (amount: number) => void;
  useCredits: (amount: number) => boolean;

  // Jobs
  jobs: Job[];
  addJob: (job: Job) => void;
  updateJob: (id: string, updates: Partial<Job>) => void;

  // Batch
  batchItems: BatchItem[];
  setBatchItems: (items: BatchItem[]) => void;
  addBatchItem: (item: BatchItem) => void;
  clearBatch: () => void;

  // Viewer
  viewerMode: ViewerMode;
  setViewerMode: (mode: ViewerMode) => void;
  autoRotate: boolean;
  setAutoRotate: (rotate: boolean) => void;

  // Selected engine
  selectedEngine: string;
  setSelectedEngine: (engine: string) => void;

  // Compare mode
  compareEngines: string[];
  setCompareEngines: (engines: string[]) => void;

  // User
  isGuest: boolean;
  setIsGuest: (guest: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentPage: 'tripo-studio',
  setCurrentPage: (page) => set({ currentPage: page }),

  credits: { total: 30, used: 0, remaining: 30 },
  addCredits: (amount) => set((state) => ({
    credits: {
      total: state.credits.total + amount,
      used: state.credits.used,
      remaining: state.credits.remaining + amount,
    }
  })),
  useCredits: (amount) => {
    const state = useAppStore.getState();
    if (state.credits.remaining >= amount) {
      set({
        credits: {
          total: state.credits.total,
          used: state.credits.used + amount,
          remaining: state.credits.remaining - amount,
        }
      });
      return true;
    }
    return false;
  },

  jobs: [],
  addJob: (job) => set((state) => ({ jobs: [...state.jobs, job] })),
  updateJob: (id, updates) => set((state) => ({
    jobs: state.jobs.map(j => j.id === id ? { ...j, ...updates } : j)
  })),

  batchItems: [],
  setBatchItems: (items) => set({ batchItems: items }),
  addBatchItem: (item) => set((state) => ({ batchItems: [...state.batchItems, item] })),
  clearBatch: () => set({ batchItems: [] }),

  viewerMode: 'textured',
  setViewerMode: (mode) => set({ viewerMode: mode }),
  autoRotate: true,
  setAutoRotate: (rotate) => set({ autoRotate: rotate }),

  selectedEngine: 'meshy',
  setSelectedEngine: (engine) => set({ selectedEngine: engine }),

  compareEngines: ['meshy', 'tripo', 'hunyuan'],
  setCompareEngines: (engines) => set({ compareEngines: engines }),

  isGuest: true,
  setIsGuest: (guest) => set({ isGuest: guest }),
}));
