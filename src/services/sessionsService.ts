import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';

import { DB } from '@utils/constants';
import { Session } from '@features/sessions/session';
import { db } from '@lib/firebase/firebase';

export const startNewSession = async (
  userId: string,
  targetDuration: number
) => {
  const sessionRef = collection(db, DB.USER_SESSIONS, userId, DB.SESSIONS);
  const session: Session = {
    createdAt: serverTimestamp(),
    targetDuration,
  };
  const doc = await addDoc(sessionRef, session);

  return doc.id;
};

export const endCurrentSession = async (userId: string, sessionId: string) => {
  const sessionDoc = doc(db, DB.USER_SESSIONS, userId, DB.SESSIONS, sessionId);
  await updateDoc(sessionDoc, {
    endedAt: serverTimestamp(),
  });
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
