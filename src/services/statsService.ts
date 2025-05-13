import { DailySession, SessionGapSummary } from '@features/stats/stats';
import {
  Timestamp,
  WriteBatch,
  arrayUnion,
  collection,
  doc,
  getDocs,
  increment,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { dayjs, getLocalDayKey, getLocalStartOfDay } from '@lib/dayjs';

import { DB } from '@utils/constants';
import { SessionGap } from '@features/stats/stats';
import { db } from '@lib/firebase';

export type TimeUnit = 'seconds' | 'minutes' | 'hours' | 'days';

export function incrementDailySession(batch: WriteBatch, userId: string): void {
  const todayKey = getLocalDayKey();
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
  const sinceDate = getLocalDayKey(dayjs().subtract(rangeInDays, 'day'));

  const q = query(
    collection(db, `${DB.USER_STATS}/${uid}/${DB.DAILY_SESSIONS}`),
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
  const today = getLocalStartOfDay();
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
  seconds: number,
  existingSummary?: SessionGapSummary
): SessionGapSummary {
  const dayKey = dayjs(startedAt.toDate()).format('YYYY-MM-DD');
  const docRef = doc(db, DB.USER_STATS, userId, DB.SESSION_GAPS, dayKey);

  const gap: SessionGap = {
    startedAt,
    seconds,
    createdAt: Timestamp.now(),
  };

  const gaps = [...(existingSummary?.gaps ?? []), gap];
  const avgSeconds = gaps.reduce((acc, g) => acc + g.seconds, 0) / gaps.length;

  batch.set(
    docRef,
    {
      day: dayKey,
      gaps: arrayUnion(gap),
      avgSeconds,
      updatedAt: Timestamp.now(),
    },
    { merge: true }
  );

  return {
    day: dayKey,
    gaps: gaps,
    avgSeconds,
    updatedAt: Timestamp.now(),
  };
}

export async function getSessionGaps(
  uid: string,
  rangeInDays: number
): Promise<SessionGapSummary[]> {
  const sinceDate = getLocalDayKey(dayjs().subtract(rangeInDays, 'day'));

  const q = query(
    collection(db, `${DB.USER_STATS}/${uid}/${DB.SESSION_GAPS}`),
    where('day', '>=', sinceDate),
    orderBy('day', 'asc')
  );

  const snap = await getDocs(q);

  const raw: SessionGapSummary[] = snap.docs.map((doc) => {
    const data = doc.data();
    return {
      day: data.day,
      gaps: data.gaps || [],
      avgSeconds: data.avgSeconds ?? undefined,
      updatedAt: data.updatedAt ?? null,
    };
  });

  return fillMissingGaps(raw, rangeInDays);
}

function fillMissingGaps(
  gaps: SessionGapSummary[],
  range: number
): SessionGapSummary[] {
  const today = getLocalStartOfDay();
  const map = new Map(gaps.map((g) => [g.day, g]));

  const filled: SessionGapSummary[] = [];

  for (let i = 0; i < range; i++) {
    const day = today.subtract(range - 1 - i, 'day').format('YYYY-MM-DD');

    filled.push(
      map.get(day) ?? {
        day,
        gaps: [],
        avgSeconds: 0,
        updatedAt: null,
      }
    );
  }

  return filled;
}

export function transformSessionGaps(summaries: SessionGapSummary[]): {
  data: { day: string; value: number }[];
  unit: TimeUnit;
  domain: [number, number];
} {
  const rawSeconds = summaries.map((summary) => ({
    day: summary.day,
    seconds: summary.avgSeconds ?? 0,
  }));

  const maxSeconds = Math.max(...rawSeconds.map((d) => d.seconds), 0);
  const unit = getBestTimeUnit(maxSeconds);

  const data = rawSeconds.map(({ day, seconds }) => ({
    day,
    value: convertSeconds(seconds, unit),
  }));

  return {
    data: data.length ? data : [{ day: getLocalDayKey(), value: 0 }],
    unit,
    domain: getYDomainForUnit(maxSeconds, unit),
  };
}

function getBestTimeUnit(seconds: number): TimeUnit {
  if (seconds < 60) return 'seconds';
  if (seconds < 3600) return 'minutes';
  if (seconds < 86400) return 'hours';
  return 'days';
}

function convertSeconds(seconds: number, unit: TimeUnit): number {
  switch (unit) {
    case 'minutes':
      return Math.round(seconds / 60);
    case 'hours':
      return +(seconds / 3600).toFixed(2);
    case 'days':
      return +(seconds / 86400).toFixed(2);
    case 'seconds':
    default:
      return Math.round(seconds);
  }
}

function getYDomainForUnit(
  maxSeconds: number,
  unit: TimeUnit
): [number, number] {
  switch (unit) {
    case 'seconds':
      return [0, Math.ceil(maxSeconds + 5)];
    case 'minutes':
      return [0, Math.ceil(maxSeconds / 60 + 2)];
    case 'hours':
      return [0, +(maxSeconds / 3600 + 0.1).toFixed(1)];
    case 'days':
      return [0, +(maxSeconds / 86400 + 0.1).toFixed(1)];
  }
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
