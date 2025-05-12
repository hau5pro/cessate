import {
  DailySession,
  SessionGapSummary,
  StatsMeta,
} from '@features/stats/stats';
import {
  Timestamp,
  WriteBatch,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { dayjs, getUtcDayKey, getUtcStartOfDay } from '@lib/dayjs';

import { DB } from '@utils/constants';
import { SessionGap } from '@features/stats/stats';
import { db } from '@lib/firebase';

export type TimeUnit = 'seconds' | 'minutes' | 'hours' | 'days';

export function incrementDailySession(batch: WriteBatch, userId: string): void {
  const todayKey = getUtcDayKey();
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

  updateStatsMeta(batch, userId);
}

export async function getDailySessions(
  uid: string,
  rangeInDays: number
): Promise<DailySession[]> {
  const sinceDate = getUtcDayKey(dayjs().subtract(rangeInDays, 'day'));

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
  const today = getUtcStartOfDay();
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
  const dayKey = dayjs(startedAt.toDate()).utc().format('YYYY-MM-DD');
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

  updateStatsMeta(batch, userId);

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
  const sinceDate = getUtcStartOfDay(
    dayjs().subtract(rangeInDays, 'day')
  ).toDate();

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
  const today = getUtcStartOfDay();
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

export function transformSessionGaps(summaries: SessionGapSummary[]): {
  data: { day: string; value: number }[];
  unit: TimeUnit;
  domain: [number, number];
} {
  const rawHours = summaries.map((summary) => ({
    day: summary.day,
    hours: +(summary.avgSeconds ?? 0 / 3600).toFixed(2),
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
    data: data.length ? data : [{ day: getUtcDayKey(), value: 0 }],
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

export async function getStatsMeta(uid: string): Promise<StatsMeta> {
  const metaRef = doc(db, `${DB.USER_STATS}/${uid}/${DB.STATS_META}`);
  const snap = await getDoc(metaRef);

  if (!snap.exists()) return { lastUpdated: null };

  const data = snap.data();
  return {
    lastUpdated: data?.lastUpdated ?? null,
  };
}

function updateStatsMeta(batch: WriteBatch, userId: string) {
  const metaRef = doc(db, `${DB.USER_STATS}/${userId}/${DB.STATS_META}`);
  batch.set(
    metaRef,
    {
      lastUpdated: Timestamp.now(),
    },
    { merge: true }
  );
}
