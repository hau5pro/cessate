import { useAuthStore } from './useAuthStore';
import { useHistoryStore } from './useHistoryStore';
import { useSessionStore } from './useSessionStore';
import { useStatsStore } from './useStatsStore';
import { useUserSettingsStore } from './useUserSettingsStore';

export const resetAllStores = () => {
  useAuthStore.getState().reset();
  useUserSettingsStore.getState().reset();
  useSessionStore.getState().reset();
  useStatsStore.getState().reset();
  useHistoryStore.getState().reset();
};
