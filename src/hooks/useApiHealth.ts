import { useCallback, useEffect, useState } from 'react';
import { checkApiHealth } from '@/api/healthApi';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

const HEALTH_POLL_MS = 15_000;

export const useApiHealth = () => {
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

  return { apiReachable, isChecking, ping };
};
