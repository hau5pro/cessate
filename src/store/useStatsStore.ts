import { DailySession, SessionGapSummary } from '@features/stats/stats';

import { Constants } from '@utils/constants';
import { create } from 'zustand';
import { getLocalDayKey } from '@lib/dayjs';

export type DailySessionsState = {
  selectedRange: number;
  data: DailySession[];
  todayCount: number;
  lastFetched: number;
};

export type SessionGapsState = {
  selectedRange: number;
  data: SessionGapSummary[];
  todayGapSeconds: number;
  lastFetched: number;
};

export type StatsState = {
  dailySessions: DailySessionsState;
  sessionGaps: SessionGapsState;
  loading: boolean;
  hasInitialized: boolean;
};

export type StatsActions = {
  setDailySessionsRange: (range: number) => void;
  setSessionGapsRange: (range: number) => void;
  updateDailySessions: (data: DailySession[]) => void;
  updateSessionGaps: (data: SessionGapSummary[]) => void;
  updateTodayDailySession: (updated: DailySession) => void;
  updateTodaySessionGapSummary: (updated: SessionGapSummary) => void;
  setLoading: (loading: boolean) => void;
  setHasInitialized: (initialized: boolean) => void;
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
      const today = getLocalDayKey();
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
      const today = getLocalDayKey();
      const todaySummary = data.find((d) => d.day === today);
      const avgSeconds = todaySummary?.avgSeconds ?? 0;

      return {
        sessionGaps: {
          selectedRange: Constants.DEFAULT_STATS_RANGE,
          data,
          todayGapSeconds: avgSeconds,
          lastFetched: Date.now(),
        },
      };
    }),

  updateTodayDailySession: (updated) =>
    set((state) => {
      const data = [
        ...state.dailySessions.data.filter((d) => d.day !== updated.day),
        updated,
      ].sort((a, b) => a.day.localeCompare(b.day));
      const todayCount =
        updated.day === getLocalDayKey()
          ? updated.count
          : state.dailySessions.todayCount;

      return {
        dailySessions: {
          ...state.dailySessions,
          data,
          todayCount,
        },
      };
    }),

  updateTodaySessionGapSummary: (updated) =>
    set((state) => {
      const data = [
        ...state.sessionGaps.data.filter((d) => d.day !== updated.day),
        updated,
      ].sort((a, b) => a.day.localeCompare(b.day));
      const avgSeconds =
        updated.day === getLocalDayKey()
          ? (updated.avgSeconds ?? 0)
          : state.sessionGaps.todayGapSeconds;

      return {
        sessionGaps: {
          ...state.sessionGaps,
          data,
          todayGapSeconds: avgSeconds,
        },
      };
    }),

  setLoading: (loading) => set({ loading }),
  setHasInitialized: (initialized) => set({ hasInitialized: initialized }),

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
    }),
}));
