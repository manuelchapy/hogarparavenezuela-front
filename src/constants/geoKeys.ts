export const GEO_CACHE_KEYS = {
  META: 'meta',
  STATES: 'states',
  cities: (stateId: string) => `cities:${stateId}`,
  municipalities: (stateId: string) => `municipalities:${stateId}`,
  parishes: (municipalityId: string) => `parishes:${municipalityId}`,
} as const;

export const GEO_LIST_LIMIT = 200;

export const EMPTY_UBICACION = {
  state: '',
  city: '',
  municipality: '',
  parish: '',
} as const;
