import { create } from 'zustand';

interface AppState {
  isLatticeExpanded: boolean;
  isEditMode: boolean;
  activeComponentId: string | null;
  currentApp: string | null;
  currentAppCode: string | null;
  setLatticeExpanded: (expanded: boolean) => void;
  setEditMode: (enabled: boolean) => void;
  setActiveComponentId: (id: string | null) => void;
  setCurrentApp: (app: string | null) => void;
  setCurrentAppCode: (code: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isLatticeExpanded: true,
  isEditMode: false,
  activeComponentId: null,
  currentApp: null,
  currentAppCode: null,
  setLatticeExpanded: (expanded: boolean) => set({ isLatticeExpanded: expanded }),
  setEditMode: (enabled: boolean) => set({ isEditMode: enabled }),
  setActiveComponentId: (id: string | null) => set({ activeComponentId: id }),
  setCurrentApp: (app) => set({ currentApp: app }),
  setCurrentAppCode: (code) => set({ currentAppCode: code }),
}));
