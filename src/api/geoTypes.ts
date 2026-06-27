import type { ApiResponse } from '@/api/catalogTypes';

export interface GeoCountry {
  id: string;
  name: string;
  code: string;
}

export interface GeoStateItem {
  id: string;
  name: string;
  iso_31662: string;
  capital: string;
  id_estado: number;
}

export interface GeoCityItem {
  id: string;
  name: string;
}

export interface GeoMunicipalityItem {
  id: string;
  name: string;
  capital: string | null;
  id_estado: number;
}

export interface GeoParishItem {
  id: string;
  name: string;
}

export interface GeoQueryParams {
  search?: string;
  limit?: number;
}

export interface GeoCatalogData {
  defaultCountryCode: string;
  country: GeoCountry;
  routes: {
    states: string;
    citiesByState: string;
    municipalitiesByState: string;
    parishesByMunicipality: string;
  };
}

export interface GeoStatesData {
  country: GeoCountry;
  count: number;
  items: GeoStateItem[];
}

export interface GeoCitiesData {
  state: GeoStateItem;
  count: number;
  items: GeoCityItem[];
}

export interface GeoMunicipalitiesData {
  state: GeoStateItem;
  count: number;
  items: GeoMunicipalityItem[];
}

export interface GeoParishesData {
  municipality: GeoMunicipalityItem;
  count: number;
  items: GeoParishItem[];
}

export interface GeoCountriesData {
  items: GeoCountry[];
}

export interface UbicacionPayload {
  country?: string;
  state: string;
  city: string;
  municipality?: string;
  parish?: string;
}

export interface UbicacionEnriched {
  country: GeoCountry;
  state: Pick<GeoStateItem, 'id' | 'name' | 'iso_31662'>;
  city: GeoCityItem;
  municipality: GeoMunicipalityItem | null;
  parish: GeoParishItem | null;
  display: string;
}

export interface GeoListCache {
  id: string;
  items: unknown[];
  meta?: Record<string, unknown>;
  updatedAt: number;
}

export type GeoApiResponse<T> = ApiResponse<T>;
