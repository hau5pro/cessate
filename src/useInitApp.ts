import {
  createUserSettings,
  getUserSettings,
} from '@services/userSettingsService';
import { getStatsMeta, updateStatsMeta } from '@services/statsService';

import { getCurrentSession } from '@services/sessionsService';
import { runSessionTransaction } from '@lib/firebase';
import { useAuthStore } from '@store/useAuthStore';
import { useEffect } from 'react';
import { useSessionStore } from '@store/useSessionStore';
import { useUserSettingsStore } from '@store/useUserSettingsStore';

export const useInitApp = () => {
  const user = useAuthStore((state) => state.user);

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

  useEffect(() => {
    if (!user) return;

    const loadSession = async () => {
      if (hasInitializedSession) return;

      setSessionLoading(true);
      try {
        const active = await getCurrentSession(user.uid);
        if (active) {
          setCurrentSession(active);
        }
      } catch (err) {
        console.error('Error loading session:', err);
      } finally {
        setSessionInitialized(true);
        setSessionLoading(false);
      }
    };

    const loadSettings = async () => {
      if (hasInitializedSettings) return;

      try {
        let userSettings = await getUserSettings(user.uid);
        if (!userSettings) {
          userSettings = await createUserSettings(user);
        }

        setSettings(userSettings);
      } catch (err) {
        console.error('Error loading user settings:', err);
      } finally {
        setSettingsInitialized(true);
      }
    };

    const loadStatsMeta = async () => {
      try {
        const meta = await getStatsMeta(user.uid);

        if (!meta) {
          await runSessionTransaction(async (batch) => {
            updateStatsMeta(batch, user.uid);
          });
        }
      } catch (err) {
        console.error('Error loading stats meta:', err);
      }
    };

    loadSession();
    loadSettings();
    loadStatsMeta();
  }, [
    user,
    hasInitializedSession,
    hasInitializedSettings,
    setCurrentSession,
    setSessionLoading,
    setSessionInitialized,
    setSettings,
    setSettingsInitialized,
  ]);
};
