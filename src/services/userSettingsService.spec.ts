import { Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  createUserSettings,
  getUserSettings,
  saveUserSettings,
} from './userSettingsService';
import { getDoc, setDoc } from 'firebase/firestore';

import { Constants } from '@utils/constants';

vi.mock('@lib/firebase', () => ({ db: {} }));

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(() => ({ path: 'mock-path' })),
  getDoc: vi.fn(),
  setDoc: vi.fn(),
}));

vi.mock('@store/useUserSettingsStore', () => ({
  useUserSettingsStore: {
    getState: vi.fn(() => ({ settings: { targetDuration: 4200 } })),
  },
}));

vi.mock('@store/useAuthStore', () => ({
  useAuthStore: {
    getState: vi.fn(() => ({ user: { uid: 'user123' } })),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('userSettingsService', () => {
  describe('getUserSettings', () => {
    it('returns null if doc does not exist', async () => {
      (getDoc as Mock).mockResolvedValueOnce({ exists: () => false });

      const result = await getUserSettings('user123');
      expect(result).toBeNull();
    });

    it('returns user settings if doc exists', async () => {
      const mockData = { targetDuration: 3600 };
      (getDoc as Mock).mockResolvedValueOnce({
        exists: () => true,
        data: () => mockData,
      });

      const result = await getUserSettings('user123');
      expect(result).toEqual(mockData);
    });
  });

  describe('createUserSettings', () => {
    it('creates default settings based on user and saves them', async () => {
      const user = {
        uid: 'user123',
        displayName: 'John Smith',
        email: 'john@example.com',
      };

      const expected = {
        name: 'John',
        email: 'john@example.com',
        targetDuration: Constants.DEFAULT_TARGET_DURATION,
      };

      const result = await createUserSettings(user as any);

      expect(setDoc).toHaveBeenCalledWith(expect.anything(), expected);
      expect(result).toEqual(expected);
    });
  });

  describe('saveUserSettings', () => {
    it('throws error if user is not authenticated', async () => {
      const useAuthStore = await import('@store/useAuthStore');
      (useAuthStore.useAuthStore.getState as Mock).mockReturnValueOnce({
        user: null,
      });

      await expect(saveUserSettings()).rejects.toThrow(
        'User not authenticated'
      );
    });

    it('warns and does nothing if settings are missing', async () => {
      const useUserSettingsStore = await import('@store/useUserSettingsStore');
      (
        useUserSettingsStore.useUserSettingsStore.getState as Mock
      ).mockReturnValueOnce({ settings: null });

      const consoleWarn = vi
        .spyOn(console, 'warn')
        .mockImplementation(() => {});

      await saveUserSettings();

      expect(setDoc).not.toHaveBeenCalled();
      expect(consoleWarn).toHaveBeenCalledWith(
        'No user settings found in store to save.'
      );

      consoleWarn.mockRestore();
    });

    it('merges and saves user settings when both exist', async () => {
      await saveUserSettings();

      expect(setDoc).toHaveBeenCalledWith(
        expect.anything(),
        { targetDuration: 4200 },
        { merge: true }
      );
    });
  });
});
