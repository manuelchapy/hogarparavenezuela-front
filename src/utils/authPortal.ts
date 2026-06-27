import type { AuthUser } from '@/api/authTypes';
import {
  ADMIN_ROLES,
  OPERATIVO_PORTAL_ROLES,
} from '@/constants/roles';
import { ROUTES } from '@/constants/routes';
import i18n from '@/i18n';

export type LoginMode = 'operativo' | 'admin';

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
    throw new Error(i18n.t('auth.portalMismatchAdmin'));
  }

  throw new Error(i18n.t('auth.portalMismatchRole'));
};

export const loginRedirectForMode = (mode: LoginMode): string =>
  mode === 'admin' ? ROUTES.LOGIN_ADMIN : ROUTES.LOGIN_OPERATIVO;
