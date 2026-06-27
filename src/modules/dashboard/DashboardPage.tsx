import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageFrame } from '@/components/layout/PageFrame';
import { PageHeader } from '@/components/layout/PageHeader';
import { ResponsiveActionBar } from '@/components/layout/StickyActionBar';
import { AlertBanner } from '@/components/ui/AlertBanner';
import { Button } from '@/components/ui/Button';
import { LopnnaLegalNotice } from '@/components/ui/LopnnaLegalNotice';
import { NavTile } from '@/components/ui/NavTile';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { useCatalog } from '@/hooks/useCatalog';
import { useGeo } from '@/hooks/useGeo';
import { useNetwork } from '@/hooks/useNetwork';

export const DashboardPage = () => {
  const { t } = useTranslation();
  const { user, isAdmin } = useAuth();
  const { isOnline } = useNetwork();
  const { isReady, isLoading, error, refreshCatalog } = useCatalog();
  const { statesLoaded, loadingStates, prefetchGeo } = useGeo();

  const referencesOk = isReady && !isLoading;
  const geoOk = statesLoaded && !loadingStates;
  const isRefreshing = isLoading || loadingStates;

  const referencesStatus = isLoading
    ? t('dashboard.referencesUpdating')
    : isReady
      ? t('dashboard.referencesReady')
      : t('dashboard.referencesUnavailable');

  const geoStatus = loadingStates
    ? t('dashboard.geoLoading')
    : statesLoaded
      ? t('dashboard.geoReady')
      : t('dashboard.geoUnavailable');

  const handleRefreshReferences = async () => {
    await refreshCatalog();
    await prefetchGeo();
  };

  return (
    <PageFrame
      header={
        <PageHeader
          title={user?.nombreCompleto ?? t('dashboard.title')}
          subtitle={`${t('common.role')}: ${user?.rol?.replace(/_/g, ' ') ?? '—'}${user?.institucion ? ` · ${user.institucion}` : ''}`}
        />
      }
      scrollClassName="page-section"
    >
      <div className="page-grid">
          <SurfaceCard title={t('dashboard.operationalStatusTitle')}>
            <dl className="space-y-3 text-base">
              <div className="flex justify-between gap-4 border-b border-border-subtle pb-2">
                <dt className="text-text-secondary">{t('dashboard.referencesLabel')}</dt>
                <dd className="font-semibold text-text-primary">{referencesStatus}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-text-secondary">{t('dashboard.geoLabel')}</dt>
                <dd className="font-semibold text-text-primary">{geoStatus}</dd>
              </div>
            </dl>
            {error && (
              <AlertBanner tone="error" className="mt-4">
                {error}
              </AlertBanner>
            )}
            {isOnline && (!referencesOk || !geoOk) && (
              <Button
                variant="secondary"
                className="mt-4 w-full"
                isLoading={isRefreshing}
                disabled={isRefreshing}
                onClick={() => void handleRefreshReferences()}
              >
                {t('dashboard.refreshReferences')}
              </Button>
            )}
          </SurfaceCard>

          <NavTile
            to={ROUTES.NNA_LIST}
            icon="📋"
            title={t('dashboard.nnaCardsTitle')}
            description={t('dashboard.nnaCardsHint')}
            accent
          />

          <NavTile
            to={ROUTES.PROFILE}
            icon="👤"
            title={t('dashboard.profileTitle')}
            description={t('dashboard.profileHint')}
          />

          {isAdmin() && (
            <NavTile
              to={ROUTES.ADMIN_USERS}
              icon="⚙️"
              title={t('dashboard.adminTitle')}
              description={t('dashboard.adminHint')}
            />
          )}

          <div className="page-grid-span-full">
            <LopnnaLegalNotice variant="compact" />
          </div>
        </div>

        <ResponsiveActionBar>
          <Link to={ROUTES.NNA_REGISTER} className="block w-full lg:w-auto lg:min-w-[14rem]">
            <Button className="w-full" variant="accent">
              {t('dashboard.registerNna')}
            </Button>
          </Link>
        </ResponsiveActionBar>
    </PageFrame>
  );
};
