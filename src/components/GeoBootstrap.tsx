import { useEffect } from 'react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useGeoStore } from '@/store/geoStore';

export const GeoBootstrap = () => {
  const isOnline = useOnlineStatus();
  const ensureStates = useGeoStore((s) => s.ensureStates);
  const prefetchGeo = useGeoStore((s) => s.prefetchGeo);

  useEffect(() => {
    void ensureStates();
  }, [ensureStates]);

  useEffect(() => {
    if (!isOnline) return;
    void prefetchGeo();
  }, [isOnline, prefetchGeo]);

  return null;
};
