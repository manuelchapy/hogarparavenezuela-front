import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';
import type { UserRole } from '@/constants/roles';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
  requireActiveAccount?: boolean;
}

export const ProtectedRoute = ({
  allowedRoles,
  requireActiveAccount = true,
}: ProtectedRouteProps) => {
  const { isAuthenticated, isHydrating, user, canOperate } = useAuth();

  if (isHydrating) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <p className="text-base text-text-secondary">Verificando sesión...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.WELCOME} replace />;
  }

  if (requireActiveAccount && !canOperate()) {
    return (
      <Navigate
        to={ROUTES.LOGIN_OPERATIVO}
        replace
        state={{ accountBlocked: true }}
      />
    );
  }

  if (allowedRoles && user && !allowedRoles.includes(user.rol)) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <Outlet />;
};
