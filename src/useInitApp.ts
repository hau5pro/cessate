import {
  createUserSettings,
  getUserSettings,
} from '@services/userSettingsService';
import { getCurrentSession, getPastSessions } from '@services/sessionsService';
import {
  getDailySessions,
  getSessionGaps,
  getStatsMeta,
  updateStatsMeta,
} from '@services/statsService';

import { Constants } from '@utils/constants';
import { runSessionTransaction } from '@lib/firebase';
import { useAuthStore } from '@store/useAuthStore';
import { useEffect } from 'react';
import { useHistoryStore } from '@store/useHistoryStore';
import { useSessionStore } from '@store/useSessionStore';
import { useStatsStore } from '@store/useStatsStore';
import { useUserSettingsStore } from '@store/useUserSettingsStore';

export const useInitApp = () => {
  const user = useAuthStore((s) => s.user);

  const {
    hasInitialized: hasInitializedSession,
    setCurrentSession,
    setLoading: setSessionLoading,
    setHasInitialized: setSessionInitialized,
  } = useSessionStore();

  const {
    hasInitialized: hasInitializedSettings,
    setSettings,
    setHasInitialized: setSettingsInitialized,
  } = useUserSettingsStore();

  const {
    hasInitialized: hasInitializedStats,
    updateDailySessions,
    updateSessionGaps,
    setLoading: setStatsLoading,
    setHasInitialized: setStatsInitialized,
  } = useStatsStore();

  const {
    hasInitialized: hasInitializedHistory,
    appendSessions,
    setLoading: setHistoryLoading,
    setHasInitialized: setHistoryInitialized,
  } = useHistoryStore();

  const loadSession = async (uid: string) => {
    if (hasInitializedSession) return;
    setSessionLoading(true);
    try {
      const active = await getCurrentSession(uid);
      if (active) setCurrentSession(active);
    } catch (err) {
      console.error('Error loading session:', err);
    } finally {
      setSessionInitialized(true);
      setSessionLoading(false);
    }
  };

  const loadSettings = async (uid: string) => {
    if (hasInitializedSettings) return;
    try {
      let settings = await getUserSettings(uid);
      if (!settings) {
        settings = await createUserSettings(user!);
      }
      setSettings(settings);
    } catch (err) {
      console.error('Error loading settings:', err);
    } finally {
      setSettingsInitialized(true);
    }
  };

  const loadStats = async (uid: string) => {
    if (hasInitializedStats) return;

    setStatsLoading(true);
    try {
      let meta = await getStatsMeta(uid);
      if (!meta) {
        await runSessionTransaction(async (batch) => {
          meta = updateStatsMeta(batch, uid);
        });
      }

      const [daily, gaps] = await Promise.all([
        getDailySessions(uid, Constants.FETCH_DAYS),
        getSessionGaps(uid, Constants.FETCH_DAYS),
      ]);

      updateDailySessions(daily);
      updateSessionGaps(gaps);
    } catch (err) {
      console.error('Error loading stats:', err);
    } finally {
      setStatsInitialized(true);
      setStatsLoading(false);
    }
  };

  const loadInitialHistory = async (uid: string) => {
    if (hasInitializedHistory) return;

    setHistoryLoading(true);
    try {
      const { sessions, lastVisible, hasMore } = await getPastSessions(
        uid,
        Constants.PAGE_SIZE
      );
      appendSessions(sessions, lastVisible, hasMore);
    } catch (err) {
      console.error('Error loading history:', err);
    } finally {
      setHistoryLoading(false);
      setHistoryInitialized(true);
    }
  };

  const loadCoreAppData = async (uid: string) => {
    await Promise.all([loadSession(uid), loadSettings(uid)]);
    await Promise.all([loadStats(uid), loadInitialHistory(uid)]);
  };

  useEffect(() => {
    if (!user?.uid) return;
    loadCoreAppData(user.uid);
  }, [user?.uid]);
};
