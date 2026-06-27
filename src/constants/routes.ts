export const ROUTES = {
  WELCOME: '/',
  LOGIN: '/login',
  LOGIN_OPERATIVO: '/login/operativo',
  LOGIN_ADMIN: '/login/admin',
  SOLICITUD: '/solicitud',
  BOOTSTRAP_ADMIN: '/bootstrap-admin',
  DASHBOARD: '/panel',
  PROFILE: '/perfil',
  ADMIN_USERS: '/admin/usuarios',
  NNA_LIST: '/nna',
  NNA_REGISTER: '/nna/registrar',
  NNA_DETAIL: '/nna/:id',
  NNA_TIMELINE: '/nna/:id/timeline',
  LEGAL_CLOSURE: '/nna/:id/cierre-legal',
} as const;

export const API_ENDPOINTS = {
  LOGIN: '/auth/login',
  AUTH: '/auth',
  AUTH_SOLICITUD: '/auth/solicitud',
  AUTH_ME: '/auth/me',
  AUTH_BOOTSTRAP_ADMIN: '/auth/bootstrap-admin',
  AUTH_UPLOAD_VERIFICATION: '/auth/subir-verificacion',
  INSTITUTIONS: '/institutions',
  ADMIN_USERS: '/admin/usuarios',
  ADMIN_USER_APPROVE: (id: string) => `/admin/usuarios/${id}/aprobar`,
  ADMIN_USER_REJECT: (id: string) => `/admin/usuarios/${id}/rechazar`,
  CATALOG: '/catalog',
  CATALOG_ALL: '/catalog/all',
  CATALOG_BY_KEY: (key: string) => `/catalog/${key}`,
  GEO: '/geo',
  GEO_COUNTRIES: '/geo/countries',
  GEO_STATES: '/geo/states',
  GEO_CITIES_BY_STATE: (stateId: string) => `/geo/states/${stateId}/cities`,
  GEO_MUNICIPALITIES_BY_STATE: (stateId: string) =>
    `/geo/states/${stateId}/municipalities`,
  GEO_PARISHES_BY_MUNICIPALITY: (municipalityId: string) =>
    `/geo/municipalities/${municipalityId}/parishes`,
  NNA: '/nna',
  NNA_BY_ID: (id: string) => `/nna/${id}`,
  NNA_UPLOAD_PHOTO: '/nna/subir-foto',
  NNA_UBICACION: (id: string) => `/nna/${id}/ubicacion`,
  NNA_TIMELINE: (id: string) => `/nna/${id}/timeline`,
  NNA_LEGAL_CLOSURE: (id: string) => `/nna/${id}/cierre-legal`,
  NNA_ARCHIVOS: (id: string) => `/nna/${id}/archivos`,
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'hpv_auth_token',
} as const;

export const IMAGE_CONSTRAINTS = {
  MAX_SIZE_KB: 800,
  MAX_SIZE_BYTES: 800 * 1024,
  DEFAULT_QUALITY: 0.82,
  MAX_DIMENSION: 1920,
} as const;

export const OFFLINE_ID_PREFIX = 'idOfflineFallback';
