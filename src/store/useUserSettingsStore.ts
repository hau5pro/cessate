import { UserSettings } from '@features/userSettings/userSettings';
import { create } from 'zustand';

interface UserSettingsStore {
  settings: UserSettings | null;
  setSettings: (settings: UserSettings) => void;
  clearSettings: () => void;
  reset: () => void;
}

export const useUserSettingsStore = create<UserSettingsStore>((set) => ({
  settings: null,
  setSettings: (settings) => set({ settings }),
  clearSettings: () => set({ settings: null }),
  reset: () => set({ settings: null }),
}));
