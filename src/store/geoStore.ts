import { create } from 'zustand';
import type {
  GeoCityItem,
  GeoCountry,
  GeoMunicipalityItem,
  GeoParishItem,
  GeoStateItem,
} from '@/api/geoTypes';
import {
  getCitiesByState,
  getDefaultCountry,
  getMunicipalitiesByState,
  getParishesByMunicipality,
  getStates,
  prefetchStates,
} from '@/services/geoService';

interface GeoStoreState {
  defaultCountry: GeoCountry | null;
  states: GeoStateItem[];
  citiesByState: Record<string, GeoCityItem[]>;
  municipalitiesByState: Record<string, GeoMunicipalityItem[]>;
  parishesByMunicipality: Record<string, GeoParishItem[]>;
  statesLoaded: boolean;
  loadingStates: boolean;
  loadingCities: Record<string, boolean>;
  loadingMunicipalities: Record<string, boolean>;
  loadingParishes: Record<string, boolean>;
  error: string | null;
  ensureStates: () => Promise<void>;
  ensureCities: (stateId: string) => Promise<void>;
  ensureMunicipalities: (stateId: string) => Promise<void>;
  ensureParishes: (municipalityId: string) => Promise<void>;
  prefetchGeo: () => Promise<void>;
}

export const useGeoStore = create<GeoStoreState>((set, get) => ({
  defaultCountry: null,
  states: [],
  citiesByState: {},
  municipalitiesByState: {},
  parishesByMunicipality: {},
  statesLoaded: false,
  loadingStates: false,
  loadingCities: {},
  loadingMunicipalities: {},
  loadingParishes: {},
  error: null,

  ensureStates: async () => {
    if (get().loadingStates) return;

    set({ loadingStates: true, error: null });
    try {
      const [country, states] = await Promise.all([
        getDefaultCountry(),
        getStates(),
      ]);
      set({
        defaultCountry: country,
        states,
        statesLoaded: true,
      });
    } catch {
      set({ error: 'No se pudieron cargar los estados' });
    } finally {
      set({ loadingStates: false });
    }
  },

  ensureCities: async (stateId: string) => {
    if (!stateId || get().loadingCities[stateId]) return;

    set((prev) => ({
      loadingCities: { ...prev.loadingCities, [stateId]: true },
      error: null,
    }));

    try {
      const items = await getCitiesByState(stateId);
      set((prev) => ({
        citiesByState: { ...prev.citiesByState, [stateId]: items },
      }));
    } catch {
      set({ error: 'No se pudieron cargar las ciudades' });
    } finally {
      set((prev) => ({
        loadingCities: { ...prev.loadingCities, [stateId]: false },
      }));
    }
  },

  ensureMunicipalities: async (stateId: string) => {
    if (!stateId || get().loadingMunicipalities[stateId]) return;

    set((prev) => ({
      loadingMunicipalities: { ...prev.loadingMunicipalities, [stateId]: true },
      error: null,
    }));

    try {
      const items = await getMunicipalitiesByState(stateId);
      set((prev) => ({
        municipalitiesByState: {
          ...prev.municipalitiesByState,
          [stateId]: items,
        },
      }));
    } catch {
      set({ error: 'No se pudieron cargar los municipios' });
    } finally {
      set((prev) => ({
        loadingMunicipalities: {
          ...prev.loadingMunicipalities,
          [stateId]: false,
        },
      }));
    }
  },

  ensureParishes: async (municipalityId: string) => {
    if (!municipalityId || get().loadingParishes[municipalityId]) return;

    set((prev) => ({
      loadingParishes: { ...prev.loadingParishes, [municipalityId]: true },
      error: null,
    }));

    try {
      const items = await getParishesByMunicipality(municipalityId);
      set((prev) => ({
        parishesByMunicipality: {
          ...prev.parishesByMunicipality,
          [municipalityId]: items,
        },
      }));
    } catch {
      set({ error: 'No se pudieron cargar las parroquias' });
    } finally {
      set((prev) => ({
        loadingParishes: {
          ...prev.loadingParishes,
          [municipalityId]: false,
        },
      }));
    }
  },

  prefetchGeo: async () => {
    await prefetchStates();
    await get().ensureStates();
  },
}));
