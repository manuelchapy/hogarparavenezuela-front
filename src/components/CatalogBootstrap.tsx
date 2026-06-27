import { useEffect } from 'react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useCatalogStore } from '@/store/catalogStore';

export const CatalogBootstrap = () => {
  const isOnline = useOnlineStatus();
  const hydrateFromCache = useCatalogStore((s) => s.hydrateFromCache);
  const refreshFromNetwork = useCatalogStore((s) => s.refreshFromNetwork);

  useEffect(() => {
    void hydrateFromCache();
  }, [hydrateFromCache]);

  useEffect(() => {
    if (!isOnline) return;
    void refreshFromNetwork();
  }, [isOnline, refreshFromNetwork]);

  return null;
};
