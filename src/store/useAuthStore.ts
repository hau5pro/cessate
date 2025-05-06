import { User } from 'firebase/auth';
import { create } from 'zustand';

export type AuthState = {
  user: User | null;
  loading: boolean;
};

export type AuthActions = {
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
};

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
  reset: () => set({ user: null, loading: false }),
}));
