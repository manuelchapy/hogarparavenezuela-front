import {
  fetchGeoCatalog,
  fetchGeoCitiesByState,
  fetchGeoMunicipalitiesByState,
  fetchGeoParishesByMunicipality,
  fetchGeoStates,
} from '@/api/geoApi';
import type {
  GeoCityItem,
  GeoCountry,
  GeoMunicipalityItem,
  GeoParishItem,
  GeoStateItem,
  UbicacionPayload,
} from '@/api/geoTypes';
import { GEO_CACHE_KEYS, GEO_LIST_LIMIT } from '@/constants/geoKeys';
import { db } from '@/services/db';

const saveGeoCache = async (
  id: string,
  items: unknown[],
  meta?: Record<string, unknown>,
): Promise<void> => {
  await db.geoCache.put({ id, items, meta, updatedAt: Date.now() });
};

const loadGeoCache = async <T>(id: string): Promise<T[] | null> => {
  const cached = await db.geoCache.get(id);
  return cached ? (cached.items as T[]) : null;
};

const loadGeoCacheMeta = async (
  id: string,
): Promise<Record<string, unknown> | null> => {
  const cached = await db.geoCache.get(id);
  return cached?.meta ?? null;
};

const fetchOrCache = async <T>(
  cacheId: string,
  fetcher: () => Promise<{ items: T[]; meta?: Record<string, unknown> }>,
): Promise<T[]> => {
  const cached = await loadGeoCache<T>(cacheId);
  if (cached && cached.length > 0) {
    if (navigator.onLine) {
      void fetcher()
        .then(({ items, meta }) => saveGeoCache(cacheId, items, meta))
        .catch(() => undefined);
    }
    return cached;
  }

  if (!navigator.onLine) return [];

  const { items, meta } = await fetcher();
  await saveGeoCache(cacheId, items, meta);
  return items;
};

export const getDefaultCountry = async (): Promise<GeoCountry | null> => {
  const meta = await loadGeoCacheMeta(GEO_CACHE_KEYS.META);
  if (meta?.country) return meta.country as GeoCountry;

  if (!navigator.onLine) return null;

  const catalog = await fetchGeoCatalog();
  await saveGeoCache(GEO_CACHE_KEYS.META, [], {
    country: catalog.country,
    defaultCountryCode: catalog.defaultCountryCode,
  });
  return catalog.country;
};

export const getStates = async (): Promise<GeoStateItem[]> => {
  return fetchOrCache<GeoStateItem>(GEO_CACHE_KEYS.STATES, async () => {
    const data = await fetchGeoStates({ limit: GEO_LIST_LIMIT });
    return {
      items: data.items,
      meta: { country: data.country, count: data.count },
    };
  });
};

export const getCitiesByState = async (
  stateId: string,
): Promise<GeoCityItem[]> => {
  if (!stateId) return [];

  return fetchOrCache<GeoCityItem>(GEO_CACHE_KEYS.cities(stateId), async () => {
    const data = await fetchGeoCitiesByState(stateId, {
      limit: GEO_LIST_LIMIT,
    });
    return {
      items: data.items,
      meta: { state: data.state, count: data.count },
    };
  });
};

export const getMunicipalitiesByState = async (
  stateId: string,
): Promise<GeoMunicipalityItem[]> => {
  if (!stateId) return [];

  return fetchOrCache<GeoMunicipalityItem>(
    GEO_CACHE_KEYS.municipalities(stateId),
    async () => {
      const data = await fetchGeoMunicipalitiesByState(stateId, {
        limit: GEO_LIST_LIMIT,
      });
      return {
        items: data.items,
        meta: { state: data.state, count: data.count },
      };
    },
  );
};

export const getParishesByMunicipality = async (
  municipalityId: string,
): Promise<GeoParishItem[]> => {
  if (!municipalityId) return [];

  return fetchOrCache<GeoParishItem>(
    GEO_CACHE_KEYS.parishes(municipalityId),
    async () => {
      const data = await fetchGeoParishesByMunicipality(municipalityId, {
        limit: GEO_LIST_LIMIT,
      });
      return {
        items: data.items,
        meta: { municipality: data.municipality, count: data.count },
      };
    },
  );
};

export const prefetchStates = async (): Promise<void> => {
  await getStates();
  await getDefaultCountry();
};

export const buildUbicacionPayload = (input: {
  state: string;
  city: string;
  municipality?: string;
  parish?: string;
  countryId?: string;
}): UbicacionPayload | null => {
  if (!input.state || !input.city) return null;

  const payload: UbicacionPayload = {
    state: input.state,
    city: input.city,
  };

  if (input.countryId) payload.country = input.countryId;
  if (input.municipality) payload.municipality = input.municipality;
  if (input.parish && input.municipality) payload.parish = input.parish;

  return payload;
};

export const isUbicacionComplete = (input: {
  state: string;
  city: string;
}): boolean => Boolean(input.state && input.city);

export const getGeoCacheUpdatedAt = async (
  cacheId: string,
): Promise<number | null> => {
  const cached = await db.geoCache.get(cacheId);
  return cached?.updatedAt ?? null;
};
