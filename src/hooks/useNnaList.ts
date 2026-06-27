import { useCallback, useEffect, useState } from 'react';
import { fetchNnaList } from '@/api/nnaApi';
import type { NnaListItem, NnaStatus } from '@/api/nnaTypes';
import { searchNnaByIdUnico } from '@/services/nnaService';

const normalizeQuery = (value: string): string => value.trim().toLowerCase();

/** idUnico es sparse en el backend — algunos registros pueden no tenerlo aún. */
const getSearchableIds = (item: NnaListItem): string[] =>
  [item.idUnico, item.idOfflineFallback].filter(
    (id): id is string => typeof id === 'string' && id.length > 0,
  );

const matchesIdSearch = (item: NnaListItem, query: string): boolean => {
  if (!query) return true;
  const ids = getSearchableIds(item);
  return ids.some((id) => id.toLowerCase().includes(query));
};

interface UseNnaListOptions {
  status?: NnaStatus;
  stateId?: string;
  cityId?: string;
}

export const useNnaList = (options: UseNnaListOptions = {}) => {
  const [items, setItems] = useState<NnaListItem[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const load = useCallback(
    async (pageNum = 1, append = false) => {
      if (!navigator.onLine) {
        setError('Sin conexión — el listado requiere internet');
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchNnaList({
          page: pageNum,
          limit: 20,
          status: options.status,
          stateId: options.stateId,
          cityId: options.cityId,
        });
        setItems((prev) =>
          append ? [...prev, ...data.items] : data.items,
        );
        setPage(data.pagination.page);
        setHasNextPage(data.pagination.hasNextPage);
        setTotal(data.pagination.total);
      } catch {
        setError('No se pudo cargar el listado de NNA');
      } finally {
        setIsLoading(false);
      }
    },
    [options.status, options.stateId, options.cityId],
  );

  useEffect(() => {
    void load(1, false);
  }, [load]);

  const loadMore = () => {
    if (hasNextPage && !isLoading) void load(page + 1, true);
  };

  const filteredItems = searchQuery.trim()
    ? items.filter((item) =>
        matchesIdSearch(item, normalizeQuery(searchQuery)),
      )
    : items;

  const searchByIdUnico = async (): Promise<string | null> => {
    const query = normalizeQuery(searchQuery);
    if (!query) return null;

    const local = items.find((item) =>
      getSearchableIds(item).some((id) => id.toLowerCase() === query),
    );
    if (local) return local._id;

    if (!navigator.onLine) return null;
    const found = await searchNnaByIdUnico(query);
    return found?._id ?? null;
  };

  return {
    items: filteredItems,
    total,
    page,
    hasNextPage,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    reload: () => load(1, false),
    loadMore,
    searchByIdUnico,
  };
};
