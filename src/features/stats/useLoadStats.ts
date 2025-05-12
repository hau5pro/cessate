import {
  getDailySessions,
  getSessionGaps,
  getStatsMeta,
} from '@services/statsService';
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

      setLoading(true);

      try {
        const meta = await getStatsMeta(user.uid);
        const updatedAt = meta.lastUpdated?.toMillis() ?? 0;
        const latestFetch = Math.max(
          dailySessions.lastFetched ?? 0,
          sessionGaps.lastFetched ?? 0
        );

        const shouldRefetch = force || updatedAt > latestFetch;
        if (!shouldRefetch) return;

        const [daily, gaps] = await Promise.all([
          getDailySessions(user.uid, Constants.FETCH_DAYS),
          getSessionGaps(user.uid, Constants.FETCH_DAYS),
        ]);

        updateDailySessions(daily);
        updateSessionGaps(gaps);
      } finally {
        setLoading(false);
      }
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
