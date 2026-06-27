import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageFrame } from '@/components/layout/PageFrame';
import { PageHeader } from '@/components/layout/PageHeader';
import { ResponsiveActionBar } from '@/components/layout/StickyActionBar';
import { AlertBanner } from '@/components/ui/AlertBanner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { GeoSelect } from '@/components/ui/GeoSelect';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { CATALOG_KEYS } from '@/constants/catalogKeys';
import { ROUTES } from '@/constants/routes';
import { useCatalog } from '@/hooks/useCatalog';
import { useNnaDetail } from '@/hooks/useNnaDetail';
import { useNnaTimeline } from '@/hooks/useNnaTimeline';
import { CatalogSelect } from '@/components/ui/CatalogSelect';
import { LopnnaLegalNotice } from '@/components/ui/LopnnaLegalNotice';

const TIMELINE_ALLOWED = ['TRASLADO', 'ATENCION_MEDICA', 'INGRESO_REFUGIO'] as const;

export const NnaTimelinePage = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getItems } = useCatalog();
  const { nna, load, setNna } = useNnaDetail(id);

  const timelineOptions = getItems(CATALOG_KEYS.TIMELINE_EVENTS)
    .filter((item) =>
      TIMELINE_ALLOWED.includes(item.code as (typeof TIMELINE_ALLOWED)[number]),
    )
    .map((item) => ({ id: item.code, name: item.label }));

  const { form, onSubmit, submitError, offlineQueued, requiresEntidad, isSubmitting } =
    useNnaTimeline(id ?? '', (updated) => {
      setNna(updated);
      navigate(ROUTES.NNA_DETAIL.replace(':id', updated._id), {
        state: { message: t('nna.timelineSuccess') },
      });
    });

  const { register, watch, setValue } = form;

  useEffect(() => {
    void load();
  }, [load]);

  return (
    <PageFrame
      header={
        <PageHeader
          backTo={id ? ROUTES.NNA_DETAIL.replace(':id', id) : ROUTES.NNA_LIST}
          backLabel={t('nna.backToRecord')}
          title={t('nna.timelineTitle')}
          subtitle={nna?.idUnico}
        />
      }
      scrollClassName="page-section"
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <AlertBanner tone="info">{t('nna.timelineImmutableHint')}</AlertBanner>
        <LopnnaLegalNotice variant="timeline" />

        <SurfaceCard>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
            <GeoSelect
              label={t('nna.timelineEventType')}
              name="tipoEvent"
              value={watch('tipoEvent')}
              onChange={(v) =>
                setValue(
                  'tipoEvent',
                  v as 'TRASLADO' | 'ATENCION_MEDICA' | 'INGRESO_REFUGIO',
                )
              }
              options={timelineOptions}
              placeholder={t('nna.timelineEventPlaceholder')}
            />

            <Input
              label={t('nna.timelineLocation')}
              {...register('ubicacionNombre')}
              error={form.formState.errors.ubicacionNombre?.message}
            />

            {requiresEntidad && (
              <Input
                label={t('nna.timelineEntityId')}
                placeholder={t('nna.timelineEntityPlaceholder')}
                className="lg:col-span-2"
                {...register('entidadAtencionId')}
                error={form.formState.errors.entidadAtencionId?.message}
              />
            )}

            <CatalogSelect
              catalogKey={CATALOG_KEYS.ESTADO_SALUD}
              label={t('nna.timelineHealth')}
              value={watch('estadoSalud')}
              onChange={(v) =>
                setValue(
                  'estadoSalud',
                  v as 'ESTABLE' | 'REQUIERE_ATENCION_URGENTE' | 'CON_LESIONES_VISIBLES',
                )
              }
              name="estadoSalud"
            />
          </div>

          <Textarea
            label={t('nna.timelineObservations')}
            rows={3}
            className="mt-4"
            {...register('observaciones')}
          />
        </SurfaceCard>

        {offlineQueued && (
          <AlertBanner tone="warning">{t('nna.timelineOfflineQueued')}</AlertBanner>
        )}

        {submitError && <AlertBanner tone="error">{submitError}</AlertBanner>}

        <ResponsiveActionBar>
          <Button
            type="button"
            className="w-full lg:w-auto lg:min-w-[12rem]"
            variant="accent"
            isLoading={isSubmitting}
            onClick={onSubmit}
          >
            {t('nna.timelineSave')}
          </Button>
        </ResponsiveActionBar>
      </form>
    </PageFrame>
  );
};
