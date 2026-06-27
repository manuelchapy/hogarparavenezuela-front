import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchNnaById } from '@/api/nnaApi';
import type { NnaRecord } from '@/api/nnaTypes';
import { ROUTES } from '@/constants/routes';

export const useNnaDetail = (id: string | undefined) => {
  const [nna, setNna] = useState<NnaRecord | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id || !navigator.onLine) {
      setError('Sin conexión — el detalle requiere internet');
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchNnaById(id);
      setNna(data);
    } catch {
      setError('No se encontró el registro NNA');
      setNna(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  return { nna, isLoading, error, load, setNna };
};

export const useNnaSearch = () => {
  const navigate = useNavigate();
  const [isSearching, setIsSearching] = useState(false);

  const goToByIdUnico = async (
    searchFn: () => Promise<string | null>,
  ): Promise<boolean> => {
    setIsSearching(true);
    try {
      const id = await searchFn();
      if (id) {
        navigate(ROUTES.NNA_DETAIL.replace(':id', id));
        return true;
      }
      return false;
    } finally {
      setIsSearching(false);
    }
  };

  return { isSearching, goToByIdUnico };
};
