import { create } from 'zustand';
import type { User, UserRole } from '../types';

const delay = (ms: number) => new Promise(r => setTimeout(r, ms));

const mockUser: User = {
  id: 'usr_1a2b3c4d',
  name: 'Alex Johnson',
  email: 'alex@cloudvault.io',
  role: 'admin' as UserRole,
  avatar: undefined,
  createdAt: '2025-06-15T10:30:00Z',
  lastLogin: '2026-03-31T14:00:00Z',
  storageUsed: 3_456_789_012,
  storageLimit: 10_737_418_240,
};

interface AuthStore {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  login: async (email: string, _password: string) => {
    set({ isLoading: true, error: null });
    await delay(1200);
    if (!email.includes('@')) {
      set({ isLoading: false, error: 'Invalid email format' });
      return;
    }
    set({
      user: { ...mockUser, email },
      token: 'jwt_mock_token_' + Date.now(),
      isAuthenticated: true,
      isLoading: false,
    });
  },
  signup: async (name: string, email: string, _password: string) => {
    set({ isLoading: true, error: null });
    await delay(1500);
    set({
      user: { ...mockUser, name, email },
      token: 'jwt_mock_token_' + Date.now(),
      isAuthenticated: true,
      isLoading: false,
    });
  },
  logout: () => {
    set({ user: null, token: null, isAuthenticated: false });
  },
  clearError: () => set({ error: null }),
}));
