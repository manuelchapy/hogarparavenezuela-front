import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useNetwork } from '@/hooks/useNetwork';
import { useCatalogStore } from '@/store/catalogStore';
import { useGeoStore } from '@/store/geoStore';

export const AppBootstrap = () => {
  const hydrateSession = useAuthStore((s) => s.hydrateSession);
  const { isOnline } = useNetwork();
  const hydrateFromCache = useCatalogStore((s) => s.hydrateFromCache);
  const refreshFromNetwork = useCatalogStore((s) => s.refreshFromNetwork);
  const ensureStates = useGeoStore((s) => s.ensureStates);
  const prefetchGeo = useGeoStore((s) => s.prefetchGeo);

  useEffect(() => {
    void hydrateSession();
  }, [hydrateSession]);

  useEffect(() => {
    void hydrateFromCache();
  }, [hydrateFromCache]);

  useEffect(() => {
    if (!isOnline) return;
    void refreshFromNetwork();
  }, [isOnline, refreshFromNetwork]);

  useEffect(() => {
    void ensureStates();
  }, [ensureStates]);

  useEffect(() => {
    if (!isOnline) return;
    void prefetchGeo();
  }, [isOnline, prefetchGeo]);

  return null;
};
