import { Link, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AppBrand } from '@/components/layout/AppBrand';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/Button';
import { LopnnaLegalNotice } from '@/components/ui/LopnnaLegalNotice';
import { SurfaceCard } from '@/components/ui/SurfaceCard';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';

export const WelcomePage = () => {
  const { t } = useTranslation();
  const { isAuthenticated, isActive } = useAuth();

  if (isAuthenticated && isActive) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  const accessActions = (
    <>
      <Link to={ROUTES.LOGIN_OPERATIVO} className="block">
        <Button className="w-full" variant="accent">
          {t('auth.operativeAccess')}
        </Button>
      </Link>
      <p className="mt-2 text-center text-sm text-text-secondary">
        {t('auth.operativeHint')}
      </p>
      <Link to={ROUTES.LOGIN_ADMIN} className="mt-3 block">
        <Button className="w-full" variant="secondary">
          {t('auth.adminAccess')}
        </Button>
      </Link>
      <p className="mt-2 text-center text-sm text-text-muted">
        {t('auth.adminHint')}
      </p>
    </>
  );

  return (
    <AuthLayout
      brand={
        <AppBrand
          country={t('auth.country')}
          title={t('auth.appTitle')}
          subtitle={t('auth.appSubtitle')}
        />
      }
      mobileFooter={accessActions}
    >
      <SurfaceCard title={t('auth.missionTitle')}>
        <div className="flex flex-col gap-4 text-base leading-relaxed text-text-secondary">
          <p>{t('auth.missionP1')}</p>
          <p>{t('auth.missionP2')}</p>
          <p>{t('auth.missionP3')}</p>
        </div>
      </SurfaceCard>

      <div className="mt-5">
        <LopnnaLegalNotice variant="compact" />
      </div>

      <div className="mx-auto mt-8 hidden max-w-md flex-col lg:flex">{accessActions}</div>
    </AuthLayout>
  );
};
