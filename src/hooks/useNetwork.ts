import { useCallback, useEffect, useState } from 'react';
import { apiClient } from '@/api/client';

const HEALTH_POLL_MS = 15_000;

export const useOnlineStatus = (): boolean => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

export const checkApiHealth = async (): Promise<boolean> => {
  try {
    await apiClient.get('/health', { timeout: 5000 });
    return true;
  } catch {
    return false;
  }
};

export const useNetwork = () => {
  const isOnline = useOnlineStatus();
  const [apiReachable, setApiReachable] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const ping = useCallback(async () => {
    if (!navigator.onLine) {
      setApiReachable(false);
      return false;
    }

    setIsChecking(true);
    try {
      const ok = await checkApiHealth();
      setApiReachable(ok);
      return ok;
    } finally {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    if (!isOnline) {
      setApiReachable(false);
      return;
    }

    void ping();
    const interval = window.setInterval(() => void ping(), HEALTH_POLL_MS);
    return () => window.clearInterval(interval);
  }, [isOnline, ping]);

  return { isOnline, apiReachable, isChecking, ping };
};
