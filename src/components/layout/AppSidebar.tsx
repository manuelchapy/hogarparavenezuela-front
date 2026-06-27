import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LocaleSwitcher } from '@/components/ui/LocaleSwitcher';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'flex min-h-12 items-center gap-3 rounded-xl px-4 text-base font-semibold transition-colors',
    isActive
      ? 'bg-primary-700 text-text-on-primary'
      : 'text-primary-100 hover:bg-primary-800/80',
  ].join(' ');

export const AppSidebar = () => {
  const { t } = useTranslation();
  const { user, isAdmin, clearAuth } = useAuth();

  return (
    <aside className="auth-hero flex w-64 shrink-0 flex-col border-r border-primary-900/40 xl:w-72">
      <div className="border-b border-primary-900/30 px-5 py-6">
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-accent-400">
          {t('auth.appTitle')}
        </p>
        <p className="mt-2 truncate text-sm font-medium text-primary-200">
          {user?.nombreCompleto}
        </p>
        <p className="truncate text-xs text-white">
          {user?.rol?.replace(/_/g, ' ')}
        </p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-4" aria-label={t('layout.mainNav')}>
        <NavLink to={ROUTES.DASHBOARD} className={navLinkClass}>
          <span aria-hidden>📊</span>
          {t('layout.navDashboard')}
        </NavLink>
        <NavLink to={ROUTES.NNA_LIST} className={navLinkClass}>
          <span aria-hidden>📋</span>
          {t('layout.navNna')}
        </NavLink>
        <NavLink to={ROUTES.PROFILE} className={navLinkClass}>
          <span aria-hidden>👤</span>
          {t('layout.navProfile')}
        </NavLink>
        {isAdmin() && (
          <NavLink to={ROUTES.ADMIN_USERS} className={navLinkClass}>
            <span aria-hidden>⚙️</span>
            {t('layout.navAdmin')}
          </NavLink>
        )}
      </nav>

      <div className="flex flex-col gap-3 border-t border-primary-900/30 p-4">
        <LocaleSwitcher variant="onDark" />
        <button
          type="button"
          onClick={clearAuth}
          className="min-h-12 rounded-xl px-4 text-left text-sm font-semibold text-primary-200 hover:bg-primary-800/80"
        >
          {t('common.logout')}
        </button>
      </div>
    </aside>
  );
};
