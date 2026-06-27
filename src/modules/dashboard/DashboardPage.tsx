import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { CatalogSelect } from '@/components/ui/CatalogSelect';
import { LopnnaLegalNotice } from '@/components/ui/LopnnaLegalNotice';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { UbicacionSelector } from '@/components/ui/UbicacionSelector';
import { CATALOG_KEYS } from '@/constants/catalogKeys';
import { EMPTY_UBICACION } from '@/constants/geoKeys';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { useCatalog } from '@/hooks/useCatalog';
import { useGeo } from '@/hooks/useGeo';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import type { UbicacionFormValue } from '@/hooks/useUbicacionForm';

const formatDate = (timestamp: number | null) => {
  if (!timestamp) return 'Sin sincronizar';
  return new Intl.DateTimeFormat('es-VE', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(timestamp));
};

export const DashboardPage = () => {
  const { user, clearAuth, isAdmin } = useAuth();
  const isOnline = useOnlineStatus();
  const {
    version,
    isReady,
    isLoading,
    lastUpdatedAt,
    error,
    refreshCatalog,
    getItems,
  } = useCatalog();
  const {
    states,
    statesLoaded,
    loadingStates,
    defaultCountry,
    error: geoError,
    prefetchGeo,
  } = useGeo();
  const [demoSalud, setDemoSalud] = useState('');
  const [demoUbicacion, setDemoUbicacion] =
    useState<UbicacionFormValue>(EMPTY_UBICACION);

  const nnaStatuses = getItems(CATALOG_KEYS.NNA_STATUS);

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-slate-200 bg-white px-4 py-5">
        <p className="text-sm font-medium text-text-secondary">Bienvenido</p>
        <h1 className="text-xl font-bold text-text-primary">{user?.nombreCompleto}</h1>
        <p className="mt-1 text-base text-text-secondary">
          Rol: {user?.rol?.replace(/_/g, ' ') ?? '—'}
        </p>
        {user?.institucion && (
          <p className="mt-1 text-sm text-text-secondary">{user.institucion}</p>
        )}
      </header>

      <section className="flex flex-1 flex-col gap-4 p-4">
        <div className="rounded-2xl border-2 border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-text-primary">
            Catálogos del sistema
          </h2>
          <dl className="mt-3 space-y-2 text-base">
            <div className="flex justify-between gap-4">
              <dt className="text-text-secondary">Estado</dt>
              <dd className="font-medium text-text-primary">
                {isLoading
                  ? 'Actualizando...'
                  : isReady
                    ? isOnline
                      ? 'Sincronizado'
                      : 'Modo offline (caché local)'
                    : 'Sin catálogos cargados'}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-text-secondary">Versión</dt>
              <dd className="font-medium text-text-primary">
                {version ?? '—'}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-text-secondary">Última actualización</dt>
              <dd className="font-medium text-text-primary">
                {formatDate(lastUpdatedAt)}
              </dd>
            </div>
          </dl>
          {error && (
            <p className="mt-3 text-sm font-medium text-danger-500" role="alert">
              {error}
            </p>
          )}
          {isReady && nnaStatuses.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {nnaStatuses.map((item) => (
                <StatusBadge key={item.code} statusCode={item.code} />
              ))}
            </div>
          )}
        </div>

        {isReady && (
          <div className="rounded-2xl border-2 border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-bold text-text-primary">
              Vista previa de select
            </h2>
            <p className="mt-1 text-base text-text-secondary">
              Los formularios consumen catálogos desde IndexedDB.
            </p>
            <div className="mt-4">
              <CatalogSelect
                catalogKey={CATALOG_KEYS.ESTADO_SALUD}
                label="Estado de salud aparente"
                value={demoSalud}
                onChange={setDemoSalud}
                name="demo-estado-salud"
              />
            </div>
          </div>
        )}

        <div className="rounded-2xl border-2 border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold text-text-primary">
            Geolocalización (Venezuela)
          </h2>
          <dl className="mt-3 space-y-2 text-base">
            <div className="flex justify-between gap-4">
              <dt className="text-text-secondary">País default</dt>
              <dd className="font-medium text-text-primary">
                {defaultCountry?.name ?? 'Venezuela'}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-text-secondary">Estados en caché</dt>
              <dd className="font-medium text-text-primary">
                {loadingStates
                  ? 'Cargando...'
                  : statesLoaded
                    ? `${states.length} estados`
                    : 'Sin datos'}
              </dd>
            </div>
          </dl>
          {geoError && (
            <p className="mt-3 text-sm font-medium text-danger-500" role="alert">
              {geoError}
            </p>
          )}
          <div className="mt-4">
            <UbicacionSelector
              value={demoUbicacion}
              onChange={setDemoUbicacion}
            />
          </div>
        </div>

        <Link to={ROUTES.NNA_LIST} className="block">
          <div className="rounded-2xl border-2 border-slate-200 bg-white p-5 shadow-sm active:bg-slate-50">
            <h2 className="text-lg font-bold text-text-primary">Fichas NNA</h2>
            <p className="mt-1 text-base text-text-secondary">
              Consultar, registrar y actualizar trazabilidad
            </p>
          </div>
        </Link>

        <Link to={ROUTES.PROFILE} className="block">
          <div className="rounded-2xl border-2 border-slate-200 bg-white p-5 shadow-sm active:bg-slate-50">
            <h2 className="text-lg font-bold text-text-primary">Mi perfil</h2>
            <p className="mt-1 text-base text-text-secondary">
              Actualizar datos y ubicación
            </p>
          </div>
        </Link>

        {isAdmin() && (
          <Link to={ROUTES.ADMIN_USERS} className="block">
            <div className="rounded-2xl border-2 border-amber-200 bg-amber-50 p-5 shadow-sm active:bg-amber-100">
              <h2 className="text-lg font-bold text-amber-950">
                Administración
              </h2>
              <p className="mt-1 text-base text-amber-900">
                Aprobar solicitudes de operadores
              </p>
            </div>
          </Link>
        )}

        <LopnnaLegalNotice variant="compact" />
      </section>

      <div className="sticky bottom-0 flex flex-col gap-2 border-t border-slate-200 bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <Button
          variant="secondary"
          className="w-full"
          disabled={!isOnline || isLoading}
          isLoading={isLoading}
          onClick={() => void refreshCatalog()}
        >
          Actualizar catálogos
        </Button>
        <Button
          variant="secondary"
          className="w-full"
          disabled={!isOnline || loadingStates}
          isLoading={loadingStates}
          onClick={() => void prefetchGeo()}
        >
          Actualizar geo
        </Button>
        <Button variant="secondary" className="w-full" onClick={clearAuth}>
          Cerrar sesión
        </Button>
      </div>
    </div>
  );
};
