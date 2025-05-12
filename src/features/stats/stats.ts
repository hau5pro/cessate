import { Timestamp } from 'firebase/firestore';

export type DailySession = {
  day: string; // YYYY-MM-DD
  count: number;
  updatedAt: Timestamp;
};

export type SessionGap = {
  startedAt: Timestamp;
  seconds: number;
  createdAt: Timestamp;
};

export type SessionGapSummary = {
  day: string; // 'YYYY-MM-DD'
  gaps: SessionGap[];
  avgSeconds: number;
  updatedAt: Timestamp | null;
};
