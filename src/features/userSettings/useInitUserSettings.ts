import {
  createUserSettings,
  getUserSettings,
} from '@services/userSettingsService';

import { useAuthStore } from '@store/useAuthStore';
import { useEffect } from 'react';
import { useUserSettingsStore } from '@store/useUserSettingsStore';

export function useInitUserSettings() {
  const user = useAuthStore((state) => state.user);
  const setSettings = useUserSettingsStore((state) => state.setSettings);

  useEffect(() => {
    if (!user?.uid) return;

    const init = async () => {
      try {
        let settings = await getUserSettings(user.uid);

        if (!settings) {
          settings = await createUserSettings(user);
        }

        setSettings(settings);
      } catch (error) {
        console.error('Error initializing user settings:', error);
      }
    };
    init();
  }, [user?.uid, user, setSettings]);
}
