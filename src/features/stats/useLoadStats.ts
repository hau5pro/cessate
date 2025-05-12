import {
  getDailySessions,
  getSessionGaps,
  getStatsMeta,
} from '@services/statsService';
import { useCallback, useEffect, useRef } from 'react';

import { Constants } from '@utils/constants';
import { useAuthStore } from '@store/useAuthStore';
import { useStatsStore } from '@store/useStatsStore';

export function useLoadStats() {
  const hasLoadedRef = useRef(false);
  const uid = useAuthStore((s) => s.user?.uid);
  const dailyLastFetched = useStatsStore((s) => s.dailySessions.lastFetched);
  const gapsLastFetched = useStatsStore((s) => s.sessionGaps.lastFetched);
  const updateDailySessions = useStatsStore((s) => s.updateDailySessions);
  const updateSessionGaps = useStatsStore((s) => s.updateSessionGaps);
  const setLoading = useStatsStore((s) => s.setLoading);

  const load = useCallback(
    async (force = false) => {
      if (!uid) return;

      setLoading(true);

      try {
        const meta = await getStatsMeta(uid);
        const updatedAt = meta?.lastUpdated?.toMillis() ?? 0;
        const latestFetch = Math.max(
          dailyLastFetched ?? 0,
          gapsLastFetched ?? 0
        );

        const shouldRefetch =
          force || updatedAt === 0 || updatedAt > latestFetch;

        if (!shouldRefetch) return;

        const [daily, gaps] = await Promise.all([
          getDailySessions(uid, Constants.FETCH_DAYS),
          getSessionGaps(uid, Constants.FETCH_DAYS),
        ]);

        updateDailySessions(daily);
        updateSessionGaps(gaps);
      } finally {
        setLoading(false);
      }
    },
    [uid]
  );

  useEffect(() => {
    if (hasLoadedRef.current) return;

    hasLoadedRef.current = true;
    load();
  }, [load]);

  return { refresh: () => load(true) };
}
