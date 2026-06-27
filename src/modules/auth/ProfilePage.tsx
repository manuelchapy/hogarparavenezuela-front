import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslation } from 'react-i18next';
import { PageFrame } from '@/components/layout/PageFrame';
import { PageHeader } from '@/components/layout/PageHeader';
import {
  DesktopActionBar,
  MobileBottomNavSpacer,
} from '@/components/layout/StickyActionBar';
import { AccountStatusBadge } from '@/components/ui/AccountStatusBadge';
import { AlertBanner } from '@/components/ui/AlertBanner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { UbicacionSelector } from '@/components/ui/UbicacionSelector';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import {
  profileSchema,
  type ProfileForm,
} from '@/modules/auth/schemas/authSchemas';
import { getAuthErrorMessage, updateUserProfile } from '@/services/authService';

export const ProfilePage = () => {
  const { t } = useTranslation();
  const { user, setUser, clearAuth } = useAuth();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nombreCompleto: '',
      telefono: '',
      ubicacion: { state: '', city: '', municipality: '', parish: '' },
    },
  });

  useEffect(() => {
    if (!user) return;
    reset({
      nombreCompleto: user.nombreCompleto,
      telefono: user.telefono,
      ubicacion: {
        state:
          typeof user.ubicacion === 'object' && 'state' in user.ubicacion
            ? (user.ubicacion.state as { id?: string }).id ?? ''
            : '',
        city:
          typeof user.ubicacion === 'object' && 'city' in user.ubicacion
            ? (user.ubicacion.city as { id?: string }).id ?? ''
            : '',
        municipality: '',
        parish: '',
      },
    });
  }, [user, reset]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const updated = await updateUserProfile({
        nombreCompleto: data.nombreCompleto,
        telefono: data.telefono,
        ubicacion: {
          state: data.ubicacion.state,
          city: data.ubicacion.city,
        },
      });
      setUser(updated);
    } catch (error) {
      setError('root', { message: getAuthErrorMessage(error) });
    }
  });

  if (!user) return null;

  const ubicacionDisplay =
    user.ubicacion && 'display' in user.ubicacion
      ? user.ubicacion.display
      : null;

  return (
    <PageFrame
      header={
        <PageHeader
          backTo={ROUTES.DASHBOARD}
          backLabel={t('auth.backToDashboard')}
          title={t('auth.profileTitle')}
          subtitle={user.cedula}
        />
      }
      scrollClassName="page-section"
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <SurfaceCard>
          <dl className="space-y-2 text-base">
            <div>
              <dt className="text-sm text-text-muted">{t('common.role')}</dt>
              <dd className="font-semibold">{user.rol.replace(/_/g, ' ')}</dd>
            </div>
            <div>
              <dt className="text-sm text-text-muted">{t('common.status')}</dt>
              <dd className="mt-1">
                <AccountStatusBadge statusCode={user.estadoCuenta} />
              </dd>
            </div>
            {user.institucion && (
              <div>
                <dt className="text-sm text-text-muted">
                  {t('auth.institutionCatalogLabel')}
                </dt>
                <dd className="font-semibold">{user.institucion}</dd>
              </div>
            )}
            {ubicacionDisplay && (
              <div>
                <dt className="text-sm text-text-muted">{t('auth.currentLocation')}</dt>
                <dd className="font-semibold">{ubicacionDisplay}</dd>
              </div>
            )}
          </dl>
        </SurfaceCard>

        <SurfaceCard title={t('auth.profileSubtitle')}>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6">
            <Input
              label={t('auth.fullNameLabel')}
              {...register('nombreCompleto')}
              error={errors.nombreCompleto?.message}
            />
            <Input
              label={t('auth.phoneLabel')}
              {...register('telefono')}
              error={errors.telefono?.message}
            />
          </div>

          <Controller
            name="ubicacion"
            control={control}
            render={({ field }) => (
              <UbicacionSelector
                value={field.value}
                onChange={field.onChange}
                includeMunicipalityParish={false}
              />
            )}
          />
        </SurfaceCard>

        {errors.root && <AlertBanner tone="error">{errors.root.message}</AlertBanner>}

        <div className="mt-2 flex flex-col gap-2 lg:hidden">
          <Button
            type="submit"
            className="w-full"
            variant="accent"
            isLoading={isSubmitting}
          >
            {t('auth.saveProfile')}
          </Button>
        </div>

        <DesktopActionBar>
          <Button
            type="submit"
            className="w-full lg:w-auto lg:min-w-[12rem]"
            variant="accent"
            isLoading={isSubmitting}
          >
            {t('auth.saveProfile')}
          </Button>
        </DesktopActionBar>
      </form>

      <SurfaceCard title={t('auth.sessionSection')}>
        <p className="mb-4 text-sm text-text-muted">{t('auth.logoutHint')}</p>
        <Button
          type="button"
          variant="danger"
          className="w-full lg:w-auto lg:min-w-[12rem]"
          onClick={clearAuth}
        >
          {t('common.logout')}
        </Button>
      </SurfaceCard>

      <MobileBottomNavSpacer />
    </PageFrame>
  );
};
