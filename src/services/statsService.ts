import {
  Timestamp,
  WriteBatch,
  collection,
  doc,
  getDocs,
  increment,
  orderBy,
  query,
  where,
} from 'firebase/firestore';

import { DB } from '@utils/constants';
import { DailySession } from '@features/stats/stats';
import { SessionGap } from '@features/stats/stats';
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
      day: todayKey,
      count: increment(1),
      updatedAt: Timestamp.now(),
    },
    { merge: true }
  );
}

export async function getDailySessions(
  uid: string,
  rangeInDays: number
): Promise<DailySession[]> {
  const sinceDate = dayjs()
    .subtract(rangeInDays, 'day')
    .startOf('day')
    .format('YYYY-MM-DD');

  const q = query(
    collection(db, `user_stats/${uid}/daily_sessions`),
    where('day', '>=', sinceDate),
    orderBy('day')
  );

  const snap = await getDocs(q);
  const raw = snap.docs.map((doc) => doc.data() as DailySession);
  const filled = fillMissingDays(raw, rangeInDays);

  return filled;
}

function fillMissingDays(
  sessions: DailySession[],
  range: number
): DailySession[] {
  const today = dayjs().utc().startOf('day');
  const map = new Map(sessions.map((s) => [s.day, s]));

  const filled: DailySession[] = [];

  for (let i = 0; i < range; i++) {
    const day = today.subtract(range - 1 - i, 'day').format('YYYY-MM-DD');

    filled.push(
      map.get(day) ?? {
        day,
        count: 0,
        updatedAt: null as any,
      }
    );
  }

  return filled;
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

export async function getSessionGaps(
  uid: string,
  rangeInDays: number
): Promise<SessionGap[]> {
  const sinceDate = dayjs()
    .subtract(rangeInDays, 'day')
    .startOf('day')
    .toDate();

  const q = query(
    collection(db, `user_stats/${uid}/session_gaps`),
    where('startedAt', '>=', sinceDate),
    orderBy('startedAt', 'asc')
  );

  const snap = await getDocs(q);

  const raw: SessionGap[] = snap.docs.map((doc) => {
    const data = doc.data();
    return {
      startedAt: dayjs(data.startedAt.toDate()).utc().format('YYYY-MM-DD'),
      seconds: data.seconds,
      createdAt: data.createdAt,
    };
  });

  return fillMissingGaps(raw, rangeInDays);
}

function fillMissingGaps(gaps: SessionGap[], range: number): SessionGap[] {
  const today = dayjs().utc().startOf('day');
  const map = new Map(gaps.map((g) => [g.startedAt, g]));

  const filled: SessionGap[] = [];

  for (let i = 0; i < range; i++) {
    const day = today.subtract(range - 1 - i, 'day').format('YYYY-MM-DD');

    filled.push(
      map.get(day) ?? {
        startedAt: day,
        seconds: 0,
        createdAt: null as any,
      }
    );
  }

  return filled;
}
