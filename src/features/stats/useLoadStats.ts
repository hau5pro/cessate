import { getDailySessions, getSessionGaps } from '@services/statsService';
import { useCallback, useEffect } from 'react';

import { Constants } from '@utils/constants';
import { useAuthStore } from '@store/useAuthStore';
import { useStatsStore } from '@store/useStatsStore';

export function useLoadStats() {
  const user = useAuthStore((s) => s.user);
  const {
    dailySessions,
    sessionGaps,
    setLoading,
    updateDailySessions,
    updateSessionGaps,
  } = useStatsStore();

  const load = useCallback(
    async (force = false) => {
      if (!user?.uid) return;

      const isStale = (lastFetched?: number) =>
        !lastFetched || Date.now() - lastFetched > Constants.ONE_DAY_IN_MS;

      const needsDaily = force || isStale(dailySessions.lastFetched);
      const needsGaps = force || isStale(sessionGaps.lastFetched);

      if (!needsDaily && !needsGaps) return;

      const promises: Promise<void>[] = [];
      setLoading(true);

      if (needsDaily) {
        promises.push(
          getDailySessions(user.uid, Constants.FETCH_DAYS).then(
            updateDailySessions
          )
        );
      }

      if (needsGaps) {
        promises.push(
          getSessionGaps(user.uid, Constants.FETCH_DAYS).then(updateSessionGaps)
        );
      }

      await Promise.all(promises);
      setLoading(false);
    },
    [
      user?.uid,
      dailySessions.lastFetched,
      sessionGaps.lastFetched,
      updateDailySessions,
      updateSessionGaps,
      setLoading,
    ]
  );

  useEffect(() => {
    load();
  }, [load]);

  return { refresh: () => load(true) };
}
