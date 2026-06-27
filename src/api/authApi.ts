import { apiClient } from '@/api/client';
import type { ApiResponse } from '@/api/catalogTypes';
import type {
  AdminUserListData,
  AdminUserListQuery,
  AuthUser,
  Institution,
  BootstrapAdminPayload,
  LoginData,
  LoginPayload,
  RejectUserPayload,
  SolicitudData,
  SolicitudPayload,
  UpdateProfilePayload,
} from '@/api/authTypes';
import { API_ENDPOINTS } from '@/constants/routes';

export const login = async (payload: LoginPayload): Promise<LoginData> => {
  const { data } = await apiClient.post<ApiResponse<LoginData>>(
    API_ENDPOINTS.LOGIN,
    payload,
  );
  return data.data;
};

export const fetchProfile = async (): Promise<AuthUser> => {
  const { data } = await apiClient.get<ApiResponse<{ user: AuthUser }>>(
    API_ENDPOINTS.AUTH_ME,
  );
  return data.data.user;
};

export const updateProfile = async (
  payload: UpdateProfilePayload,
): Promise<AuthUser> => {
  const { data } = await apiClient.patch<ApiResponse<{ user: AuthUser }>>(
    API_ENDPOINTS.AUTH_ME,
    payload,
  );
  return data.data.user;
};

export const bootstrapAdmin = async (
  payload: BootstrapAdminPayload,
): Promise<LoginData> => {
  const { data } = await apiClient.post<ApiResponse<LoginData>>(
    API_ENDPOINTS.AUTH_BOOTSTRAP_ADMIN,
    payload,
  );
  return data.data;
};

export const submitSolicitud = async (
  payload: SolicitudPayload,
): Promise<SolicitudData> => {
  const { data } = await apiClient.post<ApiResponse<SolicitudData>>(
    API_ENDPOINTS.AUTH_SOLICITUD,
    payload,
  );
  return data.data;
};

export const uploadVerificationPhoto = async (
  file: File,
  cedula: string,
  tipo: 'CEDULA' | 'CREDENCIAL',
): Promise<string> => {
  const formData = new FormData();
  formData.append('archivo', file);
  formData.append('cedula', cedula);
  formData.append('tipo', tipo);

  const { data } = await apiClient.post<ApiResponse<{ url: string }>>(
    API_ENDPOINTS.AUTH_UPLOAD_VERIFICATION,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return data.data.url;
};

export const fetchInstitutions = async (): Promise<Institution[]> => {
  const { data } = await apiClient.get<
    ApiResponse<{ count: number; items: Institution[] }>
  >(API_ENDPOINTS.INSTITUTIONS);
  return data.data.items;
};

export const fetchAdminUsers = async (
  query: AdminUserListQuery = {},
): Promise<AdminUserListData> => {
  const { data } = await apiClient.get<ApiResponse<AdminUserListData>>(
    API_ENDPOINTS.ADMIN_USERS,
    { params: query },
  );
  return data.data;
};

export const approveUser = async (userId: string): Promise<AuthUser> => {
  const { data } = await apiClient.patch<ApiResponse<{ user: AuthUser }>>(
    API_ENDPOINTS.ADMIN_USER_APPROVE(userId),
  );
  return data.data.user;
};

export const rejectUser = async (
  userId: string,
  payload: RejectUserPayload,
): Promise<AuthUser> => {
  const { data } = await apiClient.patch<ApiResponse<{ user: AuthUser }>>(
    API_ENDPOINTS.ADMIN_USER_REJECT(userId),
    payload,
  );
  return data.data.user;
};

export const getAuthErrorMessage = (error: unknown): string => {
  if (
    typeof error === 'object' &&
    error !== null &&
    'response' in error
  ) {
    const response = (error as {
      response?: {
        status?: number;
        data?: { message?: string; data?: { errors?: unknown } };
      };
    }).response;

    const message = response?.data?.message;
    if (typeof message === 'string' && message.length > 0) {
      if (
        response?.status === 403 &&
        message.toLowerCase().includes('revisión institucional')
      ) {
        return `${message} Si acabas de enviar tu solicitud (POST /api/auth/solicitud), un administrador debe aprobarla antes de que puedas iniciar sesión aquí.`;
      }
      return message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return 'Error de conexión con el servidor. Verifica que el backend esté en http://localhost:4000 y que VITE_API_BASE_URL=/api';
};
