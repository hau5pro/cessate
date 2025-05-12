import {
  CollectionReference,
  DocumentData,
  WriteBatch,
  collection,
  getFirestore,
  writeBatch,
} from 'firebase/firestore';
import { GoogleAuthProvider, getAuth } from 'firebase/auth';

import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

/* Helpers */
export const createBatch = (): WriteBatch => writeBatch(db);

export const commitBatch = async (batch: WriteBatch): Promise<void> => {
  await batch.commit();
};

export async function runSessionTransaction<T>(
  callback: (batch: WriteBatch) => Promise<T>
): Promise<T> {
  const batch = writeBatch(db);
  const result = await callback(batch);
  await batch.commit();
  return result;
}
