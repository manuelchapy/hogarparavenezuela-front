import {
  bootstrapAdmin as bootstrapAdminApi,
  fetchProfile,
  getAuthErrorMessage,
  login as loginApi,
  submitSolicitud as submitSolicitudApi,
  updateProfile,
  uploadVerificationPhoto,
} from '@/api/authApi';
import type {
  AuthUser,
  BootstrapAdminPayload,
  LoginPayload,
  SolicitudPayload,
  UpdateProfilePayload,
} from '@/api/authTypes';
import { compressImage } from '@/services/imageCompression';
import type {
  BootstrapAdminForm,
  SolicitudForm,
} from '@/modules/auth/schemas/authSchemas';
import type { LoginMode } from '@/utils/authPortal';
import { assertLoginMatchesPortal } from '@/utils/authPortal';
import { buildUbicacionPayload } from '@/services/geoService';

export const loginUser = async (
  payload: LoginPayload,
  portal: LoginMode,
): Promise<{ user: AuthUser; token: string }> => {
  const result = await loginApi(payload);
  assertLoginMatchesPortal(portal, result.user);
  return result;
};

export const refreshProfile = async (): Promise<AuthUser> => {
  return fetchProfile();
};

export const updateUserProfile = async (
  payload: UpdateProfilePayload,
): Promise<AuthUser> => {
  return updateProfile(payload);
};

export const buildSolicitudPayload = (
  form: SolicitudForm,
  urls: { fotoCedulaUrl?: string; fotoCredencialUrl?: string },
): SolicitudPayload => {
  const ubicacion = buildUbicacionPayload({
    state: form.ubicacion.state,
    city: form.ubicacion.city,
    municipality: form.ubicacion.municipality || undefined,
    parish: form.ubicacion.parish || undefined,
  });

  if (!ubicacion) {
    throw new Error('Ubicación incompleta');
  }

  return {
    nombreCompleto: form.nombreCompleto.trim(),
    cedula: form.cedula.trim().toUpperCase(),
    telefono: form.telefono.trim(),
    rolSolicitado: form.rolSolicitado,
    ...(form.institucionId ? { institucionId: form.institucionId } : {}),
    ...(form.institucion?.trim() ? { institucion: form.institucion.trim() } : {}),
    ...(form.credencialOficialId?.trim()
      ? { credencialOficialId: form.credencialOficialId.trim() }
      : {}),
    ...(urls.fotoCedulaUrl ? { fotoCedulaUrl: urls.fotoCedulaUrl } : {}),
    ...(urls.fotoCredencialUrl ? { fotoCredencialUrl: urls.fotoCredencialUrl } : {}),
    ubicacion,
  };
};

export const submitSolicitudWithPhotos = async (
  form: SolicitudForm,
): Promise<{ user: AuthUser; message: string }> => {
  const cedula = form.cedula.trim().toUpperCase();
  const urls: { fotoCedulaUrl?: string; fotoCredencialUrl?: string } = {};

  if (form.hasCredencial) {
    if (!form.fotoCredencialFile) {
      throw new Error('Debes adjuntar foto de la credencial oficial');
    }
    const compressed = await compressImage(form.fotoCredencialFile);
    urls.fotoCredencialUrl = await uploadVerificationPhoto(
      compressed.file,
      cedula,
      'CREDENCIAL',
    );
  } else {
    if (!form.fotoCedulaFile) {
      throw new Error('Debes adjuntar foto de la cédula');
    }
    const compressed = await compressImage(form.fotoCedulaFile);
    urls.fotoCedulaUrl = await uploadVerificationPhoto(
      compressed.file,
      cedula,
      'CEDULA',
    );
  }

  const payload = buildSolicitudPayload(form, urls);
  return submitSolicitudApi(payload);
};

export const submitBootstrapAdminWithPhotos = async (
  form: BootstrapAdminForm,
): Promise<{ user: AuthUser; token: string }> => {
  const cedula = form.cedula.trim().toUpperCase();
  const urls: { fotoCedulaUrl?: string; fotoCredencialUrl?: string } = {};

  if (form.hasCredencial) {
    if (!form.fotoCredencialFile) {
      throw new Error('Debes adjuntar foto de la credencial oficial');
    }
    const compressed = await compressImage(form.fotoCredencialFile);
    urls.fotoCredencialUrl = await uploadVerificationPhoto(
      compressed.file,
      cedula,
      'CREDENCIAL',
    );
  } else {
    if (!form.fotoCedulaFile) {
      throw new Error('Debes adjuntar foto de la cédula');
    }
    const compressed = await compressImage(form.fotoCedulaFile);
    urls.fotoCedulaUrl = await uploadVerificationPhoto(
      compressed.file,
      cedula,
      'CEDULA',
    );
  }

  const ubicacion = buildUbicacionPayload({
    state: form.ubicacion.state,
    city: form.ubicacion.city,
    municipality: form.ubicacion.municipality || undefined,
    parish: form.ubicacion.parish || undefined,
  });

  if (!ubicacion) {
    throw new Error('Ubicación incompleta');
  }

  const payload: BootstrapAdminPayload = {
    nombreCompleto: form.nombreCompleto.trim(),
    cedula,
    telefono: form.telefono.trim(),
    rol: 'ADMINISTRADOR',
    bootstrapSecret: form.bootstrapSecret,
    ubicacion,
    ...(form.credencialOficialId?.trim()
      ? { credencialOficialId: form.credencialOficialId.trim() }
      : {}),
    ...(urls.fotoCedulaUrl ? { fotoCedulaUrl: urls.fotoCedulaUrl } : {}),
    ...(urls.fotoCredencialUrl ? { fotoCredencialUrl: urls.fotoCredencialUrl } : {}),
  };

  return bootstrapAdminApi(payload);
};

export { getAuthErrorMessage };
