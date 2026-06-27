import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageFrame } from '@/components/layout/PageFrame';
import { PageHeader } from '@/components/layout/PageHeader';
import { ResponsiveActionBar } from '@/components/layout/StickyActionBar';
import { AlertBanner } from '@/components/ui/AlertBanner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CatalogSelect } from '@/components/ui/CatalogSelect';
import { NnaCard } from '@/modules/nna/components/NnaCard';
import { CATALOG_KEYS } from '@/constants/catalogKeys';
import type { NnaStatus } from '@/api/nnaTypes';
import { ROUTES } from '@/constants/routes';
import { useNnaList } from '@/hooks/useNnaList';
import { useNnaSearch } from '@/hooks/useNnaDetail';
import { PendingNnaCard } from '@/modules/nna/components/PendingNnaCard';

/** Listado NNA pantalla completa — solo móvil/tablet (< xl). */
export const NnaListPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const [statusFilter, setStatusFilter] = useState<NnaStatus | ''>('');
  const [searchError, setSearchError] = useState<string | null>(null);
  const {
    items,
    pendingCreates,
    isLoading,
    isFromCache,
    error,
    searchQuery,
    setSearchQuery,
    reload,
    loadMore,
    hasNextPage,
    searchByIdUnico,
  } = useNnaList({ status: statusFilter || undefined });
  const { isSearching, goToByIdUnico } = useNnaSearch();
  const flashMessage = (location.state as { message?: string } | null)?.message;

  const handleSearch = async () => {
    setSearchError(null);
    const found = await goToByIdUnico(searchByIdUnico);
    if (!found && searchQuery.trim()) {
      setSearchError(t('nna.notFoundById'));
    }
  };

  const pendingLabel =
    pendingCreates.length > 0
      ? ` · ${t('nna.pendingLocal', { count: pendingCreates.length })}`
      : '';

  return (
    <PageFrame
      header={
        <PageHeader
          backTo={ROUTES.DASHBOARD}
          backLabel={t('nna.backToDashboard')}
          title={t('nna.listTitle')}
          subtitle={`${t('nna.onServer', { count: items.length })}${pendingLabel}`}
        />
      }
      scrollClassName="page-section"
    >
        {isFromCache && !error && (
          <AlertBanner tone="warning">{t('nna.listFromCache')}</AlertBanner>
        )}

        {flashMessage && (
          <AlertBanner tone="success">{flashMessage}</AlertBanner>
        )}

        <div className="surface-card !p-4">
          <Input
            label={t('nna.searchById')}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setSearchError(null);
            }}
            placeholder={t('nna.searchPlaceholder')}
            name="search-idUnico"
          />

          {searchError && (
            <p className="mt-2 text-sm font-medium text-danger-500" role="alert">
              {searchError}
            </p>
          )}

          <Button
            variant="secondary"
            className="mt-3 w-full"
            isLoading={isSearching}
            onClick={() => void handleSearch()}
          >
            {t('nna.searchButton')}
          </Button>
        </div>

        <CatalogSelect
          catalogKey={CATALOG_KEYS.NNA_STATUS}
          label={t('nna.filterByStatus')}
          value={statusFilter}
          onChange={(v) => setStatusFilter(v as NnaStatus | '')}
          name="filter-status"
          placeholder={t('nna.allStatuses')}
        />

        {error && <AlertBanner tone="error">{error}</AlertBanner>}

        {pendingCreates.length > 0 && (
          <div className="flex flex-col gap-3">
            <h2 className="text-base font-bold text-accent-700">
              {t('nna.localQueue')}
            </h2>
            {pendingCreates.map((pending) => (
              <PendingNnaCard
                key={pending.id ?? pending.idOfflineFallback}
                item={pending}
              />
            ))}
          </div>
        )}

        {isLoading && items.length === 0 && pendingCreates.length === 0 ? (
          <p className="py-8 text-center text-base text-text-muted">
            {t('nna.loadingRecords')}
          </p>
        ) : items.length === 0 && pendingCreates.length === 0 ? (
          <p className="py-8 text-center text-base text-text-muted">
            {t('nna.noRecords')}
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {items.map((nna) => (
              <NnaCard key={nna._id} nna={nna} />
            ))}
          </div>
        )}

        {hasNextPage && (
          <Button
            variant="ghost"
            className="w-full"
            isLoading={isLoading}
            onClick={loadMore}
          >
            {t('common.loadMore')}
          </Button>
        )}

        <Button variant="ghost" onClick={() => void reload()}>
          {t('nna.refreshList')}
        </Button>

        <ResponsiveActionBar>
          <Link to={ROUTES.NNA_REGISTER} className="block w-full lg:w-auto lg:min-w-[14rem]">
            <Button className="w-full" variant="accent">
              {t('nna.register')}
            </Button>
          </Link>
        </ResponsiveActionBar>
    </PageFrame>
  );
};
