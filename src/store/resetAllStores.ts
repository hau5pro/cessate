import { useAuthStore } from './useAuthStore';
import { useUserSettingsStore } from './useUserSettingsStore';

export const resetAllStores = () => {
  useAuthStore.getState().reset();
  useUserSettingsStore.getState().reset();
};
