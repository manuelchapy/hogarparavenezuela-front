import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { fetchNnaList } from '@/api/nnaApi';
import type { NnaListItem, NnaStatus, PendingNnaCreate } from '@/api/nnaTypes';
import {
  listCachedNnaItems,
  searchCachedNnaById,
  upsertNnaListItems,
} from '@/services/nnaCacheService';
import { listPendingNnaCreates, searchNnaByIdUnico } from '@/services/nnaService';
import { useSyncStore } from '@/store/syncStore';

const normalizeQuery = (value: string): string => value.trim().toLowerCase();

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
  const { t } = useTranslation();
  const pendingCount = useSyncStore((s) => s.pendingCount);
  const [items, setItems] = useState<NnaListItem[]>([]);
  const [pendingCreates, setPendingCreates] = useState<PendingNnaCreate[]>([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFromCache, setIsFromCache] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const reloadPending = useCallback(async () => {
    const pending = await listPendingNnaCreates();
    setPendingCreates(pending);
  }, []);

  const loadFromCache = useCallback(async () => {
    const cached = await listCachedNnaItems({ status: options.status });
    setItems(cached);
    setPage(1);
    setHasNextPage(false);
    setTotal(cached.length);
    setIsFromCache(true);
    if (cached.length === 0) {
      setError(t('nna.listCacheEmpty'));
    } else {
      setError(null);
    }
  }, [options.status, t]);

  const load = useCallback(
    async (pageNum = 1, append = false) => {
      if (!navigator.onLine) {
        await loadFromCache();
        return;
      }

      setIsLoading(true);
      setError(null);
      setIsFromCache(false);
      try {
        const data = await fetchNnaList({
          page: pageNum,
          limit: 20,
          status: options.status,
          stateId: options.stateId,
          cityId: options.cityId,
        });
        await upsertNnaListItems(data.items);
        setItems((prev) =>
          append ? [...prev, ...data.items] : data.items,
        );
        setPage(data.pagination.page);
        setHasNextPage(data.pagination.hasNextPage);
        setTotal(data.pagination.total);
      } catch {
        await loadFromCache();
      } finally {
        setIsLoading(false);
      }
    },
    [options.status, options.stateId, options.cityId, loadFromCache],
  );

  useEffect(() => {
    void load(1, false);
  }, [load]);

  useEffect(() => {
    void reloadPending();
  }, [reloadPending, pendingCount]);

  const loadMore = () => {
    if (hasNextPage && !isLoading && !isFromCache) void load(page + 1, true);
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

    if (!navigator.onLine) {
      const cached = await searchCachedNnaById(query);
      return cached?._id ?? null;
    }

    const found = await searchNnaByIdUnico(query);
    return found?._id ?? null;
  };

  return {
    items: filteredItems,
    pendingCreates,
    total,
    page,
    hasNextPage,
    isLoading,
    isFromCache,
    error,
    searchQuery,
    setSearchQuery,
    reload: () => load(1, false),
    loadMore,
    searchByIdUnico,
  };
};
