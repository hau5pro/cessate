import { FieldValue, Timestamp } from 'firebase/firestore';

export interface Session {
  createdAt: Timestamp | FieldValue;
  endedAt?: Timestamp | FieldValue;
  targetDuration: number;
  // duration?: number;
  // color?: string;
}
