import { Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  deleteDoc,
  getCountFromServer,
  getDoc,
  getDocs,
  writeBatch,
} from 'firebase/firestore';

import { deleteCollectionInChunks } from './deletionService';

vi.mock('firebase/firestore', async () => ({
  getFirestore: vi.fn(),
  getDoc: vi.fn(),
  deleteDoc: vi.fn(),
  getCountFromServer: vi.fn(),
  getDocs: vi.fn(),
  writeBatch: vi.fn(),
  doc: vi.fn(),
  collection: vi.fn(),
  query: vi.fn(),
  limit: vi.fn(),
  startAfter: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('deleteCollectionInChunks', () => {
  it('deletes a single document and reports progress', async () => {
    (getDoc as Mock).mockResolvedValue({
      exists: () => true,
    });

    const progress = vi.fn();
    const deleted = await deleteCollectionInChunks(['users', 'abc'], progress);

    expect(getDoc).toHaveBeenCalled();
    expect(deleteDoc).toHaveBeenCalled();
    expect(progress).toHaveBeenCalledWith({
      collectionPath: 'users',
      deleted: 1,
      total: 1,
    });
    expect(deleted).toBe(1);
  });

  it('deletes a collection in batches and reports progress', async () => {
    (getCountFromServer as Mock).mockResolvedValue({
      data: () => ({ count: 3 }),
    });

    const fakeDocs = Array.from({ length: 3 }, (_, i) => ({
      ref: `doc${i}`,
    }));

    const batchCommit = vi.fn();
    const batch = {
      delete: vi.fn(),
      commit: batchCommit,
    };

    (getDocs as Mock).mockResolvedValueOnce({ docs: fakeDocs });
    (getDocs as Mock).mockResolvedValueOnce({ docs: [] });

    (writeBatch as Mock).mockReturnValue(batch);

    const progress = vi.fn();
    const deleted = await deleteCollectionInChunks(
      ['users', 'abc', 'sessions'],
      progress
    );

    expect(getDocs).toHaveBeenCalledTimes(2);
    expect(batch.delete).toHaveBeenCalledTimes(3);
    expect(batch.commit).toHaveBeenCalled();
    expect(progress).toHaveBeenCalledWith({
      collectionPath: 'users/sessions',
      deleted: 3,
      total: 3,
    });
    expect(deleted).toBe(3);
  });
});
