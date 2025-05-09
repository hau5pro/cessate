import { DailySession, SessionGap } from '@features/stats/stats';

import { Constants } from '@utils/constants';
import { create } from 'zustand';
import dayjs from 'dayjs';

type CachedStat<T> = {
  data: T[];
  lastFetched: number;
};

type RangeCache<T, D> = {
  selectedRange: number;
  cache: Record<number, CachedStat<T>>;
} & D;

export type DailySessionsState = {
  todayCount: number;
};

export type SessionGapsState = {
  todayGapHours: number;
};

export type StatsState = {
  dailySessions: RangeCache<DailySession, DailySessionsState>;
  sessionGaps: RangeCache<SessionGap, SessionGapsState>;
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
    todayCount: 0,
  },
  sessionGaps: {
    selectedRange: Constants.DEFAULT_STATS_RANGE,
    cache: {},
    todayGapHours: 0,
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
    set((state) => {
      const today = dayjs().format('YYYY-MM-DD');
      const todayEntry = data.find((d) => d.day === today);
      return {
        dailySessions: {
          ...state.dailySessions,
          cache: {
            ...state.dailySessions.cache,
            [range]: {
              data,
              lastFetched: Date.now(),
            },
          },
          dailySessions: todayEntry?.count ?? 0,
        },
      };
    }),

  updateSessionGaps: (range, data) =>
    set((state) => {
      const today = dayjs().format('YYYY-MM-DD');
      const gap = data.find((d) => d.startedAt === today);
      return {
        sessionGaps: {
          ...state.sessionGaps,
          cache: {
            ...state.sessionGaps.cache,
            [range]: {
              data,
              lastFetched: Date.now(),
            },
          },
          sessionGaps: gap ? +(gap.seconds / 3600).toFixed(2) : 0,
        },
      };
    }),

  setLoading: (loading) => set({ loading }),
  setHasInitialized: (hasInitialized) => set({ hasInitialized }),

  reset: () =>
    set({
      dailySessions: {
        selectedRange: Constants.DEFAULT_STATS_RANGE,
        cache: {},
        todayCount: 0,
      },
      sessionGaps: {
        selectedRange: Constants.DEFAULT_STATS_RANGE,
        cache: {},
        todayGapHours: 0,
      },
      loading: false,
      hasInitialized: false,
    }),
}));
