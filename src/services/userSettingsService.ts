import { Constants, DB } from '@utils/constants';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import { UserSettings } from '@features/userSettings/userSettings';
import { db } from '@lib/firebase/firebase';

export const getUserSettings = async (uid: string) => {
  const settingsRef = doc(db, DB.USER_SETTINGS, uid);
  const snapshot = await getDoc(settingsRef);

  if (!snapshot.exists()) {
    const defaultSettings: UserSettings = {
      targetDuration: Constants.DEFAULT_TARGET_DURATION,
    };

    await setDoc(settingsRef, defaultSettings);
  }

  return settingsRef;
};
