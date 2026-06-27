import { useCallback, useEffect } from 'react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useApiHealth } from '@/hooks/useApiHealth';
import { useSyncStore } from '@/store/syncStore';
import { useCatalogStore } from '@/store/catalogStore';

export const useSync = () => {
  const isOnline = useOnlineStatus();
  const { apiReachable, ping } = useApiHealth();
  const pendingCount = useSyncStore((s) => s.pendingCount);
  const isSyncing = useSyncStore((s) => s.isSyncing);
  const lastSyncAt = useSyncStore((s) => s.lastSyncAt);
  const syncMessage = useSyncStore((s) => s.syncMessage);
  const refreshPendingCount = useSyncStore((s) => s.refreshPendingCount);
  const syncNow = useSyncStore((s) => s.syncNow);
  const clearSyncMessage = useSyncStore((s) => s.clearSyncMessage);
  const refreshFromNetwork = useCatalogStore((s) => s.refreshFromNetwork);

  const handleSync = useCallback(async () => {
    if (!isOnline) return { synced: 0, failed: 0 };
    return syncNow();
  }, [isOnline, syncNow]);

  useEffect(() => {
    void refreshPendingCount();
  }, [refreshPendingCount]);

  useEffect(() => {
    if (!isOnline || apiReachable !== true) return;

    void refreshFromNetwork();
    void syncNow();
  }, [isOnline, apiReachable, refreshFromNetwork, syncNow]);

  return {
    isOnline,
    apiReachable,
    pendingCount,
    isSyncing,
    lastSyncAt,
    syncMessage,
    syncNow: handleSync,
    refreshPendingCount,
    clearSyncMessage,
    pingApi: ping,
  };
};