import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';

import RelapseButton from './RelapseButton';
import { Timestamp } from 'firebase/firestore';
import { logRelapseAndStartSession } from '@services/sessionsService';
import { runSessionTransaction } from '@lib/firebase';
import { useSessionStore } from '@store/useSessionStore';

const authState = { user: { uid: 'user123' } };
vi.mock('@lib/firebase', () => ({
  runSessionTransaction: vi.fn(),
}));
vi.mock('@lib/dayjs', () => ({
  getLocalDayKey: () => '2024-01-01',
}));
vi.mock('@services/sessionsService', () => ({
  logRelapseAndStartSession: vi.fn(),
}));
vi.mock('@store/useAuthStore', () => ({
  useAuthStore: vi.fn(() => authState),
}));
vi.mock('@store/useSessionStore', () => {
  const store = {
    currentSession: {
      id: 'sess123',
      createdAt: { seconds: 1000 },
      targetDuration: 1800,
    },
    loading: false,
    setLoading: vi.fn(),
    setCurrentSession: vi.fn(),
  };
  return {
    useSessionStore: vi.fn((selector) => selector(store)),
  };
});
vi.mock('@store/useUserSettingsStore', () => ({
  useUserSettingsStore: vi.fn((sel) =>
    sel({ settings: { targetDuration: 1800 } })
  ),
}));
vi.mock('@store/useStatsStore', () => {
  const todayKey = '2024-01-01';
  const store = {
    sessionGaps: { data: [{ day: todayKey, gaps: [], avgSeconds: 0 }] },
    updateTodaySessionGapSummary: vi.fn(),
    dailySessions: { data: [{ day: todayKey, count: 1 }] },
    updateTodayDailySession: vi.fn(),
  };
  return {
    useStatsStore: vi.fn((selector) => selector(store)),
  };
});
vi.mock('@store/useHistoryStore', () => {
  const store = {
    updateSession: vi.fn(),
    addSession: vi.fn(),
  };
  return {
    useHistoryStore: vi.fn((sel) => sel(store)),
  };
});

const setup = () => render(<RelapseButton />);

describe('RelapseButton', () => {
  beforeEach(() => {
    authState.user = { uid: 'user123' };
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('disables button and shows loader when loading', () => {
    vi.mocked(useSessionStore).mockImplementation((sel) =>
      sel({
        currentSession: {
          id: 'sess123',
          createdAt: Timestamp.fromDate(new Date('2024-01-01T00:00:00Z')),
          endedAt: null,
          targetDuration: 0,
          percentage: null,
          duration: null,
          color: null,
        },
        loading: true,
        setLoading: vi.fn(),
        setCurrentSession: vi.fn(),
        hasInitialized: false,
        setHasInitialized: vi.fn(),
        reset: vi.fn(),
      })
    );

    setup();
    const button = screen.getByTestId('relapse-button');
    expect(button).toBeDisabled();
  });

  it('triggers session relapse flow', async () => {
    vi.mocked(logRelapseAndStartSession).mockReturnValue({
      session: {
        id: 'new123',
        createdAt: Timestamp.now(),
        endedAt: null,
        targetDuration: 0,
        percentage: null,
        duration: null,
        color: null,
      },
      previous: {
        id: 'sess123',
        endedAt: Timestamp.now(),
        duration: 30,
        createdAt: Timestamp.now(),
        targetDuration: 0,
        percentage: null,
        color: null,
      },
      gapSummary: {
        day: '2024-01-01',
        avgSeconds: 60,
        gaps: [],
        updatedAt: null,
      },
    });

    vi.mocked(runSessionTransaction).mockImplementation(async (fn) => {
      return fn({} as any);
    });

    setup();
    const button = screen.getByTestId('relapse-button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(logRelapseAndStartSession).toHaveBeenCalled();
    });

    expect(button).not.toBeDisabled();
  });
});
