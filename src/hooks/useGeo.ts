import { useCallback } from 'react';
import type {
  GeoCityItem,
  GeoMunicipalityItem,
  GeoParishItem,
  GeoStateItem,
} from '@/api/geoTypes';
import { useGeoStore } from '@/store/geoStore';

export const useGeo = () => {
  const defaultCountry = useGeoStore((s) => s.defaultCountry);
  const states = useGeoStore((s) => s.states);
  const citiesByState = useGeoStore((s) => s.citiesByState);
  const municipalitiesByState = useGeoStore((s) => s.municipalitiesByState);
  const parishesByMunicipality = useGeoStore((s) => s.parishesByMunicipality);
  const statesLoaded = useGeoStore((s) => s.statesLoaded);
  const loadingStates = useGeoStore((s) => s.loadingStates);
  const loadingCities = useGeoStore((s) => s.loadingCities);
  const loadingMunicipalities = useGeoStore((s) => s.loadingMunicipalities);
  const loadingParishes = useGeoStore((s) => s.loadingParishes);
  const error = useGeoStore((s) => s.error);
  const ensureStates = useGeoStore((s) => s.ensureStates);
  const ensureCities = useGeoStore((s) => s.ensureCities);
  const ensureMunicipalities = useGeoStore((s) => s.ensureMunicipalities);
  const ensureParishes = useGeoStore((s) => s.ensureParishes);
  const prefetchGeo = useGeoStore((s) => s.prefetchGeo);

  const getCities = useCallback(
    (stateId: string): GeoCityItem[] => citiesByState[stateId] ?? [],
    [citiesByState],
  );

  const getMunicipalities = useCallback(
    (stateId: string): GeoMunicipalityItem[] =>
      municipalitiesByState[stateId] ?? [],
    [municipalitiesByState],
  );

  const getParishes = useCallback(
    (municipalityId: string): GeoParishItem[] =>
      parishesByMunicipality[municipalityId] ?? [],
    [parishesByMunicipality],
  );

  const getStateById = useCallback(
    (stateId: string): GeoStateItem | undefined =>
      states.find((state) => state.id === stateId),
    [states],
  );

  return {
    defaultCountry,
    states,
    statesLoaded,
    isReady: statesLoaded && states.length > 0,
    loadingStates,
    loadingCities,
    loadingMunicipalities,
    loadingParishes,
    error,
    ensureStates,
    ensureCities,
    ensureMunicipalities,
    ensureParishes,
    prefetchGeo,
    getCities,
    getMunicipalities,
    getParishes,
    getStateById,
  };
};
