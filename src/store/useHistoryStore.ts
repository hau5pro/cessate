import { Constants } from '@utils/constants';
import { QueryDocumentSnapshot } from 'firebase/firestore';
import { Session } from '@features/sessions/session';
import { create } from 'zustand';
import { getPastSessions } from '@services/sessionsService';

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
  updateSession: (updated: Session) => void;
  addSession: (session: Session) => void;
  setLoading: (loading: boolean) => void;
  setHasInitialized: (hasInitialized: boolean) => void;
  reset: () => void;
  loadMore: (uid: string) => Promise<void>;
};

export const useHistoryStore = create<HistoryState & HistoryActions>(
  (set, get) => ({
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

    updateSession: (updated: Session) =>
      set((state) => ({
        sessions: state.sessions.map((s) =>
          s.id === updated.id ? { ...s, ...updated } : s
        ),
      })),

    addSession: (newSession: Session) =>
      set((state) => ({
        sessions: [newSession, ...state.sessions],
      })),

    setLoading: (loading) => set({ loading }),
    setHasInitialized: (hasInitialized) => set({ hasInitialized }),

    loadMore: async (uid) => {
      const {
        loading,
        hasMore,
        hasInitialized,
        lastDoc,
        appendSessions,
        setLoading,
        setHasInitialized,
      } = get();

      if (loading || !uid || (hasInitialized && !hasMore)) return;

      try {
        setLoading(true);
        const {
          sessions,
          lastVisible,
          hasMore: more,
        } = await getPastSessions(uid, Constants.PAGE_SIZE, lastDoc);
        appendSessions(sessions, lastVisible, more);
        setHasInitialized(true);
      } catch (err) {
        console.error('Error loading sessions:', err);
      } finally {
        setLoading(false);
      }
    },

    reset: () =>
      set({
        sessions: [],
        hasMore: false,
        lastDoc: null,
        loading: false,
        hasInitialized: false,
      }),
  })
);
