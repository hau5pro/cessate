import { Timestamp } from 'firebase/firestore';

export type DailySession = {
  day: string; // YYYY-MM-DD format
  count: number;
  updatedAt: Timestamp;
};

export type SessionGap = {
  startedAt: string;
  seconds: number;
  createdAt: Timestamp;
};
