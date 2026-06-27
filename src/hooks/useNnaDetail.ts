import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { fetchNnaById } from '@/api/nnaApi';
import type { NnaRecord } from '@/api/nnaTypes';
import { ROUTES } from '@/constants/routes';
import {
  getCachedNnaRecord,
  upsertNnaRecord,
} from '@/services/nnaCacheService';

export const useNnaDetail = (id: string | undefined) => {
  const { t } = useTranslation();
  const [nna, setNna] = useState<NnaRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFromCache, setIsFromCache] = useState(false);

  const load = useCallback(async () => {
    if (!id) return;

    setIsLoading(true);
    setError(null);

    if (!navigator.onLine) {
      const cached = await getCachedNnaRecord(id);
      setIsFromCache(true);
      if (cached) {
        setNna(cached);
        setError(null);
      } else {
        setNna(null);
        setError(t('nna.detailCacheMissing'));
      }
      setIsLoading(false);
      return;
    }

    try {
      const data = await fetchNnaById(id);
      await upsertNnaRecord(data);
      setNna(data);
      setIsFromCache(false);
    } catch {
      const cached = await getCachedNnaRecord(id);
      if (cached) {
        setNna(cached);
        setIsFromCache(true);
        setError(null);
      } else {
        setError(t('nna.detailLoadError'));
        setNna(null);
      }
    } finally {
      setIsLoading(false);
    }
  }, [id, t]);

  return { nna, isLoading, error, isFromCache, load, setNna };
};

export const useNnaSearch = () => {
  const navigate = useNavigate();
  const [isSearching, setIsSearching] = useState(false);

  const goToByIdUnico = async (
    searchFn: () => Promise<string | null>,
  ): Promise<boolean> => {
    setIsSearching(true);
    try {
      const recordId = await searchFn();
      if (recordId) {
        navigate(ROUTES.NNA_DETAIL.replace(':id', recordId));
        return true;
      }
      return false;
    } finally {
      setIsSearching(false);
    }
  };

  return { isSearching, goToByIdUnico };
};
