import { useCallback, useEffect, useState } from 'react';
import type { PendingNnaCreate } from '@/api/nnaTypes';
import { listPendingNnaCreates } from '@/services/nnaService';
import { useSyncStore } from '@/store/syncStore';

export const usePendingNnaCreates = () => {
  const [items, setItems] = useState<PendingNnaCreate[]>([]);
  const pendingCount = useSyncStore((s) => s.pendingCount);

  const reload = useCallback(async () => {
    const pending = await listPendingNnaCreates();
    setItems(pending);
  }, []);

  useEffect(() => {
    void reload();
  }, [reload, pendingCount]);

  return { items, reload };
};
