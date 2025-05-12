import { Constants, DB } from '@utils/constants';
import {
  DocumentData,
  QueryDocumentSnapshot,
  getCountFromServer,
  getDocs,
  limit,
  query,
  startAfter,
  writeBatch,
} from 'firebase/firestore';

import { getCollectionRef } from '@lib/firebase';

export interface DeletionProgress {
  collectionPath: string;
  deleted: number;
  total: number;
}

type ProgressCallback = (info: DeletionProgress) => void;

export async function deleteCollectionInChunks(
  collectionPathSegments: [string, ...string[]],
  reportProgress?: ProgressCallback
): Promise<number> {
  const colRef = getCollectionRef(...collectionPathSegments);
  const pathString = collectionPathSegments.join('/');

  const countSnap = await getCountFromServer(colRef);
  const total = countSnap.data().count;

  let lastDoc: QueryDocumentSnapshot<DocumentData> | undefined;
  let deletedCount = 0;

  while (true) {
    const q = lastDoc
      ? query(colRef, limit(Constants.MAX_BATCH_SIZE), startAfter(lastDoc))
      : query(colRef, limit(Constants.MAX_BATCH_SIZE));

    const snap = await getDocs(q);
    const docs = snap.docs;

    if (docs.length === 0) break;

    const batch = writeBatch(colRef.firestore);
    docs.forEach((doc) => batch.delete(doc.ref));
    await batch.commit();

    deletedCount += docs.length;
    lastDoc = docs[docs.length - 1];

    reportProgress?.({
      collectionPath: pathString,
      deleted: deletedCount,
      total,
    });
  }

  return deletedCount;
}

export async function deleteAllUserData(
  userId: string,
  reportProgress?: ProgressCallback
) {
  const paths: [string, ...string[]][] = [
    [DB.USER_STATS, userId, DB.DAILY_SESSIONS],
    [DB.USER_STATS, userId, DB.SESSION_GAPS],
    [DB.USER_SESSIONS, userId, DB.SESSIONS],
  ];

  for (const path of paths) {
    await deleteCollectionInChunks(path, reportProgress);
  }
}
