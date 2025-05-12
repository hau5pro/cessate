import { auth, googleProvider } from '@lib/firebase';
import { onAuthStateChanged, signInWithPopup } from 'firebase/auth';

import { resetAllStores } from '@store/resetAllStores';
import { useAuthStore } from '@store/useAuthStore';

export const initAuth = (): (() => void) => {
  useAuthStore.getState().setLoading(true);

  return onAuthStateChanged(
    auth,
    (user) => {
      useAuthStore.getState().setUser(user);
      useAuthStore.getState().setLoading(false);
    },
    (error) => {
      console.error('Error during authentication state change:', error);
      useAuthStore.getState().setLoading(false);
    }
  );
};

export const signInWithGoogle = async (): Promise<void> => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    useAuthStore.getState().setUser(user);
    useAuthStore.getState().setLoading(false);
  } catch (error) {
    console.error('Error signing in with Google:', error);
  }
};

export const signOut = async (): Promise<void> => {
  try {
    await auth.signOut();
    resetAllStores();
  } catch (error) {
    console.error('Error signing out:', error);
  }
};
