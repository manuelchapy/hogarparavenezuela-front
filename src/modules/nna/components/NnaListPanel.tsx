import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AlertBanner } from '@/components/ui/AlertBanner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CatalogSelect } from '@/components/ui/CatalogSelect';
import { NnaCard } from '@/modules/nna/components/NnaCard';
import { PendingNnaCard } from '@/modules/nna/components/PendingNnaCard';
import { CATALOG_KEYS } from '@/constants/catalogKeys';
import type { NnaStatus } from '@/api/nnaTypes';
import { ROUTES } from '@/constants/routes';
import { useNnaList } from '@/hooks/useNnaList';
import { useNnaSearch } from '@/hooks/useNnaDetail';

/** Panel compacto de listado — columna izquierda en escritorio (NnaWorkspaceLayout). */
export const NnaListPanel = () => {
  const { t } = useTranslation();
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

  const handleSearch = async () => {
    setSearchError(null);
    const found = await goToByIdUnico(searchByIdUnico);
    if (!found && searchQuery.trim()) {
      setSearchError(t('nna.notFoundById'));
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-surface">
      <div className="border-b border-border-subtle bg-surface-elevated px-4 py-4">
        <h2 className="text-lg font-bold text-text-primary">{t('nna.listTitle')}</h2>
        <p className="mt-1 text-sm text-text-secondary">
          {t('nna.onServer', { count: items.length })}
        </p>
        <Link to={ROUTES.NNA_REGISTER} className="mt-3 block">
          <Button className="w-full" variant="accent">
            {t('nna.register')}
          </Button>
        </Link>
      </div>

      <div className="flex flex-1 flex-col gap-3 overflow-y-auto p-4">
        {isFromCache && !error && (
          <AlertBanner tone="warning" className="text-sm">
            {t('nna.listFromCache')}
          </AlertBanner>
        )}

        <Input
          label={t('nna.searchById')}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setSearchError(null);
          }}
          placeholder={t('nna.searchPlaceholder')}
          name="panel-search-idUnico"
        />

        {searchError && (
          <p className="text-sm font-medium text-danger-500" role="alert">
            {searchError}
          </p>
        )}

        <Button
          variant="secondary"
          className="w-full"
          isLoading={isSearching}
          onClick={() => void handleSearch()}
        >
          {t('nna.searchButton')}
        </Button>

        <CatalogSelect
          catalogKey={CATALOG_KEYS.NNA_STATUS}
          label={t('nna.filterByStatus')}
          value={statusFilter}
          onChange={(v) => setStatusFilter(v as NnaStatus | '')}
          name="panel-filter-status"
          placeholder={t('nna.allStatuses')}
        />

        {error && <AlertBanner tone="error">{error}</AlertBanner>}

        {pendingCreates.map((pending) => (
          <PendingNnaCard
            key={pending.id ?? pending.idOfflineFallback}
            item={pending}
          />
        ))}

        {isLoading && items.length === 0 ? (
          <p className="py-4 text-center text-sm text-text-muted">
            {t('nna.loadingRecords')}
          </p>
        ) : items.length === 0 ? (
          <p className="py-4 text-center text-sm text-text-muted">
            {t('nna.noRecords')}
          </p>
        ) : (
          items.map((nna) => <NnaCard key={nna._id} nna={nna} />)
        )}

        {hasNextPage && (
          <Button variant="ghost" className="w-full" isLoading={isLoading} onClick={loadMore}>
            {t('common.loadMore')}
          </Button>
        )}

        <Button variant="ghost" onClick={() => void reload()}>
          {t('nna.refreshList')}
        </Button>
      </div>
    </div>
  );
};
