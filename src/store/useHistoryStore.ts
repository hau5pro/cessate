import { QueryDocumentSnapshot } from 'firebase/firestore';
import { Session } from '@features/sessions/session';
import { create } from 'zustand';

export type HistoryState = {
  sessions: Session[];
  hasMore: boolean;
  lastDoc: QueryDocumentSnapshot | null;
  loading: boolean;
  hasInitialized: boolean;
};

export type HistoryActions = {
  appendSessions: (
    newSessions: Session[],
    lastDoc: QueryDocumentSnapshot | null,
    hasMore: boolean
  ) => void;
  setLoading: (loading: boolean) => void;
  setHasInitialized: (hasInitialized: boolean) => void;
  reset: () => void;
};

export const useHistoryStore = create<HistoryState & HistoryActions>((set) => ({
  sessions: [],
  hasMore: false,
  lastDoc: null,
  loading: false,
  hasInitialized: false,

  appendSessions: (newSessions, lastDoc, hasMore) =>
    set((state) => ({
      sessions: [...state.sessions, ...newSessions],
      lastDoc,
      hasMore,
    })),

  setLoading: (loading) => set({ loading }),
  setHasInitialized: (hasInitialized) => set({ hasInitialized }),

  reset: () =>
    set({
      sessions: [],
      hasMore: false,
      lastDoc: null,
      loading: false,
      hasInitialized: false,
    }),
}));
