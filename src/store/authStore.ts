import { create } from 'zustand';
import type { User } from '../types';

interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  setCurrentUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: null,
  isAuthenticated: false as boolean,
  setCurrentUser: (user: User | null) => {
    set({ 
      currentUser: user, 
      isAuthenticated: !!user 
    });
  },
  logout: () => {
    set({ 
      currentUser: null, 
      isAuthenticated: false 
    });
  },
}));