import { getUserSettings } from '@services/userSettingsService';
import { useAuthStore } from '@store/useAuthStore';
import { useEffect } from 'react';

export function useInitUserSettings() {
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    if (!user?.uid) return;

    getUserSettings(user.uid).catch((error) => {
      console.error('Error initializing user settings:', error);
    });
  }, [user?.uid]);
}
