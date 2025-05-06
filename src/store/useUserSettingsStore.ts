import { UserSettings } from '@features/userSettings/userSettings';
import { create } from 'zustand';

type UserSettingsState = {
  settings: UserSettings | null;
};

type UserSettingsActions = {
  setSettings: (settings: UserSettings) => void;
  clearSettings: () => void;
  reset: () => void;
  updateTargetDuration: (targetDuration: number) => void;
  updateName: (name: string) => void;
};

export const useUserSettingsStore = create<
  UserSettingsState & UserSettingsActions
>((set) => ({
  settings: null,
  setSettings: (settings) => set({ settings }),
  clearSettings: () => set({ settings: null }),
  reset: () => set({ settings: null }),
  updateTargetDuration: (targetDuration) =>
    set((state) => ({
      settings: state.settings ? { ...state.settings, targetDuration } : null,
    })),
  updateName: (name) =>
    set((state) => ({
      settings: state.settings ? { ...state.settings, name } : null,
    })),
}));
