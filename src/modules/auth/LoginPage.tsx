import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LopnnaLegalNotice } from '@/components/ui/LopnnaLegalNotice';
import { ViewApiHint } from '@/components/ui/ViewApiHint';
import type { LoginMode } from '@/constants/authPortals';
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
  const location = useLocation();
  const { isAuthenticated, isActive, setAuth } = useAuth();
  const isAdmin = mode === 'admin';
  const loginRoute = isAdmin ? ROUTES.LOGIN_ADMIN : ROUTES.LOGIN_OPERATIVO;
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

  return (
    <div className="flex h-dvh w-full flex-col bg-primary-800">
      <div className="flex flex-1 flex-col overflow-y-auto px-5 py-8">
        <header className="mb-6 text-center">
          <Link
            to={ROUTES.WELCOME}
            className="text-sm font-medium text-primary-200"
          >
            ← Inicio
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-white">
            {isAdmin ? 'Acceso administrador' : 'Acceso operativo'}
          </h1>
          <p className="mt-2 text-base text-primary-100">
            {isAdmin
              ? 'Administración del sistema'
              : 'Rescatistas, protección civil, personal médico y CPNNA'}
          </p>
        </header>

        {accountBlocked && (
          <p className="mb-4 rounded-xl bg-amber-100 px-4 py-3 text-base text-amber-950">
            Tu cuenta no está activa. Si enviaste una solicitud en{' '}
            <Link to={ROUTES.SOLICITUD} className="font-semibold underline">
              /solicitud
            </Link>
            , espera la aprobación del administrador antes de iniciar sesión.
          </p>
        )}

        <form
          id="login-form"
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-5 rounded-2xl bg-white p-5 shadow-xl"
          noValidate
        >
          <ViewApiHint route={loginRoute} />

          {!isAdmin && (
            <p className="text-sm leading-relaxed text-text-secondary">
              Flujo operativo:{' '}
              <Link to={ROUTES.SOLICITUD} className="font-medium text-primary-700">
                solicita acceso
              </Link>{' '}
              (POST /api/auth/solicitud) → el admin aprueba → inicia sesión aquí.
              Una cédula recién solicitada (p. ej. V18765432) no puede entrar
              mientras esté PENDIENTE.
            </p>
          )}

          <Input
            label="Cédula *"
            placeholder="V12345678"
            autoComplete="username"
            inputMode="text"
            error={errors.cedula?.message}
            {...register('cedula')}
          />
          <Input
            label="Credencial oficial (si aplica)"
            placeholder={isAdmin ? 'ADMIN-001' : 'RC-AR-0012'}
            error={errors.credencialOficialId?.message}
            {...register('credencialOficialId')}
          />

          {errors.root && (
            <p className="text-sm font-medium text-danger-500" role="alert">
              {errors.root.message}
            </p>
          )}

          {isAdmin ? (
            <Link
              to={ROUTES.BOOTSTRAP_ADMIN}
              className="text-center text-base font-medium text-primary-700"
            >
              ¿Primera vez? Registrar administrador
            </Link>
          ) : (
            <Link
              to={ROUTES.SOLICITUD}
              className="text-center text-base font-medium text-primary-700"
            >
              ¿No tienes cuenta? Solicita acceso
            </Link>
          )}

          <LopnnaLegalNotice variant="identity" />
        </form>
      </div>

      <div className="sticky bottom-0 border-t border-primary-900/30 bg-primary-800 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <Button
          type="submit"
          form="login-form"
          className="w-full"
          isLoading={isSubmitting}
        >
          Iniciar sesión
        </Button>
      </div>
    </div>
  );
};
