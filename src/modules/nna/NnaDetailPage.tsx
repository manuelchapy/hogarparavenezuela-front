import { useEffect } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageFrame } from '@/components/layout/PageFrame';
import { PageHeader } from '@/components/layout/PageHeader';
import { ResponsiveActionBar } from '@/components/layout/StickyActionBar';
import { AlertBanner } from '@/components/ui/AlertBanner';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { CATALOG_KEYS } from '@/constants/catalogKeys';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import { useCatalog } from '@/hooks/useCatalog';
import { useNnaDetail } from '@/hooks/useNnaDetail';

export const NnaDetailPage = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { canAccessLegalClosure } = useAuth();
  const { getLabel } = useCatalog();
  const { nna, isLoading, error, isFromCache, load } = useNnaDetail(id);
  const flashMessage = (location.state as { message?: string } | null)?.message;

  useEffect(() => {
    void load();
  }, [load]);

  if (isLoading) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center p-8">
        <p className="text-base text-text-muted">{t('nna.detailLoading')}</p>
      </div>
    );
  }

  if (error || !nna) {
    return (
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-4 p-8">
        <AlertBanner tone="error">{error ?? t('nna.detailNotFound')}</AlertBanner>
        <Link to={ROUTES.NNA_LIST}>
          <Button variant="secondary">{t('nna.backToList')}</Button>
        </Link>
      </div>
    );
  }

  const ubicacionDisplay =
    'display' in nna.ubicacion
      ? nna.ubicacion.display
      : t('nna.detailLocationFallback');

  const dateLocale = i18n.language === 'en' ? 'en-US' : 'es-VE';

  return (
    <PageFrame
      header={
        <PageHeader
          backTo={ROUTES.NNA_LIST}
          backLabel={t('nna.backToRecords')}
          title={nna.datosNna.nombre ?? t('nna.detailUnknownName')}
          subtitle={nna.idUnico}
          badge={<StatusBadge statusCode={nna.statusActual} />}
        />
      }
      scrollClassName="page-section lg:px-8"
    >
      {isFromCache && (
        <AlertBanner tone="warning">{t('nna.detailFromCache')}</AlertBanner>
      )}

      {flashMessage && (
        <AlertBanner tone="success">{flashMessage}</AlertBanner>
      )}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(280px,360px)_1fr] xl:gap-6">
        <img
          src={nna.fotoUrl}
          alt={t('nna.detailPhotoAlt')}
          className="aspect-[4/3] w-full rounded-2xl object-cover shadow-[var(--shadow-card)] ring-2 ring-border-subtle xl:aspect-auto xl:min-h-[320px] xl:self-start"
        />

        <div className="flex flex-col gap-4">
          <SurfaceCard title={t('nna.detailDataTitle')}>
            <dl className="space-y-3 text-base">
              <div>
                <dt className="text-sm font-medium text-text-muted">{t('nna.detailSex')}</dt>
                <dd className="font-semibold">
                  {getLabel(CATALOG_KEYS.SEXO_NNA, nna.datosNna.sexo)}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-text-muted">{t('nna.detailAge')}</dt>
                <dd className="font-semibold">
                  {getLabel(CATALOG_KEYS.EDAD_APARENTE, nna.datosNna.edadAparente)}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-text-muted">{t('nna.detailTraits')}</dt>
                <dd className="font-semibold">{nna.datosNna.rasgosIdentificativos}</dd>
              </div>
            </dl>
          </SurfaceCard>

          <SurfaceCard title={t('nna.detailFindingTitle')}>
            <p className="text-base font-medium">{nna.hallazgo.lugarExacto}</p>
            <p className="mt-1 text-sm text-text-muted">
              {new Date(nna.hallazgo.fechaHora).toLocaleString(dateLocale)}
            </p>
          </SurfaceCard>

          <SurfaceCard title={t('nna.detailLocationTitle')}>
            <p className="text-base font-medium">{ubicacionDisplay}</p>
          </SurfaceCard>

          <SurfaceCard title={t('nna.detailTimelineTitle', { count: nna.timeline.length })}>
            <ul className="space-y-3">
              {nna.timeline.map((evento) => (
                <li
                  key={evento.eventoId}
                  className="rounded-xl border border-border-subtle bg-surface p-3 text-base"
                >
                  <p className="font-bold text-primary-800">
                    {getLabel(CATALOG_KEYS.TIMELINE_EVENTS, evento.tipoEvent)}
                  </p>
                  <p className="text-text-secondary">{evento.ubicacionNombre}</p>
                  <p className="text-sm text-text-muted">
                    {getLabel(CATALOG_KEYS.ESTADO_SALUD, evento.estadoSalud)}
                  </p>
                </li>
              ))}
            </ul>
          </SurfaceCard>
        </div>
      </div>

      <ResponsiveActionBar desktopClassName="lg:max-w-md lg:ml-auto">
        <Link
          to={ROUTES.NNA_TIMELINE.replace(':id', nna._id)}
          className="block w-full"
        >
          <Button className="w-full" variant="accent">
            {t('nna.addTimeline')}
          </Button>
        </Link>
        {canAccessLegalClosure() &&
          nna.statusActual !== 'ENTREGADO_AUTORIDAD' && (
            <Link
              to={ROUTES.LEGAL_CLOSURE.replace(':id', nna._id)}
              className="block w-full"
            >
              <Button variant="secondary" className="w-full">
                {t('nna.legalClosure')}
              </Button>
            </Link>
          )}
      </ResponsiveActionBar>
    </PageFrame>
  );
};
