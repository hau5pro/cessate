import {
  Timestamp,
  WriteBatch,
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { incrementDailySession, logSessionGap } from './statsService';

import { ColorUtils } from '@utils/colorUtils';
import { DB } from '@utils/constants';
import { Session } from '@features/sessions/session';
import { db } from '@lib/firebase/firebase';

export const startNewSession = (
  userId: string,
  targetDuration: number,
  batch: WriteBatch
): Session => {
  const sessionCollection = collection(
    db,
    DB.USER_SESSIONS,
    userId,
    DB.SESSIONS
  );
  const sessionRef = doc(sessionCollection);

  const session: Session = {
    id: sessionRef.id,
    createdAt: Timestamp.now(),
    endedAt: null,
    targetDuration,
    percentage: null,
    duration: null,
    color: null,
  };

  batch.set(sessionRef, session);
  return session;
};

export const logRelapseAndStartSession = (
  userId: string,
  previousSession: Session,
  targetDuration: number,
  batch: WriteBatch
): Session => {
  const sessionCollection = collection(
    db,
    DB.USER_SESSIONS,
    userId,
    DB.SESSIONS
  );
  const previousRef = doc(sessionCollection, previousSession.id);
  const now = Timestamp.now();

  const duration = now.seconds - previousSession.createdAt.seconds;
  const normalizedPercent = duration / previousSession.targetDuration;
  const color = ColorUtils.interpolateColor(normalizedPercent);
  const percentage = Math.round(normalizedPercent * 100);

  batch.update(previousRef, {
    endedAt: now,
    duration,
    percentage,
    color,
  });

  const newSession = startNewSession(userId, targetDuration, batch);

  const gapSeconds = now.seconds - previousSession.createdAt.seconds;

  logSessionGap(batch, userId, previousSession.createdAt, gapSeconds);

  incrementDailySession(batch, userId);

  return newSession;
};

export const getCurrentSession = async (userId: string) => {
  const q = query(
    collection(db, DB.USER_SESSIONS, userId, DB.SESSIONS),
    where('endedAt', '==', null),
    orderBy('createdAt', 'desc'),
    limit(1)
  );

  const snapshot = await getDocs(q);
  return snapshot.empty ? null : (snapshot.docs[0].data() as Session);
};
