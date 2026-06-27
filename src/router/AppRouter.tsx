import { lazy, Suspense } from 'react';
import { useTranslation } from 'react-i18next';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '@/components/layout/AppShell';
import { NnaWorkspaceLayout } from '@/components/layout/NnaWorkspaceLayout';
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
const NnaListEmptyPage = lazy(() =>
  import('@/modules/nna/NnaListEmptyPage').then((m) => ({
    default: m.NnaListEmptyPage,
  })),
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

const PageLoader = () => {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 bg-surface p-8">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary-200 border-t-primary-700" />
      <p className="text-base font-medium text-text-secondary">{t('router.loadingPage')}</p>
    </div>
  );
};

const NnaListRoute = () => (
  <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden xl:hidden">
      <NnaListPage />
    </div>
    <NnaListEmptyPage />
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
            <Route element={<AppShell />}>
              <Route path={ROUTES.PROFILE} element={<ProfilePage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute />}>
            <Route element={<AppShell />}>
              <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
              <Route element={<NnaWorkspaceLayout />}>
                <Route path={ROUTES.NNA_LIST} element={<NnaListRoute />} />
                <Route path={ROUTES.NNA_REGISTER} element={<NnaRegisterPage />} />
                <Route path={ROUTES.NNA_DETAIL} element={<NnaDetailPage />} />
                <Route path={ROUTES.NNA_TIMELINE} element={<NnaTimelinePage />} />
              </Route>
            </Route>
          </Route>

          <Route
            element={
              <ProtectedRoute allowedRoles={ADMIN_ROLES} requireActiveAccount />
            }
          >
            <Route element={<AppShell />}>
              <Route path={ROUTES.ADMIN_USERS} element={<AdminUsersPage />} />
            </Route>
          </Route>

          <Route element={<ProtectedRoute allowedRoles={LEGAL_CLOSURE_ROLES} />}>
            <Route element={<AppShell />}>
              <Route element={<NnaWorkspaceLayout />}>
                <Route
                  path={ROUTES.LEGAL_CLOSURE}
                  element={<LegalClosurePage />}
                />
              </Route>
            </Route>
          </Route>

          <Route path="*" element={<Navigate to={ROUTES.WELCOME} replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};
