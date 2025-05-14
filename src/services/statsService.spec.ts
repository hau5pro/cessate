import { Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { Timestamp, getDocs } from 'firebase/firestore';
import {
  formatDuration,
  getDailySessions,
  getSessionGaps,
  incrementDailySession,
  logSessionGap,
  transformSessionGaps,
} from './statsService';

vi.mock('@lib/dayjs', () => {
  const format = () => '2024-01-01';
  const toDate = () => new Date();

  return {
    dayjs: vi.fn(() => ({
      format,
      toDate,
      subtract: vi.fn(() => ({ format })),
    })),
    getLocalDayKey: vi.fn(() => '2024-01-01'),
    getLocalStartOfDay: vi.fn(() => ({
      subtract: () => ({ format }),
    })),
  };
});

vi.mock('firebase/firestore', () => ({
  doc: vi.fn(() => ({ path: 'mock-ref' })),
  collection: vi.fn(() => 'mock-collection'),
  query: vi.fn(),
  where: vi.fn(),
  orderBy: vi.fn(),
  startAfter: vi.fn(),
  getDocs: vi.fn(),
  Timestamp: {
    now: vi.fn(() => ({ seconds: 1000, toDate: () => new Date() })),
  },
  increment: vi.fn(() => 'mock-increment'),
  arrayUnion: vi.fn((v) => v),
  getFirestore: vi.fn(() => ({})),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('statsService', () => {
  describe('incrementDailySession', () => {
    it('writes correct doc with increment and timestamp', () => {
      const batch = { set: vi.fn() };
      incrementDailySession(batch as any, 'user123');

      expect(batch.set).toHaveBeenCalledWith(
        { path: 'mock-ref' },
        expect.objectContaining({
          day: '2024-01-01',
          count: 'mock-increment',
        }),
        { merge: true }
      );
    });
  });

  describe('getDailySessions', () => {
    it('fetches and fills missing days', async () => {
      (getDocs as Mock).mockResolvedValueOnce({
        docs: [
          {
            data: () => ({
              day: '2024-01-01',
              count: 3,
              updatedAt: Timestamp.now(),
            }),
          },
        ],
      });

      const result = await getDailySessions('user123', 1);
      expect(result).toHaveLength(1);
      expect(result[0].updatedAt).toBeDefined();
    });
  });

  describe('logSessionGap', () => {
    it('logs a new gap and updates summary', () => {
      const batch = { set: vi.fn() };
      const startedAt = Timestamp.now();

      const result = logSessionGap(batch as any, 'user123', startedAt, 120);

      expect(batch.set).toHaveBeenCalled();
      expect(result.gaps[0].seconds).toBe(120);
      expect(result.avgSeconds).toBe(120);
    });
  });

  describe('getSessionGaps', () => {
    it('returns filled gap data from Firestore', async () => {
      (getDocs as Mock).mockResolvedValueOnce({
        docs: [
          {
            data: () => ({
              day: '2024-01-01',
              gaps: [{ seconds: 60 }],
              avgSeconds: 60,
              updatedAt: Timestamp.now(),
            }),
          },
        ],
      });

      const result = await getSessionGaps('user123', 1);
      expect(result).toHaveLength(1);
      expect(result[0].day).toBe('2024-01-01');
      expect(result[0].avgSeconds).toBe(60);
    });
  });

  describe('transformSessionGaps', () => {
    it('formats chart data and computes best unit', () => {
      const summaries = [
        { day: '2024-01-01', gaps: [], avgSeconds: 1800, updatedAt: null },
        { day: '2024-01-02', gaps: [], avgSeconds: 3600, updatedAt: null },
      ];

      const result = transformSessionGaps(summaries);
      expect(result.unit).toBe('hours');
      expect(result.data[0].value).toBeCloseTo(0.5);
    });
  });

  describe('formatDuration', () => {
    it.each([
      [42, { value: 42, unit: 'seconds' }],
      [120, { value: 2, unit: 'minutes' }],
      [3600, { value: 1, unit: 'hours' }],
      [86400, { value: 1, unit: 'days' }],
    ])('formats %i seconds', (input, expected) => {
      expect(formatDuration(input)).toEqual(expected);
    });
  });
});
