import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PageFrame } from '@/components/layout/PageFrame';
import { PageHeader } from '@/components/layout/PageHeader';
import { ResponsiveActionBar } from '@/components/layout/StickyActionBar';
import { AlertBanner } from '@/components/ui/AlertBanner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { LopnnaLegalNotice } from '@/components/ui/LopnnaLegalNotice';
import { ROUTES } from '@/constants/routes';
import { useLegalClosure } from '@/hooks/useLegalClosure';

export const LegalClosurePage = () => {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const {
    form,
    submitError,
    isUploading,
    handleActaUpload,
    onSubmit,
    isSubmitting,
  } = useLegalClosure(id);

  const { register, formState: { errors } } = form;

  return (
    <PageFrame
      header={
        <PageHeader
          backTo={id ? ROUTES.NNA_DETAIL.replace(':id', id) : ROUTES.NNA_LIST}
          backLabel={t('nna.backToRecord')}
          title={t('legalClosure.title')}
          subtitle={t('legalClosure.subtitle')}
        />
      }
      scrollClassName="page-section"
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <LopnnaLegalNotice variant="legalClosure" />

        <SurfaceCard>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
            <Input
              label={t('legalClosure.actaCode')}
              {...register('codigoActaEntrega')}
              error={errors.codigoActaEntrega?.message}
            />
            <Input
              label={t('legalClosure.authorityName')}
              {...register('autoridadNombre')}
              error={errors.autoridadNombre?.message}
            />
            <Input
              label={t('legalClosure.authorityCredential')}
              className="lg:col-span-2"
              {...register('autoridadCredencial')}
              error={errors.autoridadCredencial?.message}
            />
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <span className="text-base font-semibold text-text-primary">
              {t('legalClosure.scannedActa')}
            </span>
            <input
              type="file"
              accept="image/*,application/pdf"
              disabled={isUploading}
              className="form-field !min-h-12 file:mr-3 file:rounded-lg file:border-0 file:bg-primary-100 file:px-3 file:py-2 file:font-semibold file:text-primary-800"
              onChange={(e) => void handleActaUpload(e.target.files?.[0])}
            />
            <input type="hidden" {...register('scannedActaUrl')} />
            {errors.scannedActaUrl && (
              <p className="text-sm text-danger-500">
                {errors.scannedActaUrl.message}
              </p>
            )}
          </div>

          <label className="mt-4 flex min-h-12 items-center gap-3 text-base font-medium">
            <input
              type="checkbox"
              className="h-5 w-5 accent-primary-600"
              {...register('notificadoAlCpnna')}
            />
            {t('legalClosure.notifiedCpnna')}
          </label>
          <label className="flex min-h-12 items-center gap-3 text-base font-medium">
            <input
              type="checkbox"
              className="h-5 w-5 accent-primary-600"
              {...register('archivadoPorRescatista')}
            />
            {t('legalClosure.archivedByRescuer')}
          </label>
        </SurfaceCard>

        {submitError && <AlertBanner tone="error">{submitError}</AlertBanner>}

        <ResponsiveActionBar>
          <Button
            type="button"
            className="w-full lg:w-auto lg:min-w-[12rem]"
            variant="accent"
            isLoading={isSubmitting || isUploading}
            onClick={onSubmit}
          >
            {t('legalClosure.submit')}
          </Button>
        </ResponsiveActionBar>
      </form>
    </PageFrame>
  );
};
