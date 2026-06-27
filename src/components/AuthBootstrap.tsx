import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';

export const AuthBootstrap = () => {
  const hydrateSession = useAuthStore((s) => s.hydrateSession);

  useEffect(() => {
    void hydrateSession();
  }, [hydrateSession]);

  return null;
};
