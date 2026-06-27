export const CATALOG_KEYS = {
  NNA_STATUS: 'nna-status',
  TIMELINE_EVENTS: 'timeline-events',
  ESTADO_SALUD: 'estado-salud',
  ROLES: 'roles',
  ACCOUNT_STATUS: 'account-status',
  INSTITUTION_TYPES: 'institution-types',
  ENTIDAD_ATENCION_TYPES: 'entidad-atencion-types',
  EDAD_APARENTE: 'edad-aparente',
  SEXO_NNA: 'sexo-nna',
} as const;

export type CatalogKey = (typeof CATALOG_KEYS)[keyof typeof CATALOG_KEYS];

export const ALL_CATALOG_KEYS: CatalogKey[] = Object.values(CATALOG_KEYS);
