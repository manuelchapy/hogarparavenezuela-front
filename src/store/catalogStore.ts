import { create } from 'zustand';
import type { CatalogDomain } from '@/api/catalogTypes';
import type { CatalogKey } from '@/constants/catalogKeys';
import {
  buildCatalogMap,
  fetchAndCacheCatalog,
  loadCatalogFromCache,
} from '@/services/catalogService';

interface CatalogState {
  version: string | null;
  domains: CatalogDomain[];
  catalogByKey: Partial<Record<CatalogKey, CatalogDomain>>;
  isLoaded: boolean;
  isLoading: boolean;
  lastUpdatedAt: number | null;
  error: string | null;
  hydrateFromCache: () => Promise<void>;
  refreshFromNetwork: () => Promise<void>;
}

const applyCatalogData = (
  data: { version: string; domains: CatalogDomain[] },
  updatedAt: number,
): Pick<
  CatalogState,
  'version' | 'domains' | 'catalogByKey' | 'isLoaded' | 'lastUpdatedAt'
> => ({
  version: data.version,
  domains: data.domains,
  catalogByKey: buildCatalogMap(data.domains),
  isLoaded: true,
  lastUpdatedAt: updatedAt,
});

export const useCatalogStore = create<CatalogState>((set, get) => ({
  version: null,
  domains: [],
  catalogByKey: {},
  isLoaded: false,
  isLoading: false,
  lastUpdatedAt: null,
  error: null,

  hydrateFromCache: async () => {
    if (get().isLoading) return;

    set({ isLoading: true, error: null });
    try {
      const cached = await loadCatalogFromCache();
      if (cached) {
        set(applyCatalogData(cached.data, cached.updatedAt));
      }
    } catch {
      set({ error: 'No se pudo cargar el catálogo local' });
    } finally {
      set({ isLoading: false });
    }
  },

  refreshFromNetwork: async () => {
    if (!navigator.onLine || get().isLoading) return;

    set({ isLoading: true, error: null });
    try {
      const data = await fetchAndCacheCatalog();
      if (data) {
        set(applyCatalogData(data, Date.now()));
      }
    } catch {
      set({ error: 'No se pudieron actualizar los catálogos' });
    } finally {
      set({ isLoading: false });
    }
  },
}));
