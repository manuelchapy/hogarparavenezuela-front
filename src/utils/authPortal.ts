import type { AuthUser } from '@/api/authTypes';
import {
  ADMIN_ROLES,
  OPERATIVO_PORTAL_ROLES,
  type UserRole,
} from '@/constants/roles';
import { ROUTES } from '@/constants/routes';
import type { LoginMode } from '@/constants/authPortals';

const roleLabel = (rol: UserRole): string => rol.replace(/_/g, ' ').toLowerCase();

export const assertLoginMatchesPortal = (
  mode: LoginMode,
  user: AuthUser,
): void => {
  const allowedRoles =
    mode === 'admin' ? ADMIN_ROLES : OPERATIVO_PORTAL_ROLES;

  if (allowedRoles.includes(user.rol)) {
    return;
  }

  if (mode === 'operativo' && ADMIN_ROLES.includes(user.rol)) {
    throw new Error(
      `La cédula ${user.cedula} corresponde a un administrador. Usa «Acceso administrador» en la pantalla de inicio.`,
    );
  }

  throw new Error(
    `La cédula ${user.cedula} tiene rol ${roleLabel(user.rol)}. Este acceso es solo para ${mode === 'admin' ? 'administradores' : 'operadores de campo (rescatista, protección civil, médico o CPNNA)'}.`,
  );
};

export const loginRedirectForMode = (mode: LoginMode): string =>
  mode === 'admin' ? ROUTES.LOGIN_ADMIN : ROUTES.LOGIN_OPERATIVO;
