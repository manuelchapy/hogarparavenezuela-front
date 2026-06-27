import { useCallback, useEffect, useMemo } from 'react';
import type { UbicacionPayload } from '@/api/geoTypes';
import { EMPTY_UBICACION } from '@/constants/geoKeys';
import { useGeo } from '@/hooks/useGeo';
import {
  buildUbicacionPayload,
  isUbicacionComplete,
} from '@/services/geoService';

export interface UbicacionFormValue {
  state: string;
  city: string;
  municipality: string;
  parish: string;
}

interface UseUbicacionFormOptions {
  value?: UbicacionFormValue;
  onChange?: (value: UbicacionFormValue) => void;
  includeMunicipalityParish?: boolean;
}

export const useUbicacionForm = ({
  value,
  onChange,
  includeMunicipalityParish = true,
}: UseUbicacionFormOptions = {}) => {
  const {
    states,
    statesLoaded,
    loadingStates,
    loadingCities,
    loadingMunicipalities,
    loadingParishes,
    ensureStates,
    ensureCities,
    ensureMunicipalities,
    ensureParishes,
    getCities,
    getMunicipalities,
    getParishes,
    getStateById,
    defaultCountry,
  } = useGeo();

  const ubicacion = value ?? EMPTY_UBICACION;

  const setUbicacion = useCallback(
    (patch: Partial<UbicacionFormValue>) => {
      if (!onChange) return;
      onChange({ ...ubicacion, ...patch });
    },
    [onChange, ubicacion],
  );

  useEffect(() => {
    void ensureStates();
  }, [ensureStates]);

  useEffect(() => {
    if (!ubicacion.state) return;
    void ensureCities(ubicacion.state);
    if (includeMunicipalityParish) {
      void ensureMunicipalities(ubicacion.state);
    }
  }, [
    ubicacion.state,
    ensureCities,
    ensureMunicipalities,
    includeMunicipalityParish,
  ]);

  useEffect(() => {
    if (!includeMunicipalityParish || !ubicacion.municipality) return;
    void ensureParishes(ubicacion.municipality);
  }, [
    ubicacion.municipality,
    ensureParishes,
    includeMunicipalityParish,
  ]);

  const setState = useCallback(
    (stateId: string) => {
      setUbicacion({
        state: stateId,
        city: '',
        municipality: '',
        parish: '',
      });
    },
    [setUbicacion],
  );

  const setCity = useCallback(
    (cityId: string) => {
      setUbicacion({ city: cityId });
    },
    [setUbicacion],
  );

  const setMunicipality = useCallback(
    (municipalityId: string) => {
      setUbicacion({ municipality: municipalityId, parish: '' });
    },
    [setUbicacion],
  );

  const setParish = useCallback(
    (parishId: string) => {
      setUbicacion({ parish: parishId });
    },
    [setUbicacion],
  );

  const cities = useMemo(
    () => getCities(ubicacion.state),
    [getCities, ubicacion.state],
  );

  const municipalities = useMemo(
    () => getMunicipalities(ubicacion.state),
    [getMunicipalities, ubicacion.state],
  );

  const parishes = useMemo(
    () => getParishes(ubicacion.municipality),
    [getParishes, ubicacion.municipality],
  );

  const toPayload = useCallback((): UbicacionPayload | null => {
    return buildUbicacionPayload({
      state: ubicacion.state,
      city: ubicacion.city,
      municipality: ubicacion.municipality || undefined,
      parish: ubicacion.parish || undefined,
      countryId: defaultCountry?.id,
    });
  }, [ubicacion, defaultCountry?.id]);

  const isValid = isUbicacionComplete(ubicacion);

  const selectedState = getStateById(ubicacion.state);
  const selectedCity = cities.find((city) => city.id === ubicacion.city);
  const selectedMunicipality = municipalities.find(
    (item) => item.id === ubicacion.municipality,
  );
  const selectedParish = parishes.find(
    (item) => item.id === ubicacion.parish,
  );

  const displayPreview = [
    selectedParish?.name,
    selectedMunicipality?.name,
    selectedCity?.name,
    selectedState?.name,
    defaultCountry?.name ?? 'Venezuela',
  ]
    .filter(Boolean)
    .join(', ');

  return {
    ubicacion,
    states,
    cities,
    municipalities,
    parishes,
    statesLoaded,
    loadingStates,
    isCityLoading: Boolean(loadingCities[ubicacion.state]),
    isMunicipalityLoading: Boolean(loadingMunicipalities[ubicacion.state]),
    isParishLoading: Boolean(loadingParishes[ubicacion.municipality]),
    setState,
    setCity,
    setMunicipality,
    setParish,
    toPayload,
    isValid,
    displayPreview,
    includeMunicipalityParish,
  };
};
