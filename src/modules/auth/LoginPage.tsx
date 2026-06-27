import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppBrand } from '@/components/layout/AppBrand';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { AlertBanner } from '@/components/ui/AlertBanner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LopnnaLegalNotice } from '@/components/ui/LopnnaLegalNotice';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import type { LoginMode } from '@/utils/authPortal';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import {
  loginSchema,
  type LoginForm,
} from '@/modules/auth/schemas/authSchemas';
import { getAuthErrorMessage, loginUser } from '@/services/authService';

export type { LoginMode };

interface LoginPageProps {
  mode: LoginMode;
}

export const LoginPage = ({ mode }: LoginPageProps) => {
  const { t } = useTranslation();
  const location = useLocation();
  const { isAuthenticated, isActive, setAuth } = useAuth();
  const isAdmin = mode === 'admin';
  const accountBlocked = (location.state as { accountBlocked?: boolean } | null)
    ?.accountBlocked;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: { cedula: '', credencialOficialId: '' },
  });

  if (isAuthenticated && isActive) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  const onSubmit = async (data: LoginForm) => {
    try {
      const payload = {
        cedula: data.cedula.trim().toUpperCase(),
        ...(data.credencialOficialId?.trim()
          ? { credencialOficialId: data.credencialOficialId.trim() }
          : {}),
      };
      const result = await loginUser(payload, mode);
      setAuth(result.user, result.token);
    } catch (error) {
      setError('root', { message: getAuthErrorMessage(error) });
    }
  };

  const submitButton = (
    <Button
      type="submit"
      form="login-form"
      className="w-full"
      variant="accent"
      isLoading={isSubmitting}
    >
      {t('auth.signIn')}
    </Button>
  );

  return (
    <AuthLayout
      brand={
        <>
          <Link
            to={ROUTES.WELCOME}
            className="mb-4 inline-flex min-h-10 items-center text-sm font-semibold text-primary-200 lg:mb-6"
          >
            {t('auth.backHome')}
          </Link>
          <AppBrand
            compact
            title={
              isAdmin ? t('auth.loginAdminTitle') : t('auth.loginOperativeTitle')
            }
            subtitle={
              isAdmin
                ? t('auth.loginAdminSubtitle')
                : t('auth.loginOperativeSubtitle')
            }
          />
        </>
      }
      mobileFooter={submitButton}
    >
      {accountBlocked && (
        <AlertBanner tone="warning" className="mb-4">
          {t('auth.accountBlocked')}
        </AlertBanner>
      )}

      <SurfaceCard>
        <form
          id="login-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5 lg:grid lg:grid-cols-2 lg:gap-6"
          noValidate
        >
          <Input
            label={t('auth.cedulaLabel')}
            placeholder={t('auth.cedulaPlaceholder')}
            autoComplete="username"
            inputMode="text"
            error={errors.cedula?.message}
            {...register('cedula')}
          />
          <Input
            label={t('auth.credentialLabel')}
            placeholder={
              isAdmin
                ? t('auth.credentialAdminPlaceholder')
                : t('auth.credentialOperativePlaceholder')
            }
            error={errors.credencialOficialId?.message}
            {...register('credencialOficialId')}
          />

          {errors.root && (
            <AlertBanner tone="error" className="lg:col-span-2">
              {errors.root.message}
            </AlertBanner>
          )}

          <div className="lg:col-span-2">
            {isAdmin ? (
              <Link
                to={ROUTES.BOOTSTRAP_ADMIN}
                className="text-center text-base font-semibold text-primary-700"
              >
                {t('auth.bootstrapAdminLink')}
              </Link>
            ) : (
              <Link
                to={ROUTES.SOLICITUD}
                className="text-center text-base font-semibold text-primary-700"
              >
                {t('auth.requestAccessLink')}
              </Link>
            )}
          </div>

          <div className="lg:col-span-2">
            <LopnnaLegalNotice variant="identity" />
          </div>

          <div className="hidden lg:col-span-2 lg:block">{submitButton}</div>
        </form>
      </SurfaceCard>
    </AuthLayout>
  );
};
