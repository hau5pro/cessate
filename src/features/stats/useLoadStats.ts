import { getDailySessions, getSessionGaps } from '@services/statsService';

import { Constants } from '@utils/constants';
import dayjs from 'dayjs';
import { useAuthStore } from '@store/useAuthStore';
import { useEffect } from 'react';
import { useStatsStore } from '@store/useStatsStore';

export function useLoadStats(force = false) {
  const user = useAuthStore((s) => s.user);
  const {
    dailySessions,
    sessionGaps,
    setLoading,
    updateDailySessions,
    updateSessionGaps,
  } = useStatsStore();

  useEffect(() => {
    if (!user?.uid) return;

    const { selectedRange: dailyRange, cache: dailyCache } = dailySessions;
    const { selectedRange: gapRange, cache: gapCache } = sessionGaps;

    const isStale = (lastFetched?: number) =>
      !lastFetched || Date.now() - lastFetched > Constants.ONE_DAY_IN_MS;

    const isDailyStale = force || isStale(dailyCache[dailyRange]?.lastFetched);
    const isGapStale = force || isStale(gapCache[gapRange]?.lastFetched);

    const promises: Promise<void>[] = [];
    setLoading(true);

    const today = dayjs().utc().format('YYYY-MM-DD');

    if (isDailyStale) {
      promises.push(
        getDailySessions(user.uid, dailyRange).then((data) => {
          const todayEntry = data.find((d) => d.day === today);
          updateDailySessions(dailyRange, data);

          // Directly update derived value
          useStatsStore.setState((state) => ({
            dailySessions: {
              ...state.dailySessions,
              todayCount: todayEntry?.count ?? 0,
            },
          }));
        })
      );
    }

    if (isGapStale) {
      promises.push(
        getSessionGaps(user.uid, gapRange).then((data) => {
          const todayGap = data.find((g) => g.startedAt === today);
          updateSessionGaps(gapRange, data);

          useStatsStore.setState((state) => ({
            sessionGaps: {
              ...state.sessionGaps,
              todayGapHours: todayGap
                ? +(todayGap.seconds / 3600).toFixed(2)
                : 0,
            },
          }));
        })
      );
    }

    Promise.all(promises).finally(() => setLoading(false));
  }, [
    user?.uid,
    dailySessions.selectedRange,
    sessionGaps.selectedRange,
    dailySessions.cache,
    sessionGaps.cache,
    setLoading,
    updateDailySessions,
    updateSessionGaps,
    force,
    dailySessions,
    sessionGaps,
  ]);
}
