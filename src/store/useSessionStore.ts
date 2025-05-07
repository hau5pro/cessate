import { Session } from '@features/sessions/session';
import { create } from 'zustand';

export type SessionState = {
  currentSession: Session | null;
  loading: boolean;
  hasInitialized: boolean;
};

export type SessionActions = {
  setCurrentSession: (session: Session | null) => void;
  setLoading: (loading: boolean) => void;
  setHasInitialized: (hasInitialized: boolean) => void;
  reset: () => void;
};

export const useSessionStore = create<SessionState & SessionActions>((set) => ({
  currentSession: null,
  loading: false,
  hasInitialized: false,
  setCurrentSession: (session) => set({ currentSession: session }),
  setLoading: (loading) => set({ loading }),
  setHasInitialized: (hasInitialized) => set({ hasInitialized }),
  reset: () =>
    set({ currentSession: null, loading: false, hasInitialized: false }),
}));
