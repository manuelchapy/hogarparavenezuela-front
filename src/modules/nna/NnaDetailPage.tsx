import { useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { CATALOG_KEYS } from '@/constants/catalogKeys';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { useCatalog } from '@/hooks/useCatalog';
import { useNnaDetail } from '@/hooks/useNnaDetail';

export const NnaDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { canAccessLegalClosure } = useAuth();
  const { getLabel } = useCatalog();
  const { nna, isLoading, error, load } = useNnaDetail(id);
  const flashMessage = (location.state as { message?: string } | null)?.message;

  useEffect(() => {
    void load();
  }, [load]);

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <p className="text-base text-text-secondary">Cargando ficha...</p>
      </div>
    );
  }

  if (error || !nna) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
        <p className="text-base text-danger-500">{error ?? 'Ficha no encontrada'}</p>
        <Link to={ROUTES.NNA_LIST}>
          <Button variant="secondary">Volver al listado</Button>
        </Link>
      </div>
    );
  }

  const ubicacionDisplay =
    'display' in nna.ubicacion
      ? nna.ubicacion.display
      : 'Ubicación registrada';

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-slate-200 bg-white px-4 py-5">
        <Link to={ROUTES.NNA_LIST} className="text-sm font-medium text-primary-700">
          ← Fichas NNA
        </Link>
        <div className="mt-2 flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-text-primary">
              {nna.datosNna.nombre ?? 'Desconocido/No recuerda'}
            </h1>
            <p className="mt-1 font-medium text-primary-700">{nna.idUnico}</p>
          </div>
          <StatusBadge statusCode={nna.statusActual} />
        </div>
      </header>

      <section className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
        {flashMessage && (
          <p className="rounded-xl bg-green-50 px-4 py-3 text-base text-green-900">
            {flashMessage}
          </p>
        )}

        <img
          src={nna.fotoUrl}
          alt="Foto del NNA"
          className="aspect-[4/3] w-full rounded-2xl object-cover"
        />

        <div className="rounded-2xl border-2 border-slate-200 bg-white p-4">
          <h2 className="text-lg font-bold text-text-primary">Datos del NNA</h2>
          <dl className="mt-3 space-y-2 text-base">
            <div>
              <dt className="text-text-secondary">Sexo</dt>
              <dd className="font-medium">
                {getLabel(CATALOG_KEYS.SEXO_NNA, nna.datosNna.sexo)}
              </dd>
            </div>
            <div>
              <dt className="text-text-secondary">Edad aparente</dt>
              <dd className="font-medium">
                {getLabel(CATALOG_KEYS.EDAD_APARENTE, nna.datosNna.edadAparente)}
              </dd>
            </div>
            <div>
              <dt className="text-text-secondary">Rasgos</dt>
              <dd className="font-medium">{nna.datosNna.rasgosIdentificativos}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-2xl border-2 border-slate-200 bg-white p-4">
          <h2 className="text-lg font-bold text-text-primary">Hallazgo</h2>
          <p className="mt-2 text-base">{nna.hallazgo.lugarExacto}</p>
          <p className="mt-1 text-sm text-text-secondary">
            {new Date(nna.hallazgo.fechaHora).toLocaleString('es-VE')}
          </p>
        </div>

        <div className="rounded-2xl border-2 border-slate-200 bg-white p-4">
          <h2 className="text-lg font-bold text-text-primary">Ubicación</h2>
          <p className="mt-2 text-base">{ubicacionDisplay}</p>
        </div>

        <div className="rounded-2xl border-2 border-slate-200 bg-white p-4">
          <h2 className="text-lg font-bold text-text-primary">
            Timeline ({nna.timeline.length})
          </h2>
          <ul className="mt-3 space-y-3">
            {nna.timeline.map((evento) => (
              <li
                key={evento.eventoId}
                className="rounded-xl bg-slate-50 p-3 text-base"
              >
                <p className="font-semibold">
                  {getLabel(CATALOG_KEYS.TIMELINE_EVENTS, evento.tipoEvent)}
                </p>
                <p className="text-text-secondary">{evento.ubicacionNombre}</p>
                <p className="text-sm text-text-secondary">
                  {getLabel(CATALOG_KEYS.ESTADO_SALUD, evento.estadoSalud)}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="sticky bottom-0 flex flex-col gap-2 border-t border-slate-200 bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <Link
          to={ROUTES.NNA_TIMELINE.replace(':id', nna._id)}
          className="block"
        >
          <Button className="w-full">Agregar hito al timeline</Button>
        </Link>
        {canAccessLegalClosure() &&
          nna.statusActual !== 'ENTREGADO_AUTORIDAD' && (
            <Link
              to={ROUTES.LEGAL_CLOSURE.replace(':id', nna._id)}
              className="block"
            >
              <Button variant="secondary" className="w-full">
                Cierre legal
              </Button>
            </Link>
          )}
      </div>
    </div>
  );
};
