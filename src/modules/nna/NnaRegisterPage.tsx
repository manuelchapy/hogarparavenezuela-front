import { Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { PageFrame } from '@/components/layout/PageFrame';
import { PageHeader } from '@/components/layout/PageHeader';
import { ResponsiveActionBar } from '@/components/layout/StickyActionBar';
import { AlertBanner } from '@/components/ui/AlertBanner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { CatalogSelect } from '@/components/ui/CatalogSelect';
import { PhotoCaptureInput } from '@/components/ui/PhotoCaptureInput';
import { StepProgress } from '@/components/ui/StepProgress';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { UbicacionSelector } from '@/components/ui/UbicacionSelector';
import { CATALOG_KEYS } from '@/constants/catalogKeys';
import { ROUTES } from '@/constants/routes';
import { LopnnaLegalNotice } from '@/components/ui/LopnnaLegalNotice';
import { useNnaRegister } from '@/hooks/useNnaRegister';

const STEP_KEYS = [
  'nna.registerSteps.photo',
  'nna.registerSteps.data',
  'nna.registerSteps.finding',
  'nna.registerSteps.event',
] as const;

export const NnaRegisterPage = () => {
  const { t } = useTranslation();
  const {
    form,
    step,
    nextStep,
    prevStep,
    onSubmit,
    submitError,
    isAdolescente,
    captureGps,
    isGpsLoading,
    isSubmitting,
    photoFile,
    setPhotoFile,
    photoError,
    setPhotoError,
  } = useNnaRegister();

  const { register, watch, setValue, formState: { errors }, control } = form;
  const vozDelNna = watch('vozDelNna');
  const useGps = watch('useGps');
  const gpsLng = watch('gpsLng');
  const gpsLat = watch('gpsLat');

  const stepLabels = STEP_KEYS.map((key) => t(key));

  return (
    <PageFrame
      header={
        <PageHeader
          backTo={ROUTES.NNA_LIST}
          backLabel={t('nna.backToList')}
          title={t('nna.registerTitle')}
        />
      }
      toolbar={
        <div className="shrink-0 border-b border-border-subtle bg-surface-elevated px-4 pb-4">
          <StepProgress steps={stepLabels} currentStep={step} />
        </div>
      }
      scrollClassName="page-section"
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        {step === 0 && (
          <SurfaceCard>
            <LopnnaLegalNotice variant="registration" collapsible className="mb-4" />
            <PhotoCaptureInput
              value={photoFile}
              onChange={(file) => {
                setPhotoFile(file);
                if (file) setPhotoError(null);
              }}
              error={photoError ?? undefined}
            />
          </SurfaceCard>
        )}

        {step === 1 && (
          <SurfaceCard>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
            <Input
              label={t('nna.fieldNameOptional')}
              placeholder={t('nna.fieldNamePlaceholder')}
              {...register('nombre')}
            />
            <Input
              label={t('nna.fieldParentsOptional')}
              {...register('nombrePadres')}
            />
            <CatalogSelect
              catalogKey={CATALOG_KEYS.SEXO_NNA}
              label={t('nna.fieldSex')}
              value={watch('sexo')}
              onChange={(v) => setValue('sexo', v as 'F' | 'M' | 'DESCONOCIDO')}
              error={errors.sexo?.message}
              name="sexo"
            />
            <CatalogSelect
              catalogKey={CATALOG_KEYS.EDAD_APARENTE}
              label={t('nna.fieldAge')}
              value={watch('edadAparente')}
              onChange={(v) =>
                setValue(
                  'edadAparente',
                  v as 'LACTANTE' | 'PREESCOLAR' | 'ESCOLAR' | 'ADOLESCENTE',
                )
              }
              error={errors.edadAparente?.message}
              name="edadAparente"
            />
            </div>
            <Textarea
              label={t('nna.fieldTraits')}
              rows={4}
              placeholder={t('nna.fieldTraitsPlaceholder')}
              error={errors.rasgosIdentificativos?.message}
              className="mt-4"
              {...register('rasgosIdentificativos')}
            />

            {isAdolescente && (
              <div className="mt-4 rounded-2xl border-2 border-accent-500/40 bg-accent-100/50 p-4">
                <p className="mb-3 text-base font-bold text-accent-700">
                  {t('nna.adolescentVoiceTitle')}
                </p>
                <label className="flex min-h-12 items-center gap-3 text-base font-medium">
                  <input
                    type="checkbox"
                    className="h-5 w-5 accent-accent-600"
                    checked={vozDelNna?.fueEscuchado ?? false}
                    onChange={(e) =>
                      setValue('vozDelNna', {
                        fueEscuchado: e.target.checked,
                        manifestacion: '',
                        justificacionNoEscucha: '',
                      })
                    }
                  />
                  {t('nna.wasHeardLabel')}
                </label>
                {vozDelNna?.fueEscuchado ? (
                  <Textarea
                    label={t('nna.manifestationLabel')}
                    className="mt-3"
                    {...register('vozDelNna.manifestacion')}
                  />
                ) : (
                  vozDelNna && (
                    <Textarea
                      label={t('nna.noListenJustificationLabel')}
                      className="mt-3"
                      {...register('vozDelNna.justificacionNoEscucha')}
                    />
                  )
                )}
                {errors.vozDelNna?.message && (
                  <p className="mt-2 text-sm text-danger-500">
                    {String(errors.vozDelNna.message)}
                  </p>
                )}
              </div>
            )}
          </SurfaceCard>
        )}

        {step === 2 && (
          <SurfaceCard>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
            <Input
              label={t('nna.fieldFindingPlace')}
              {...register('lugarExacto')}
              error={errors.lugarExacto?.message}
            />
            <Input
              label={t('nna.fieldFindingDate')}
              type="datetime-local"
              {...register('fechaHora')}
              error={errors.fechaHora?.message}
            />
            </div>
            <div className="mt-4 flex flex-col gap-2">
              <Button
                type="button"
                variant="secondary"
                isLoading={isGpsLoading}
                onClick={captureGps}
              >
                {t('nna.captureGps')}
              </Button>
              {useGps && gpsLng !== undefined && gpsLat !== undefined && (
                <p className="text-sm text-text-muted">
                  {t('nna.gpsCoords', {
                    lat: gpsLat.toFixed(5),
                    lng: gpsLng.toFixed(5),
                  })}
                </p>
              )}
            </div>
            <Controller
              name="ubicacion"
              control={control}
              render={({ field }) => (
                <UbicacionSelector
                  value={field.value}
                  onChange={field.onChange}
                  errors={{
                    state: errors.ubicacion?.state?.message,
                    city: errors.ubicacion?.city?.message,
                  }}
                />
              )}
            />
          </SurfaceCard>
        )}

        {step === 3 && (
          <SurfaceCard>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
            <Input
              label={t('nna.fieldInitialSite')}
              placeholder={t('nna.fieldInitialSitePlaceholder')}
              {...register('ubicacionNombre')}
              error={errors.ubicacionNombre?.message}
            />
            <CatalogSelect
              catalogKey={CATALOG_KEYS.ESTADO_SALUD}
              label={t('nna.fieldHealth')}
              value={watch('estadoSalud')}
              onChange={(v) =>
                setValue(
                  'estadoSalud',
                  v as 'ESTABLE' | 'REQUIERE_ATENCION_URGENTE' | 'CON_LESIONES_VISIBLES',
                )
              }
              error={errors.estadoSalud?.message}
              name="estadoSalud"
            />
            </div>
            <Textarea
              label={t('nna.fieldObservations')}
              rows={3}
              className="mt-4"
              {...register('observaciones')}
            />
            <AlertBanner tone="info" className="mt-4">
              {t('nna.registerOfflineHint')}
            </AlertBanner>
          </SurfaceCard>
        )}

        {submitError && <AlertBanner tone="error">{submitError}</AlertBanner>}

        <ResponsiveActionBar className="!flex-row" desktopClassName="lg:flex-row lg:justify-end">
          {step > 0 && (
            <Button type="button" variant="secondary" className="flex-1 lg:flex-initial lg:min-w-[10rem]" onClick={prevStep}>
              {t('nna.prevStep')}
            </Button>
          )}
          {step < 3 ? (
            <Button type="button" className="flex-1 lg:flex-initial lg:min-w-[10rem]" variant="accent" onClick={() => void nextStep()}>
              {t('nna.nextStep')}
            </Button>
          ) : (
            <Button
              type="button"
              className="flex-1 lg:flex-initial lg:min-w-[10rem]"
              variant="accent"
              isLoading={isSubmitting}
              onClick={onSubmit}
            >
              {t('nna.submitRegister')}
            </Button>
          )}
        </ResponsiveActionBar>
      </form>
    </PageFrame>
  );
};
