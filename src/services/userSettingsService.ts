import { Constants, DB } from '@utils/constants';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import { UserSettings } from '@features/userSettings/userSettings';
import { db } from '@lib/firebase/firebase';
import { useAuthStore } from '@store/useAuthStore';
import { useUserSettingsStore } from '@store/useUserSettingsStore';

export const getUserSettings = async (uid: string) => {
  const settingsRef = doc(db, DB.USER_SETTINGS, uid);
  const snapshot = await getDoc(settingsRef);

  if (!snapshot.exists()) {
    const defaultSettings: UserSettings = {
      targetDuration: Constants.DEFAULT_TARGET_DURATION,
    };

    await setDoc(settingsRef, defaultSettings);
  }

  return snapshot.data() as UserSettings;
};

export const saveUserSettings = async () => {
  const settings = useUserSettingsStore.getState().settings;
  const user = useAuthStore.getState().user;

  if (!user?.uid) {
    throw new Error('User not authenticated. Cannot save settings.');
  }

  if (!settings) {
    console.warn('No user settings found in store to save.');
    return;
  }

  const settingsRef = doc(db, DB.USER_SETTINGS, user.uid);
  await setDoc(settingsRef, settings, { merge: true });
};
