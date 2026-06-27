import { useState } from 'react';
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
import { LopnnaLegalNotice } from '@/components/ui/LopnnaLegalNotice';
import { ROUTES } from '@/constants/routes';
import {
  bootstrapAdminSchema,
  type BootstrapAdminForm,
} from '@/modules/auth/schemas/authSchemas';
import {
  getAuthErrorMessage,
  submitBootstrapAdminWithPhotos,
} from '@/services/authService';
import { useAuth } from '@/hooks/useAuth';

export const BootstrapAdminPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setAuth } = useAuth();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BootstrapAdminForm>({
    resolver: zodResolver(bootstrapAdminSchema),
    defaultValues: {
      nombreCompleto: '',
      cedula: '',
      telefono: '',
      bootstrapSecret: '',
      hasCredencial: false,
      credencialOficialId: '',
      ubicacion: { state: '', city: '', municipality: '', parish: '' },
    },
  });

  const hasCredencial = watch('hasCredencial');

  const onSubmit = handleSubmit(async (data) => {
    setSubmitError(null);
    try {
      const result = await submitBootstrapAdminWithPhotos(data);
      setAuth(result.user, result.token);
      navigate(ROUTES.DASHBOARD, { replace: true });
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
      {t('auth.createAdmin')}
    </Button>
  );

  return (
    <AuthLayout
      brand={
        <>
          <Link
            to={ROUTES.LOGIN_ADMIN}
            className="mb-4 inline-flex min-h-10 items-center text-sm font-semibold text-primary-200"
          >
            {t('auth.bootstrapBackLogin')}
          </Link>
          <AppBrand
            compact
            title={t('auth.bootstrapFirstTitle')}
            subtitle={t('auth.bootstrapFirstDesc')}
          />
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
            <Input
              label={t('auth.bootstrapSecretLabel')}
              type="password"
              autoComplete="off"
              placeholder={t('auth.bootstrapSecretPlaceholder')}
              {...register('bootstrapSecret')}
              error={errors.bootstrapSecret?.message}
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
