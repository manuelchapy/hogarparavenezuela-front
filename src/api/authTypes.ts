import type { ApiResponse } from '@/api/catalogTypes';
import type { UbicacionEnriched, UbicacionPayload } from '@/api/geoTypes';
import type { UserRole } from '@/constants/roles';

export type AccountStatus =
  | 'PENDIENTE'
  | 'ACTIVO'
  | 'SUSPENDIDO'
  | 'RECHAZADO';

export interface AuthUser {
  id: string;
  nombreCompleto: string;
  cedula: string;
  telefono: string;
  rol: UserRole;
  institucionId: string | null;
  institucion: string | null;
  credencialOficialId: string | null;
  fotoCedulaUrl: string | null;
  fotoCredencialUrl: string | null;
  estadoCuenta: AccountStatus;
  activo: boolean;
  verificadoEn?: string | null;
  motivoRechazo?: string | null;
  ubicacion?: UbicacionEnriched | UbicacionPayload;
}

export interface LoginPayload {
  cedula: string;
  credencialOficialId?: string;
}

export interface LoginData {
  token: string;
  user: AuthUser;
}

export interface SolicitudPayload {
  nombreCompleto: string;
  cedula: string;
  telefono: string;
  rolSolicitado: UserRole;
  institucionId?: string;
  institucion?: string;
  credencialOficialId?: string;
  fotoCedulaUrl?: string;
  fotoCredencialUrl?: string;
  ubicacion: UbicacionPayload;
}

export interface SolicitudData {
  user: AuthUser;
  message: string;
}

export interface BootstrapAdminPayload {
  nombreCompleto: string;
  cedula: string;
  telefono: string;
  rol: 'ADMINISTRADOR';
  bootstrapSecret: string;
  credencialOficialId?: string;
  fotoCedulaUrl?: string;
  fotoCredencialUrl?: string;
  ubicacion: UbicacionPayload;
}

export interface UpdateProfilePayload {
  nombreCompleto?: string;
  telefono?: string;
  ubicacion?: UbicacionPayload;
}

export interface Institution {
  id: string;
  nombre: string;
  tipo: string;
  activa: boolean;
  rolesPermitidos?: UserRole[];
}

export interface AdminUserListQuery {
  page?: number;
  limit?: number;
  estadoCuenta?: AccountStatus;
  rol?: UserRole;
}

export interface AdminUserListData {
  items: AuthUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasNextPage: boolean;
  };
}

export interface RejectUserPayload {
  motivoRechazo: string;
}

export type AuthApiResponse<T> = ApiResponse<T>;
