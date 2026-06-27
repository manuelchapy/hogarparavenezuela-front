import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppBrand } from '@/components/layout/AppBrand';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { AlertBanner } from '@/components/ui/AlertBanner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PhotoCaptureInput } from '@/components/ui/PhotoCaptureInput';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { UbicacionSelector } from '@/components/ui/UbicacionSelector';
import { CATALOG_KEYS } from '@/constants/catalogKeys';
import { OPERATIONAL_ROLES, ROLES } from '@/constants/roles';
import { ROUTES } from '@/constants/routes';
import {
  solicitudSchema,
  type SolicitudForm,
} from '@/modules/auth/schemas/authSchemas';
import {
  getAuthErrorMessage,
  submitSolicitudWithPhotos,
} from '@/services/authService';
import { fetchInstitutions } from '@/api/authApi';
import type { Institution } from '@/api/authTypes';
import { GeoSelect } from '@/components/ui/GeoSelect';
import { LopnnaLegalNotice } from '@/components/ui/LopnnaLegalNotice';
import { useCatalog } from '@/hooks/useCatalog';

export const SolicitudPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { getItems } = useCatalog();
  const roleOptions = getItems(CATALOG_KEYS.ROLES)
    .filter((item) =>
      OPERATIONAL_ROLES.includes(item.code as (typeof OPERATIONAL_ROLES)[number]),
    )
    .map((item) => ({ id: item.code, name: item.label }));
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const form = useForm<SolicitudForm>({
    resolver: zodResolver(solicitudSchema),
    defaultValues: {
      nombreCompleto: '',
      cedula: '',
      telefono: '',
      rolSolicitado: ROLES.RESCATISTA_CIVIL,
      institucionId: '',
      institucion: '',
      hasCredencial: false,
      credencialOficialId: '',
      ubicacion: { state: '', city: '', municipality: '', parish: '' },
    },
  });

  const { register, control, watch, setValue, handleSubmit, formState: { errors, isSubmitting } } = form;
  const hasCredencial = watch('hasCredencial');

  useEffect(() => {
    void fetchInstitutions()
      .then(setInstitutions)
      .catch(() => undefined);
  }, []);

  const onSubmit = handleSubmit(async (data) => {
    setSubmitError(null);
    try {
      const result = await submitSolicitudWithPhotos(data);
      setSuccessMessage(result.message);
      setTimeout(() => navigate(ROUTES.LOGIN_OPERATIVO), 3000);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : getAuthErrorMessage(error),
      );
    }
  });

  const submitButton = (
    <Button
      type="button"
      className="w-full"
      variant="accent"
      isLoading={isSubmitting}
      onClick={onSubmit}
    >
      {t('auth.submitSolicitud')}
    </Button>
  );

  if (successMessage) {
    return (
      <AuthLayout
        brand={
          <AppBrand compact title={t('auth.solicitudSuccessTitle')} />
        }
      >
        <div className="flex flex-col items-center gap-4 py-10 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-feedback-success-bg text-3xl ring-2 ring-feedback-success-border">
            ✓
          </div>
          <p className="text-base text-text-secondary">{successMessage}</p>
          <p className="text-sm text-text-muted">{t('auth.solicitudRedirecting')}</p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      brand={
        <>
          <Link
            to={ROUTES.LOGIN_OPERATIVO}
            className="mb-4 inline-flex min-h-10 items-center text-sm font-semibold text-primary-200"
          >
            {t('auth.backOperativeLogin')}
          </Link>
          <AppBrand compact title={t('auth.solicitudTitle')} subtitle={t('auth.solicitudSubtitle')} />
        </>
      }
      mobileFooter={submitButton}
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <LopnnaLegalNotice variant="identity" />

        <SurfaceCard>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
            <Input
              label={t('auth.fullNameLabel')}
              {...register('nombreCompleto')}
              error={errors.nombreCompleto?.message}
            />
            <Input
              label={t('auth.cedulaLabel')}
              placeholder={t('auth.cedulaPlaceholder')}
              {...register('cedula')}
              error={errors.cedula?.message}
            />
            <Input
              label={t('auth.phoneLabel')}
              placeholder={t('auth.phonePlaceholder')}
              {...register('telefono')}
              error={errors.telefono?.message}
            />
            <GeoSelect
              label={t('auth.requestedRoleLabel')}
              name="rolSolicitado"
              value={watch('rolSolicitado')}
              onChange={(v) =>
                setValue('rolSolicitado', v as SolicitudForm['rolSolicitado'])
              }
              options={roleOptions}
              placeholder={t('auth.selectOperativeRole')}
            />
            {institutions.length > 0 && (
              <GeoSelect
                label={t('auth.institutionCatalogLabel')}
                name="institucionId"
                value={watch('institucionId') ?? ''}
                onChange={(v) => setValue('institucionId', v)}
                options={institutions.map((i) => ({ id: i.id, name: i.nombre }))}
                placeholder={t('auth.selectFromCatalog')}
              />
            )}
            <Input
              label={t('auth.institutionFreeLabel')}
              className={institutions.length > 0 ? '' : 'lg:col-span-2'}
              {...register('institucion')}
              error={errors.institucion?.message}
            />
          </div>

          <label className="mt-4 flex min-h-12 items-center gap-3 text-base font-medium">
            <input
              type="checkbox"
              className="h-5 w-5 accent-primary-600"
              checked={hasCredencial}
              onChange={(e) => setValue('hasCredencial', e.target.checked)}
            />
            {t('auth.hasOfficialCredential')}
          </label>

          {hasCredencial ? (
            <>
              <Input
                label={t('auth.officialCredentialIdLabel')}
                className="mt-4"
                {...register('credencialOficialId')}
                error={errors.credencialOficialId?.message}
              />
              <Controller
                name="fotoCredencialFile"
                control={control}
                render={({ field }) => (
                  <PhotoCaptureInput
                    value={field.value ?? null}
                    onChange={field.onChange}
                    error={errors.fotoCredencialFile?.message}
                  />
                )}
              />
            </>
          ) : (
            <Controller
              name="fotoCedulaFile"
              control={control}
              render={({ field }) => (
                <PhotoCaptureInput
                  value={field.value ?? null}
                  onChange={field.onChange}
                  error={errors.fotoCedulaFile?.message}
                />
              )}
            />
          )}

          <Controller
            name="ubicacion"
            control={control}
            render={({ field }) => (
              <UbicacionSelector
                value={field.value}
                onChange={field.onChange}
                includeMunicipalityParish={false}
                errors={{
                  state: errors.ubicacion?.state?.message,
                  city: errors.ubicacion?.city?.message,
                }}
              />
            )}
          />
        </SurfaceCard>

        {submitError && <AlertBanner tone="error">{submitError}</AlertBanner>}

        <div className="hidden lg:block">{submitButton}</div>
      </form>
    </AuthLayout>
  );
};
