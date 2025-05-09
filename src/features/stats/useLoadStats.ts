import { getDailySessions, getSessionGaps } from '@services/statsService';

import { Constants } from '@utils/constants';
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
    isDirty,
    setIsDirty,
  } = useStatsStore();

  useEffect(() => {
    if (!user?.uid) return;

    const isStale = (lastFetched?: number) =>
      !lastFetched || Date.now() - lastFetched > Constants.ONE_DAY_IN_MS;

    const needsDaily = force || isStale(dailySessions.lastFetched) || isDirty;
    const needsGaps = force || isStale(sessionGaps.lastFetched) || isDirty;

    const promises: Promise<void>[] = [];

    setLoading(true);

    if (needsDaily) {
      promises.push(
        getDailySessions(user.uid, Constants.FETCH_DAYS).then((data) => {
          updateDailySessions(data);
        })
      );
    }

    if (needsGaps) {
      promises.push(
        getSessionGaps(user.uid, Constants.FETCH_DAYS).then((data) => {
          updateSessionGaps(data);
        })
      );
    }

    Promise.all(promises).finally(() => {
      setLoading(false);
      setIsDirty(false);
    });
  }, [
    user?.uid,
    force,
    isDirty,
    dailySessions.lastFetched,
    sessionGaps.lastFetched,
    updateDailySessions,
    updateSessionGaps,
    setLoading,
    setIsDirty,
  ]);
}
