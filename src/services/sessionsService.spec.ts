import { Mock, describe, expect, it, vi } from 'vitest';
import { WriteBatch, collection, doc, getDocs } from 'firebase/firestore';
import {
  getCurrentSession,
  getPastSessions,
  logRelapseAndStartSession,
  startNewSession,
} from './sessionsService';
import { incrementDailySession, logSessionGap } from './statsService';

import { ColorUtils } from '@utils/colorUtils';
import type { Session } from '@features/sessions/session';

vi.mock('@lib/firebase', () => ({ db: {} }));

vi.mock('@utils/colorUtils', () => ({
  ColorUtils: {
    interpolateColor: vi.fn(() => '#FF0000'),
  },
}));

vi.mock('./statsService', () => ({
  logSessionGap: vi.fn(() => ({})),
  incrementDailySession: vi.fn(),
}));

vi.mock('firebase/firestore', () => ({
  Timestamp: { now: vi.fn(() => ({ seconds: 1000 })) },
  doc: vi.fn(() => ({ id: 'mocked-id', path: 'mock-path' })),
  collection: vi.fn(() => 'mock-collection'),
  writeBatch: vi.fn(),
  getDocs: vi.fn(),
  getDoc: vi.fn(),
  limit: vi.fn(),
  query: vi.fn(),
  orderBy: vi.fn(),
  where: vi.fn(),
  startAfter: vi.fn(),
}));

function createMockWriteBatch(): WriteBatch {
  return {
    set: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
    commit: vi.fn(),
  };
}

describe('sessionService', () => {
  describe('startNewSession', () => {
    it('creates a session and calls batch.set with correct data', () => {
      const batch = createMockWriteBatch();
      const session = startNewSession('user123', 1800, batch);

      expect(collection).toHaveBeenCalledWith(
        {},
        'user_sessions',
        'user123',
        'sessions'
      );
      expect(doc).toHaveBeenCalledWith('mock-collection');
      expect(batch.set).toHaveBeenCalledWith(
        { id: 'mocked-id', path: 'mock-path' },
        session
      );
      expect(session).toMatchObject({
        id: 'mocked-id',
        targetDuration: 1800,
        createdAt: { seconds: 1000 },
      });
    });
  });

  describe('logRelapseAndStartSession', () => {
    it('updates previous, creates new session, logs gap, and increments stat', () => {
      const batch = createMockWriteBatch();
      const previous: Session = {
        id: 'prev-id',
        createdAt: { seconds: 500 } as any,
        endedAt: null,
        targetDuration: 600,
        duration: null,
        percentage: null,
        color: null,
      };

      const result = logRelapseAndStartSession(
        'user123',
        previous,
        3600,
        batch
      );

      expect(batch.update).toHaveBeenCalled();
      expect(batch.set).toHaveBeenCalled();
      expect(ColorUtils.interpolateColor).toHaveBeenCalled();
      expect(logSessionGap).toHaveBeenCalled();
      expect(incrementDailySession).toHaveBeenCalled();
      expect(result.session).toBeDefined();
      expect(result.previous.endedAt).toBeDefined();
    });
  });

  describe('getCurrentSession', () => {
    it('returns null if no active session is found', async () => {
      (getDocs as Mock).mockResolvedValueOnce({ empty: true });

      const session = await getCurrentSession('user123');

      expect(getDocs).toHaveBeenCalled();
      expect(session).toBeNull();
    });

    it('returns the latest session if found', async () => {
      const mockData = { id: '123', createdAt: {}, targetDuration: 1000 };
      (getDocs as Mock).mockResolvedValueOnce({
        empty: false,
        docs: [{ data: () => mockData }],
      });

      const session = await getCurrentSession('user123');

      expect(session).toEqual(mockData);
    });
  });

  describe('getPastSessions', () => {
    it('returns sessions and pagination info', async () => {
      const mockDocs = Array.from({ length: 3 }, (_, i) => ({
        id: `id${i}`,
        data: () => ({ createdAt: {}, targetDuration: 1000 + i }),
      }));

      (getDocs as Mock).mockResolvedValueOnce({
        docs: mockDocs,
      });

      const result = await getPastSessions('user123', 2);

      expect(result.sessions).toHaveLength(2);
      expect(result.hasMore).toBe(true);
      expect(result.lastVisible).toEqual(mockDocs[2]);
    });
  });
});
