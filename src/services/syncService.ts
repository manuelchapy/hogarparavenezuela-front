import { apiClient } from '@/api/client';
import type { PendingMutation, PendingMutationType } from '@/api/types';
import { API_ENDPOINTS } from '@/constants/routes';
import { processPendingNnaCreates } from '@/services/nnaService';
import { db } from '@/services/db';

export const enqueueMutation = async (
  type: PendingMutationType,
  endpoint: string,
  payload: unknown,
): Promise<number> => {
  const id = await db.pendingMutations.add({
    type,
    endpoint,
    payload,
    createdAt: Date.now(),
    retries: 0,
  });
  return id as number;
};

export const getPendingCount = async (): Promise<number> => {
  const [mutations, nnaCreates] = await Promise.all([
    db.pendingMutations.count(),
    db.pendingNnaCreates.count(),
  ]);
  return mutations + nnaCreates;
};

export const processPendingMutations = async (): Promise<{
  synced: number;
  failed: number;
}> => {
  if (!navigator.onLine) {
    return { synced: 0, failed: 0 };
  }

  const nnaResult = await processPendingNnaCreates();

  const pending = await db.pendingMutations.orderBy('createdAt').toArray();
  let synced = nnaResult.synced;
  let failed = nnaResult.failed;

  for (const mutation of pending) {
    const success = await executeMutation(mutation);
    if (success) {
      await db.pendingMutations.delete(mutation.id!);
      synced += 1;
    } else {
      failed += 1;
    }
  }

  return { synced, failed };
};

const executeMutation = async (mutation: PendingMutation): Promise<boolean> => {
  try {
    if (mutation.type === 'UPLOAD_PHOTO') {
      const formData = mutation.payload as FormData;
      await apiClient.post(API_ENDPOINTS.NNA_UPLOAD_PHOTO, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } else if (mutation.type === 'POST_NNA') {
      await apiClient.post(mutation.endpoint, mutation.payload);
    } else if (mutation.type === 'PATCH_TIMELINE') {
      await apiClient.patch(mutation.endpoint, mutation.payload);
    }
    return true;
  } catch {
    await db.pendingMutations.update(mutation.id!, {
      retries: mutation.retries + 1,
    });
    return false;
  }
};
