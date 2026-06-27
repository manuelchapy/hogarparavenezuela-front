import { API_ENDPOINTS, ROUTES } from '@/constants/routes';

/** Relación vista frontend ↔ endpoints API (API-ENDPOINTS.md). */
export interface ViewEndpointBinding {
  route: string;
  label: string;
  endpoints: {
    method: 'GET' | 'POST' | 'PATCH';
    path: string;
    note?: string;
  }[];
}

export const VIEW_ENDPOINT_MAP: ViewEndpointBinding[] = [
  {
    route: ROUTES.WELCOME,
    label: 'Bienvenida',
    endpoints: [],
  },
  {
    route: ROUTES.LOGIN_OPERATIVO,
    label: 'Login operativo',
    endpoints: [
      {
        method: 'POST',
        path: API_ENDPOINTS.LOGIN,
        note: 'Rescatista, PC, médico o CPNNA con cuenta ACTIVA',
      },
    ],
  },
  {
    route: ROUTES.SOLICITUD,
    label: 'Solicitud de acceso operativo',
    endpoints: [
      {
        method: 'POST',
        path: API_ENDPOINTS.AUTH_UPLOAD_VERIFICATION,
        note: 'Foto cédula o credencial (multipart)',
      },
      {
        method: 'POST',
        path: API_ENDPOINTS.AUTH_SOLICITUD,
        note: 'Alta pública → estadoCuenta PENDIENTE (202)',
      },
    ],
  },
  {
    route: ROUTES.LOGIN_ADMIN,
    label: 'Login administrador',
    endpoints: [
      {
        method: 'POST',
        path: API_ENDPOINTS.LOGIN,
        note: 'Solo rol ADMINISTRADOR con cuenta ACTIVA',
      },
    ],
  },
  {
    route: ROUTES.BOOTSTRAP_ADMIN,
    label: 'Registro primer administrador',
    endpoints: [
      {
        method: 'POST',
        path: API_ENDPOINTS.AUTH_UPLOAD_VERIFICATION,
        note: 'Foto cédula o credencial',
      },
      {
        method: 'POST',
        path: API_ENDPOINTS.AUTH_BOOTSTRAP_ADMIN,
        note: 'Una sola vez + bootstrapSecret (201)',
      },
    ],
  },
  {
    route: ROUTES.DASHBOARD,
    label: 'Panel',
    endpoints: [
      { method: 'GET', path: API_ENDPOINTS.AUTH_ME },
      { method: 'GET', path: API_ENDPOINTS.CATALOG_ALL },
      { method: 'GET', path: API_ENDPOINTS.GEO_STATES },
    ],
  },
  {
    route: ROUTES.PROFILE,
    label: 'Mi perfil',
    endpoints: [
      { method: 'GET', path: API_ENDPOINTS.AUTH_ME },
      { method: 'PATCH', path: API_ENDPOINTS.AUTH_ME },
    ],
  },
  {
    route: ROUTES.ADMIN_USERS,
    label: 'Admin — usuarios',
    endpoints: [
      { method: 'GET', path: API_ENDPOINTS.ADMIN_USERS },
      { method: 'PATCH', path: '/admin/usuarios/:id/aprobar' },
      { method: 'PATCH', path: '/admin/usuarios/:id/rechazar' },
    ],
  },
  {
    route: ROUTES.NNA_LIST,
    label: 'Listado NNA',
    endpoints: [{ method: 'GET', path: API_ENDPOINTS.NNA }],
  },
  {
    route: ROUTES.NNA_REGISTER,
    label: 'Registrar NNA',
    endpoints: [
      { method: 'POST', path: API_ENDPOINTS.NNA_UPLOAD_PHOTO },
      { method: 'POST', path: API_ENDPOINTS.NNA },
    ],
  },
  {
    route: ROUTES.NNA_DETAIL,
    label: 'Detalle NNA',
    endpoints: [{ method: 'GET', path: '/nna/:id' }],
  },
  {
    route: ROUTES.NNA_TIMELINE,
    label: 'Timeline NNA',
    endpoints: [{ method: 'PATCH', path: '/nna/:id/timeline' }],
  },
  {
    route: ROUTES.LEGAL_CLOSURE,
    label: 'Cierre legal',
    endpoints: [
      { method: 'POST', path: '/nna/:id/archivos', note: 'Acta escaneada' },
      { method: 'POST', path: '/nna/:id/cierre-legal' },
    ],
  },
];

export const getViewEndpoints = (route: string): ViewEndpointBinding | undefined =>
  VIEW_ENDPOINT_MAP.find((entry) => entry.route === route);
