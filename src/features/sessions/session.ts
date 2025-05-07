import { FieldValue, Timestamp } from 'firebase/firestore';

export interface Session {
  id: string;
  createdAt: Timestamp | FieldValue;
  endedAt: Timestamp | FieldValue | null;
  targetDuration: number;
  // duration?: number;
  // color?: string;
}
