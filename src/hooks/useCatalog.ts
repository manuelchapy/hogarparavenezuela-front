import { useCallback } from 'react';
import type { CatalogDomain, CatalogItem } from '@/api/catalogTypes';
import type { CatalogKey } from '@/constants/catalogKeys';
import {
  getCatalogItems,
  getCatalogLabel,
  getCatalogOptions,
} from '@/services/catalogService';
import { useCatalogStore } from '@/store/catalogStore';

export const useCatalog = () => {
  const version = useCatalogStore((s) => s.version);
  const domains = useCatalogStore((s) => s.domains);
  const catalogByKey = useCatalogStore((s) => s.catalogByKey);
  const isLoaded = useCatalogStore((s) => s.isLoaded);
  const isLoading = useCatalogStore((s) => s.isLoading);
  const lastUpdatedAt = useCatalogStore((s) => s.lastUpdatedAt);
  const error = useCatalogStore((s) => s.error);
  const hydrateFromCache = useCatalogStore((s) => s.hydrateFromCache);
  const refreshFromNetwork = useCatalogStore((s) => s.refreshFromNetwork);

  const getCatalog = useCallback(
    (key: CatalogKey): CatalogDomain | undefined => catalogByKey[key],
    [catalogByKey],
  );

  const getItems = useCallback(
    (key: CatalogKey): CatalogItem[] => getCatalogItems(catalogByKey, key),
    [catalogByKey],
  );

  const getLabel = useCallback(
    (key: CatalogKey, code: string): string =>
      getCatalogLabel(catalogByKey, key, code),
    [catalogByKey],
  );

  const getOptions = useCallback(
    (key: CatalogKey) => getCatalogOptions(catalogByKey, key),
    [catalogByKey],
  );

  const refreshCatalog = useCallback(async () => {
    await refreshFromNetwork();
  }, [refreshFromNetwork]);

  return {
    version,
    domains,
    catalogByKey,
    isLoaded,
    isLoading,
    isReady: isLoaded && domains.length > 0,
    lastUpdatedAt,
    error,
    hydrateFromCache,
    refreshFromNetwork,
    refreshCatalog,
    getCatalog,
    getItems,
    getLabel,
    getOptions,
  };
};
