import { useAuthStore, isActiveAccount } from '@/store/authStore';
import { ADMIN_ROLES, LEGAL_CLOSURE_ROLES } from '@/constants/roles';
import type { UserRole } from '@/constants/roles';

export const useAuth = () => {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isHydrating = useAuthStore((s) => s.isHydrating);
  const setAuth = useAuthStore((s) => s.setAuth);
  const setUser = useAuthStore((s) => s.setUser);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const hydrateSession = useAuthStore((s) => s.hydrateSession);

  const hasRole = (roles: UserRole | UserRole[]) => {
    if (!user) return false;
    const allowed = Array.isArray(roles) ? roles : [roles];
    return allowed.includes(user.rol);
  };

  const isAdmin = () => hasRole(ADMIN_ROLES);
  const canAccessLegalClosure = () => hasRole(LEGAL_CLOSURE_ROLES);
  const canOperate = () => isActiveAccount(user);

  return {
    user,
    isAuthenticated,
    isHydrating,
    isActive: canOperate(),
    setAuth,
    setUser,
    clearAuth,
    hydrateSession,
    hasRole,
    isAdmin,
    canAccessLegalClosure,
    canOperate,
  };
};
