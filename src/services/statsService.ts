import {
  Timestamp,
  WriteBatch,
  collection,
  doc,
  increment,
} from 'firebase/firestore';

import { DB } from '@utils/constants';
import dayjs from 'dayjs';
import { db } from '@lib/firebase/firebase';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);

export function incrementDailySession(batch: WriteBatch, userId: string): void {
  const todayKey = dayjs().utc().format('YYYY-MM-DD');
  const docRef = doc(db, DB.USER_STATS, userId, DB.DAILY_SESSIONS, todayKey);

  batch.set(
    docRef,
    {
      count: increment(1),
      updatedAt: Timestamp.now(),
    },
    { merge: true }
  );
}

export function logSessionGap(
  batch: WriteBatch,
  userId: string,
  startedAt: Timestamp,
  seconds: number
) {
  const gapRef = doc(collection(db, DB.USER_STATS, userId, DB.SESSION_GAPS));

  batch.set(gapRef, {
    startedAt,
    seconds,
    createdAt: Timestamp.now(),
  });
}
