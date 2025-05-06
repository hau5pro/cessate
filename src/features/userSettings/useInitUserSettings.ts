import { getUserSettings } from '@services/userSettingsService';
import { useAuthStore } from '@store/useAuthStore';
import { useEffect } from 'react';
import { useUserSettingsStore } from '@store/useUserSettingsStore';

export function useInitUserSettings() {
  const user = useAuthStore((state) => state.user);
  const setSettings = useUserSettingsStore((state) => state.setSettings);

  useEffect(() => {
    if (!user?.uid) return;

    getUserSettings(user.uid)
      .then((settings) => {
        setSettings(settings);
      })
      .catch((error) => {
        console.error('Error initializing user settings:', error);
      });
  }, [user?.uid]);
}
