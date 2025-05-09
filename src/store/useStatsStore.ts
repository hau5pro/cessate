import { DailySession, SessionGap } from '@features/stats/stats';

import { Constants } from '@utils/constants';
import { create } from 'zustand';

type CachedStat<T> = {
  data: T[];
  lastFetched: number;
};

type RangeCache<T> = {
  selectedRange: number;
  cache: Record<number, CachedStat<T>>;
};

export type StatsState = {
  dailySessions: RangeCache<DailySession>;
  sessionGaps: RangeCache<SessionGap>;
  loading: boolean;
  hasInitialized: boolean;
};

export type StatsActions = {
  setDailySessionsRange: (range: number) => void;
  setSessionGapsRange: (range: number) => void;
  updateDailySessions: (range: number, data: DailySession[]) => void;
  updateSessionGaps: (range: number, data: SessionGap[]) => void;
  setLoading: (loading: boolean) => void;
  setHasInitialized: (initialized: boolean) => void;
  reset: () => void;
};

export const useStatsStore = create<StatsState & StatsActions>((set) => ({
  dailySessions: {
    selectedRange: Constants.DEFAULT_STATS_RANGE,
    cache: {},
  },
  sessionGaps: {
    selectedRange: Constants.DEFAULT_STATS_RANGE,
    cache: {},
  },
  loading: false,
  hasInitialized: false,

  setDailySessionsRange: (range) =>
    set((state) => ({
      dailySessions: { ...state.dailySessions, selectedRange: range },
    })),

  setSessionGapsRange: (range) =>
    set((state) => ({
      sessionGaps: { ...state.sessionGaps, selectedRange: range },
    })),

  updateDailySessions: (range, data) =>
    set((state) => ({
      dailySessions: {
        ...state.dailySessions,
        cache: {
          ...state.dailySessions.cache,
          [range]: { data, lastFetched: Date.now() },
        },
      },
    })),

  updateSessionGaps: (range, data) =>
    set((state) => ({
      sessionGaps: {
        ...state.sessionGaps,
        cache: {
          ...state.sessionGaps.cache,
          [range]: { data, lastFetched: Date.now() },
        },
      },
    })),

  setLoading: (loading) => set({ loading }),
  setHasInitialized: (hasInitialized) => set({ hasInitialized }),

  reset: () =>
    set({
      dailySessions: {
        selectedRange: Constants.DEFAULT_STATS_RANGE,
        cache: {},
      },
      sessionGaps: {
        selectedRange: Constants.DEFAULT_STATS_RANGE,
        cache: {},
      },
      loading: false,
      hasInitialized: false,
    }),
}));
