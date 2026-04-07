import { create } from 'zustand';

interface AppState {
  isLatticeExpanded: boolean;
  isEditMode: boolean;
  activeComponentId: string | null;
  currentApp: string | null;
  setLatticeExpanded: (expanded: boolean) => void;
  setEditMode: (enabled: boolean) => void;
  setActiveComponentId: (id: string | null) => void;
  setCurrentApp: (app: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  isLatticeExpanded: true,
  isEditMode: false,
  activeComponentId: null,
  currentApp: null,
  setLatticeExpanded: (expanded: boolean) => set({ isLatticeExpanded: expanded }),
  setEditMode: (enabled: boolean) => set({ isEditMode: enabled }),
  setActiveComponentId: (id: string | null) => set({ activeComponentId: id }),
  setCurrentApp: (app: string | null) => set({ currentApp: app }),
}));
