import type {
  CatalogDomain,
  CatalogFullData,
  CatalogSelectOption,
} from '@/api/catalogTypes';
import { fetchCatalogAll } from '@/api/catalogApi';
import type { CatalogKey } from '@/constants/catalogKeys';
import { db } from '@/services/db';

const CACHE_ID = 'all';

export const buildCatalogMap = (
  domains: CatalogDomain[],
): Record<CatalogKey, CatalogDomain> => {
  return domains.reduce(
    (acc, domain) => {
      acc[domain.key] = domain;
      return acc;
    },
    {} as Record<CatalogKey, CatalogDomain>,
  );
};

export const getCatalogItems = (
  catalogByKey: Partial<Record<CatalogKey, CatalogDomain>>,
  key: CatalogKey,
): CatalogDomain['items'] => {
  return catalogByKey[key]?.items ?? [];
};

export const getCatalogLabel = (
  catalogByKey: Partial<Record<CatalogKey, CatalogDomain>>,
  key: CatalogKey,
  code: string,
): string => {
  const item = catalogByKey[key]?.items.find((entry) => entry.code === code);
  return item?.label ?? code;
};

export const getCatalogOptions = (
  catalogByKey: Partial<Record<CatalogKey, CatalogDomain>>,
  key: CatalogKey,
): CatalogSelectOption[] => {
  return getCatalogItems(catalogByKey, key).map((item) => ({
    value: item.code,
    label: item.label,
    description: item.description,
  }));
};

export const getCachedCatalog = async () => {
  return db.catalog.get(CACHE_ID);
};

export const saveCatalogToCache = async (
  data: CatalogFullData,
): Promise<void> => {
  await db.catalog.put({
    id: CACHE_ID,
    data,
    updatedAt: Date.now(),
  });
};

export const fetchAndCacheCatalog = async (): Promise<CatalogFullData | null> => {
  if (!navigator.onLine) return null;

  const data = await fetchCatalogAll();
  await saveCatalogToCache(data);
  return data;
};

export const loadCatalogFromCache = async (): Promise<{
  data: CatalogFullData;
  updatedAt: number;
} | null> => {
  const cached = await getCachedCatalog();
  if (!cached) return null;
  return { data: cached.data, updatedAt: cached.updatedAt };
};
