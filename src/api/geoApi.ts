import { apiClient } from '@/api/client';
import type {
  GeoApiResponse,
  GeoCatalogData,
  GeoCitiesData,
  GeoCountriesData,
  GeoMunicipalitiesData,
  GeoParishesData,
  GeoQueryParams,
  GeoStatesData,
} from '@/api/geoTypes';
import { API_ENDPOINTS } from '@/constants/routes';

const buildGeoParams = (params?: GeoQueryParams) => {
  if (!params) return undefined;
  return {
    ...(params.search ? { search: params.search } : {}),
    ...(params.limit ? { limit: params.limit } : {}),
  };
};

export const fetchGeoCatalog = async (): Promise<GeoCatalogData> => {
  const { data } = await apiClient.get<GeoApiResponse<GeoCatalogData>>(
    API_ENDPOINTS.GEO,
  );
  return data.data;
};

export const fetchGeoCountries = async (): Promise<GeoCountriesData['items']> => {
  const { data } = await apiClient.get<GeoApiResponse<GeoCountriesData>>(
    API_ENDPOINTS.GEO_COUNTRIES,
  );
  return data.data.items;
};

export const fetchGeoStates = async (
  params?: GeoQueryParams,
): Promise<GeoStatesData> => {
  const { data } = await apiClient.get<GeoApiResponse<GeoStatesData>>(
    API_ENDPOINTS.GEO_STATES,
    { params: buildGeoParams(params) },
  );
  return data.data;
};

export const fetchGeoCitiesByState = async (
  stateId: string,
  params?: GeoQueryParams,
): Promise<GeoCitiesData> => {
  const { data } = await apiClient.get<GeoApiResponse<GeoCitiesData>>(
    API_ENDPOINTS.GEO_CITIES_BY_STATE(stateId),
    { params: buildGeoParams(params) },
  );
  return data.data;
};

export const fetchGeoMunicipalitiesByState = async (
  stateId: string,
  params?: GeoQueryParams,
): Promise<GeoMunicipalitiesData> => {
  const { data } = await apiClient.get<GeoApiResponse<GeoMunicipalitiesData>>(
    API_ENDPOINTS.GEO_MUNICIPALITIES_BY_STATE(stateId),
    { params: buildGeoParams(params) },
  );
  return data.data;
};

export const fetchGeoParishesByMunicipality = async (
  municipalityId: string,
  params?: GeoQueryParams,
): Promise<GeoParishesData> => {
  const { data } = await apiClient.get<GeoApiResponse<GeoParishesData>>(
    API_ENDPOINTS.GEO_PARISHES_BY_MUNICIPALITY(municipalityId),
    { params: buildGeoParams(params) },
  );
  return data.data;
};
