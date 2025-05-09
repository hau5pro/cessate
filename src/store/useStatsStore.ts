import { DailySession, SessionGap } from '@features/stats/stats';

import { Constants } from '@utils/constants';
import { create } from 'zustand';
import dayjs from 'dayjs';

export type DailySessionsState = {
  selectedRange: number;
  data: DailySession[];
  todayCount: number;
  lastFetched: number;
};

export type SessionGapsState = {
  selectedRange: number;
  data: SessionGap[];
  todayGapSeconds: number;
  lastFetched: number;
};

export type StatsState = {
  dailySessions: DailySessionsState;
  sessionGaps: SessionGapsState;
  loading: boolean;
  hasInitialized: boolean;
  isDirty: boolean;
};

export type StatsActions = {
  setDailySessionsRange: (range: number) => void;
  setSessionGapsRange: (range: number) => void;
  updateDailySessions: (data: DailySession[]) => void;
  updateSessionGaps: (data: SessionGap[]) => void;
  setLoading: (loading: boolean) => void;
  setHasInitialized: (initialized: boolean) => void;
  setIsDirty: (isDirty: boolean) => void;
  reset: () => void;
};

export const useStatsStore = create<StatsState & StatsActions>((set) => ({
  dailySessions: {
    selectedRange: Constants.DEFAULT_STATS_RANGE,
    data: [],
    todayCount: 0,
    lastFetched: 0,
  },
  sessionGaps: {
    selectedRange: Constants.DEFAULT_STATS_RANGE,
    data: [],
    todayGapSeconds: 0,
    lastFetched: 0,
  },
  loading: false,
  hasInitialized: false,
  isDirty: false,

  setDailySessionsRange: (range) =>
    set((state) => ({
      dailySessions: { ...state.dailySessions, selectedRange: range },
    })),

  setSessionGapsRange: (range) =>
    set((state) => ({
      sessionGaps: { ...state.sessionGaps, selectedRange: range },
    })),

  updateDailySessions: (data) =>
    set(() => {
      const today = dayjs().format('YYYY-MM-DD');
      const todayCount = data.find((d) => d.day === today)?.count ?? 0;
      return {
        dailySessions: {
          selectedRange: Constants.DEFAULT_STATS_RANGE,
          data,
          todayCount,
          lastFetched: Date.now(),
        },
      };
    }),

  updateSessionGaps: (data) =>
    set(() => {
      const today = dayjs().format('YYYY-MM-DD');
      const todayGaps = data.filter((d) => d.startedAt === today);
      const total = todayGaps.reduce((sum, g) => sum + g.seconds, 0);
      const avgSeconds = todayGaps.length ? total / todayGaps.length : 0;
      return {
        sessionGaps: {
          selectedRange: Constants.DEFAULT_STATS_RANGE,
          data,
          todayGapSeconds: avgSeconds,
          lastFetched: Date.now(),
        },
      };
    }),

  setLoading: (loading) => set({ loading }),
  setHasInitialized: (initialized) => set({ hasInitialized: initialized }),
  setIsDirty: (isDirty) => set({ isDirty }),

  reset: () =>
    set({
      dailySessions: {
        selectedRange: Constants.DEFAULT_STATS_RANGE,
        data: [],
        todayCount: 0,
        lastFetched: 0,
      },
      sessionGaps: {
        selectedRange: Constants.DEFAULT_STATS_RANGE,
        data: [],
        todayGapSeconds: 0,
        lastFetched: 0,
      },
      loading: false,
      hasInitialized: false,
      isDirty: false,
    }),
}));
