import { Timestamp } from 'firebase/firestore';

export interface Session {
  id: string;
  createdAt: Timestamp;
  endedAt: Timestamp | null;
  targetDuration: number;
  // duration?: number;
  // color?: string;
}
