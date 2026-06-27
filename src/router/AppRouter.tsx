import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute } from '@/router/ProtectedRoute';
import { ADMIN_ROLES, LEGAL_CLOSURE_ROLES } from '@/constants/roles';
import { ROUTES } from '@/constants/routes';

const WelcomePage = lazy(() =>
  import('@/modules/auth/WelcomePage').then((m) => ({
    default: m.WelcomePage,
  })),
);
const LoginPage = lazy(() =>
  import('@/modules/auth/LoginPage').then((m) => ({ default: m.LoginPage })),
);
const SolicitudPage = lazy(() =>
  import('@/modules/auth/SolicitudPage').then((m) => ({
    default: m.SolicitudPage,
  })),
);
const BootstrapAdminPage = lazy(() =>
  import('@/modules/auth/BootstrapAdminPage').then((m) => ({
    default: m.BootstrapAdminPage,
  })),
);
const ProfilePage = lazy(() =>
  import('@/modules/auth/ProfilePage').then((m) => ({ default: m.ProfilePage })),
);
const DashboardPage = lazy(() =>
  import('@/modules/dashboard/DashboardPage').then((m) => ({
    default: m.DashboardPage,
  })),
);
const AdminUsersPage = lazy(() =>
  import('@/modules/admin/AdminUsersPage').then((m) => ({
    default: m.AdminUsersPage,
  })),
);
const NnaListPage = lazy(() =>
  import('@/modules/nna/NnaListPage').then((m) => ({ default: m.NnaListPage })),
);
const NnaRegisterPage = lazy(() =>
  import('@/modules/nna/NnaRegisterPage').then((m) => ({
    default: m.NnaRegisterPage,
  })),
);
const NnaDetailPage = lazy(() =>
  import('@/modules/nna/NnaDetailPage').then((m) => ({
    default: m.NnaDetailPage,
  })),
);
const NnaTimelinePage = lazy(() =>
  import('@/modules/nna/NnaTimelinePage').then((m) => ({
    default: m.NnaTimelinePage,
  })),
);
const LegalClosurePage = lazy(() =>
  import('@/modules/nna/LegalClosurePage').then((m) => ({
    default: m.LegalClosurePage,
  })),
);

const PageLoader = () => (
  <div className="flex flex-1 items-center justify-center p-8">
    <p className="text-base text-text-secondary">Cargando...</p>
  </div>
);

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path={ROUTES.WELCOME} element={<WelcomePage />} />
          <Route
            path={ROUTES.LOGIN}
            element={<Navigate to={ROUTES.LOGIN_OPERATIVO} replace />}
          />
          <Route
            path={ROUTES.LOGIN_OPERATIVO}
            element={<LoginPage mode="operativo" />}
          />
          <Route
            path={ROUTES.LOGIN_ADMIN}
            element={<LoginPage mode="admin" />}
          />
          <Route path={ROUTES.SOLICITUD} element={<SolicitudPage />} />
          <Route path={ROUTES.BOOTSTRAP_ADMIN} element={<BootstrapAdminPage />} />

          <Route element={<ProtectedRoute requireActiveAccount={false} />}>
            <Route element={<AppLayout />}>
              <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<AppLayout />}>
              <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
              <Route path={ROUTES.NNA_LIST} element={<NnaListPage />} />
              <Route path={ROUTES.NNA_REGISTER} element={<NnaRegisterPage />} />
              <Route path={ROUTES.NNA_DETAIL} element={<NnaDetailPage />} />
              <Route path={ROUTES.NNA_TIMELINE} element={<NnaTimelinePage />} />
            </Route>
          </Route>

          <Route
            element={
              <ProtectedRoute allowedRoles={ADMIN_ROLES} requireActiveAccount />
            }
          >
            <Route element={<AppLayout />}>
              <Route path={ROUTES.ADMIN_USERS} element={<AdminUsersPage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={LEGAL_CLOSURE_ROLES} />}>
            <Route element={<AppLayout />}>
              <Route
                path={ROUTES.LEGAL_CLOSURE}
                element={<LegalClosurePage />}
              />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to={ROUTES.WELCOME} replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};
