import { useTranslation } from 'react-i18next';
import { LocaleSwitcher } from '@/components/ui/LocaleSwitcher';
import {
  NetworkStatusInline,
  NetworkSyncToast,
} from '@/components/layout/NetworkStatusBar';

/** Barra superior de marca — solo móvil/tablet (< lg). En lg+ la identidad va en AppSidebar. */
export const AppTopBar = () => {
  const { t } = useTranslation();

  return (
    <header
      className={[
        'auth-hero shrink-0 border-b border-primary-900/40 lg:hidden',
        'pt-[max(0px,env(safe-area-inset-top))]',
      ].join(' ')}
      aria-label={t('layout.appTopBar')}
    >
      <div className="flex min-h-12 items-center justify-between gap-3 px-4 py-2">
        <div className="min-w-0 flex-1">
          <p className="truncate text-[10px] font-bold uppercase tracking-[0.12em] text-accent-400">
            {t('auth.country')}
          </p>
          <h1 className="truncate text-base font-bold leading-tight text-text-on-primary">
            {t('auth.appTitle')}
          </h1>
        </div>
        <LocaleSwitcher variant="onDark" />
      </div>
      <NetworkStatusInline />
      <NetworkSyncToast />
    </header>
  );
};
