import { Constants, DB } from '@utils/constants';
import {
  DocumentData,
  QueryDocumentSnapshot,
  collection,
  deleteDoc,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  limit,
  query,
  startAfter,
  writeBatch,
} from 'firebase/firestore';

import { db } from '@lib/firebase';

export interface DeletionProgress {
  collectionPath: string;
  deleted: number;
  total: number;
}

type ProgressCallback = (info: DeletionProgress) => void;

export async function deleteCollectionInChunks(
  pathSegments: [string, ...string[]],
  reportProgress?: ProgressCallback
): Promise<number> {
  const pathString = pathSegments.filter((_, i) => i % 2 === 0).join('/');

  if (pathSegments.length % 2 === 0) {
    // Document path
    const docRef = doc(db, ...pathSegments);
    const snap = await getDoc(docRef);

    if (snap.exists()) {
      await deleteDoc(docRef);
      reportProgress?.({ collectionPath: pathString, deleted: 1, total: 1 });
      return 1;
    }

    return 0;
  } else {
    // Collection path
    const colRef = collection(db, ...pathSegments);

    let total = 0;
    try {
      const countSnap = await getCountFromServer(colRef);
      total = countSnap.data().count;
    } catch (err) {
      console.warn(`Could not count documents in: ${pathString}`, err);
    }

    let lastDoc: QueryDocumentSnapshot<DocumentData> | undefined;
    let deletedCount = 0;

    while (true) {
      const q = lastDoc
        ? query(colRef, limit(Constants.MAX_BATCH_SIZE), startAfter(lastDoc))
        : query(colRef, limit(Constants.MAX_BATCH_SIZE));

      const snap = await getDocs(q);
      const docs = snap.docs;

      if (docs.length === 0) break;

      const batch = writeBatch(db);
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
}

export async function deleteAllUserData(
  userId: string,
  reportProgress?: ProgressCallback
) {
  const paths: [string, ...string[]][] = [
    [DB.USER_STATS, userId, DB.DAILY_SESSIONS],
    [DB.USER_STATS, userId, DB.SESSION_GAPS],
    [DB.USER_SESSIONS, userId, DB.SESSIONS],
    [DB.USER_SETTINGS, userId],
  ];

  for (const path of paths) {
    await deleteCollectionInChunks(path, reportProgress);
  }
}
