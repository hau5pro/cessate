import { Timestamp } from 'firebase/firestore';

export interface Session {
  id: string;
  createdAt: Timestamp;
  endedAt: Timestamp | null;
  targetDuration: number;
  percentage: number | null;
  duration: number | null;
  color: string | null;
}
