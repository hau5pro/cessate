import { useAuthStore } from './useAuthStore';
import { useSessionStore } from './useSessionStore';
import { useUserSettingsStore } from './useUserSettingsStore';

export const resetAllStores = () => {
  useAuthStore.getState().reset();
  useUserSettingsStore.getState().reset();
  useSessionStore.getState().reset();
};
