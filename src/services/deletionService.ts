import { Constants, DB } from '@/utils/constants';
import {
  DocumentData,
  QueryDocumentSnapshot,
  getDocs,
  limit,
  query,
  startAfter,
  writeBatch,
} from 'firebase/firestore';

import { getCollectionRef } from '@lib/firebase/firebase';

async function deleteCollectionInChunks(
  collectionPathSegments: [string, ...string[]]
): Promise<void> {
  const colRef = getCollectionRef(...collectionPathSegments);

  let lastDoc: QueryDocumentSnapshot<DocumentData> | undefined;
  let hasMore = true;

  while (hasMore) {
    try {
      const q = lastDoc
        ? query(colRef, limit(Constants.MAX_BATCH_SIZE), startAfter(lastDoc))
        : query(colRef, limit(Constants.MAX_BATCH_SIZE));

      const snap = await getDocs(q);
      const docs = snap.docs;

      if (docs.length === 0) {
        hasMore = false;
        continue;
      }

      const batch = writeBatch(colRef.firestore);
      docs.forEach((doc) => batch.delete(doc.ref));

      await batch.commit();

      lastDoc = docs[docs.length - 1];
    } catch (err) {
      console.error(
        `Error deleting docs from: ${collectionPathSegments.join('/')} —`,
        err
      );
      throw new Error(
        `Batch delete failed for ${collectionPathSegments.join('/')}`
      );
    }
  }
}

export async function deleteAllUserData(userId: string): Promise<void> {
  // Order matters if you have any dependent data in the future
  await deleteCollectionInChunks([DB.USER_STATS, userId, DB.DAILY_SESSIONS]);
  await deleteCollectionInChunks([DB.USER_STATS, userId, DB.SESSION_GAPS]);
  await deleteCollectionInChunks([DB.USER_SESSIONS, userId, DB.SESSIONS]);
}
