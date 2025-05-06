import { Session } from '@features/sessions/session';
import { create } from 'zustand';

export type SessionState = {
  currentSession: Session | null;
  loading: boolean;
};

export type SessionActions = {
  setCurrentSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;
};

export const useSessionStore = create<SessionState & SessionActions>((set) => ({
  currentSession: null,
  loading: false,
  setCurrentSession: (session) => set({ currentSession: session }),
  setLoading: (loading) => set({ loading }),
  reset: () => set({ currentSession: null, loading: false }),
}));
