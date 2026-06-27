import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CatalogSelect } from '@/components/ui/CatalogSelect';
import { NnaCard } from '@/modules/nna/components/NnaCard';
import { CATALOG_KEYS } from '@/constants/catalogKeys';
import type { NnaStatus } from '@/api/nnaTypes';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { useNnaList } from '@/hooks/useNnaList';
import { useNnaSearch } from '@/hooks/useNnaDetail';
import { usePendingNnaCreates } from '@/hooks/usePendingNnaCreates';
import { PendingNnaCard } from '@/modules/nna/components/PendingNnaCard';

export const NnaListPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { clearAuth } = useAuth();
  const [statusFilter, setStatusFilter] = useState<NnaStatus | ''>('');
  const {
    items,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    reload,
    loadMore,
    hasNextPage,
    searchByIdUnico,
  } = useNnaList({ status: statusFilter || undefined });
  const { items: pendingCreates } = usePendingNnaCreates();
  const { isSearching, goToByIdUnico } = useNnaSearch();
  const flashMessage = (location.state as { message?: string } | null)?.message;

  const handleSearch = async () => {
    const found = await goToByIdUnico(searchByIdUnico);
    if (!found && searchQuery.trim()) {
      alert('No se encontró ficha con ese ID único');
    }
  };

  const handleLogout = () => {
    clearAuth();
    navigate(ROUTES.WELCOME, { replace: true });
  };

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-slate-200 bg-white px-4 py-5">
        <div className="flex items-center justify-between gap-3">
          <Link
            to={ROUTES.DASHBOARD}
            className="text-sm font-medium text-primary-700"
          >
            ← Volver al panel
          </Link>
          <Button
            type="button"
            variant="ghost"
            className="!min-h-10 shrink-0 !px-3 text-sm"
            onClick={handleLogout}
          >
            Cerrar sesión
          </Button>
        </div>
        <h1 className="mt-2 text-xl font-bold text-text-primary">Fichas NNA</h1>
        <p className="mt-1 text-base text-text-secondary">
          {items.length} en servidor
          {pendingCreates.length > 0
            ? ` · ${pendingCreates.length} pendiente${pendingCreates.length !== 1 ? 's' : ''} local`
            : ''}
        </p>
      </header>

      <section className="flex flex-col gap-3 p-4">
        {flashMessage && (
          <p className="rounded-xl bg-green-50 px-4 py-3 text-base text-green-900">
            {flashMessage}
          </p>
        )}

        <div className="flex gap-2">
          <Input
            label="Buscar por ID único"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="DC-CCS-260626-001"
            name="search-idUnico"
          />
        </div>
        <Button
          variant="secondary"
          className="w-full"
          isLoading={isSearching}
          onClick={() => void handleSearch()}
        >
          Buscar ficha
        </Button>

        <CatalogSelect
          catalogKey={CATALOG_KEYS.NNA_STATUS}
          label="Filtrar por estado"
          value={statusFilter}
          onChange={(v) => setStatusFilter(v as NnaStatus | '')}
          name="filter-status"
          placeholder="Todos los estados"
        />

        {error && (
          <p className="text-sm font-medium text-danger-500" role="alert">
            {error}
          </p>
        )}

        {pendingCreates.length > 0 && (
          <div className="flex flex-col gap-3">
            <h2 className="text-base font-semibold text-amber-950">
              Cola local (sin sincronizar)
            </h2>
            {pendingCreates.map((pending) => (
              <PendingNnaCard key={pending.id ?? pending.idOfflineFallback} item={pending} />
            ))}
          </div>
        )}

        {isLoading && items.length === 0 && pendingCreates.length === 0 ? (
          <p className="py-8 text-center text-base text-text-secondary">
            Cargando fichas...
          </p>
        ) : items.length === 0 && pendingCreates.length === 0 ? (
          <p className="py-8 text-center text-base text-text-secondary">
            No hay registros con los filtros actuales
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
            Cargar más
          </Button>
        )}

        <Button variant="ghost" onClick={() => void reload()}>
          Actualizar listado
        </Button>
      </section>

      <div className="sticky bottom-0 border-t border-slate-200 bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <Link to={ROUTES.NNA_REGISTER} className="block">
          <Button className="w-full">Registrar NNA</Button>
        </Link>
      </div>
    </div>
  );
};
