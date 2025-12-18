import { create } from 'zustand';
import type { Location, Device } from '../types';

interface AppState {
  activeLocation: Location | null;
  currentDevice: Device | null;
  setActiveLocation: (location: Location | null) => void;
  setCurrentDevice: (device: Device | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  activeLocation: null,
  currentDevice: null,
  setActiveLocation: (location) => set({ activeLocation: location }),
  setCurrentDevice: (device) => set({ currentDevice: device }),
}));