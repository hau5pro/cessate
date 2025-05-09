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

export type TimeUnit = 'seconds' | 'minutes' | 'hours' | 'days';

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

function getGapUnit(maxHours: number): TimeUnit {
  if (maxHours < 1) return 'minutes';
  if (maxHours > 24) return 'days';
  return 'hours';
}

function getYDomain(maxHours: number, unit: TimeUnit): [number, number] {
  switch (unit) {
    case 'minutes':
      return [0, Math.ceil(maxHours * 60 + 10)];
    case 'days':
      return [0, maxHours / 24 + 0.5];
    case 'hours':
    default:
      return [0, maxHours + 0.1];
  }
}

export function transformSessionGaps(raw: { day: string; seconds: number }[]): {
  data: { day: string; value: number }[];
  unit: TimeUnit;
  domain: [number, number];
} {
  const rawHours = raw.map((gap) => ({
    day: gap.day,
    hours: +(gap.seconds / 3600).toFixed(2),
  }));

  const maxHours = Math.max(...rawHours.map((d) => d.hours), 0);
  const unit = getGapUnit(maxHours);

  const data = rawHours.map(({ day, hours }) => ({
    day,
    value:
      unit === 'minutes'
        ? Math.round(hours * 60)
        : unit === 'days'
          ? +(hours / 24).toFixed(2)
          : hours,
  }));

  return {
    data: data.length
      ? data
      : [{ day: dayjs().format('YYYY-MM-DD'), value: 0 }],
    unit,
    domain: getYDomain(maxHours, unit),
  };
}

export function formatDuration(seconds: number): {
  value: number;
  unit: TimeUnit;
} {
  if (seconds < 60) return { value: Math.round(seconds), unit: 'seconds' };
  if (seconds < 3600)
    return { value: Math.round(seconds / 60), unit: 'minutes' };
  if (seconds < 86400)
    return { value: +(seconds / 3600).toFixed(2), unit: 'hours' };
  return { value: +(seconds / 86400).toFixed(2), unit: 'days' };
}
