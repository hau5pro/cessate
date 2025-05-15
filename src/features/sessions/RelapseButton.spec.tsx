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
import { useStatsStore } from '@store/useStatsStore';

const authState = { user: { uid: 'user123' } };
vi.mock('@lib/firebase', () => ({
  runSessionTransaction: vi.fn(),
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
  const mockStatsStore = {
    sessionGaps: { data: [] },
    dailySessions: { data: [] },
    updateTodaySessionGapSummary: vi.fn(),
    updateTodayDailySession: vi.fn(),
  };
  const useStatsStore = vi.fn((selector: any) =>
    selector(mockStatsStore)
  ) as any;
  useStatsStore.getState = () => mockStatsStore;

  return { useStatsStore };
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

  it('uses session.createdAt to determine correct dayKey for stats', async () => {
    const createdAtDate = new Date('2024-01-01T05:00:00Z'); // EST = Dec 31 12am
    const createdAt = Timestamp.fromDate(createdAtDate);

    const dayKey = '2024-01-01';
    useStatsStore.getState().sessionGaps.data = [
      {
        day: dayKey,
        gaps: [
          {
            seconds: 45,
            startedAt: createdAt,
            createdAt: Timestamp.now(),
          },
        ],
        avgSeconds: 45,
        updatedAt: null,
      },
    ];

    useStatsStore.getState().dailySessions.data = [
      {
        day: dayKey,
        count: 2,
        updatedAt: Timestamp.now(),
      },
    ];

    // Patch the session store to reflect this session
    vi.mocked(useSessionStore).mockImplementation((sel) =>
      sel({
        currentSession: {
          id: 'sess123',
          createdAt,
          targetDuration: 1800,
          endedAt: null,
          percentage: null,
          duration: null,
          color: null,
        },
        loading: false,
        setLoading: vi.fn(),
        setCurrentSession: vi.fn(),
        hasInitialized: false,
        setHasInitialized: vi.fn(),
        reset: vi.fn(),
      })
    );

    // Track which gap summary was passed in
    let passedSummary: any = null;
    vi.mocked(logRelapseAndStartSession).mockImplementation(
      (_uid, _session, _duration, _batch, summary) => {
        passedSummary = summary;
        return {
          session: {
            id: 'new123',
            createdAt: Timestamp.now(),
            targetDuration: 1800,
            endedAt: null,
            percentage: null,
            duration: null,
            color: null,
          },
          previous: {
            id: 'sess123',
            createdAt,
            endedAt: Timestamp.now(),
            targetDuration: 1800,
            percentage: null,
            duration: null,
            color: null,
          },
          gapSummary: {
            day: '2024-01-01',
            avgSeconds: 60,
            gaps: [],
            updatedAt: null,
          },
        };
      }
    );

    vi.mocked(runSessionTransaction).mockImplementation(async (fn) => {
      return fn({} as any);
    });

    setup();
    const button = screen.getByTestId('relapse-button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(logRelapseAndStartSession).toHaveBeenCalled();
    });

    expect(passedSummary?.day).toBe('2024-01-01');
  });
});
