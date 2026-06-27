import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';

const itemClass = ({ isActive }: { isActive: boolean }) =>
  [
    'flex min-h-12 min-w-12 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-2 text-[10px] font-bold uppercase tracking-wide',
    isActive ? 'text-primary-700' : 'text-text-muted',
  ].join(' ');

export const AppBottomNav = () => {
  const { t } = useTranslation();
  const { isAdmin } = useAuth();

  return (
    <nav
      data-app-bottom-nav
      className="flex shrink-0 gap-1 border-t border-border-subtle bg-surface-elevated px-2 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] lg:hidden"
      aria-label={t('layout.mainNav')}
    >
      <NavLink to={ROUTES.DASHBOARD} className={itemClass}>
        <span className="text-lg" aria-hidden>
          📊
        </span>
        {t('layout.navDashboardShort')}
      </NavLink>
      <NavLink to={ROUTES.NNA_LIST} className={itemClass}>
        <span className="text-lg" aria-hidden>
          📋
        </span>
        {t('layout.navNnaShort')}
      </NavLink>
      <NavLink to={ROUTES.PROFILE} className={itemClass}>
        <span className="text-lg" aria-hidden>
          👤
        </span>
        {t('layout.navProfileShort')}
      </NavLink>
      {isAdmin() && (
        <NavLink to={ROUTES.ADMIN_USERS} className={itemClass}>
          <span className="text-lg" aria-hidden>
            ⚙️
          </span>
          {t('layout.navAdminShort')}
        </NavLink>
      )}
    </nav>
  );
};
