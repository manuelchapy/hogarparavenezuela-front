import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PhotoCaptureInput } from '@/components/ui/PhotoCaptureInput';
import { UbicacionSelector } from '@/components/ui/UbicacionSelector';
import { LopnnaLegalNotice } from '@/components/ui/LopnnaLegalNotice';
import { ViewApiHint } from '@/components/ui/ViewApiHint';
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

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-slate-200 bg-white px-4 py-5">
        <Link
          to={ROUTES.LOGIN_ADMIN}
          className="text-sm font-medium text-primary-700"
        >
          ← Volver al login de administrador
        </Link>
        <h1 className="mt-2 text-xl font-bold text-text-primary">
          Registro del primer administrador
        </h1>
        <p className="mt-1 text-base text-text-secondary">
          Solo disponible si aún no existe un administrador activo en el sistema.
        </p>
      </header>

      <form
        onSubmit={onSubmit}
        className="flex flex-1 flex-col gap-4 overflow-y-auto p-4"
        noValidate
      >
        <LopnnaLegalNotice variant="identity" />

        <ViewApiHint route={ROUTES.BOOTSTRAP_ADMIN} />

        <Input
          label="Nombre completo *"
          {...register('nombreCompleto')}
          error={errors.nombreCompleto?.message}
        />
        <Input
          label="Cédula *"
          placeholder="V12345678"
          {...register('cedula')}
          error={errors.cedula?.message}
        />
        <Input
          label="Teléfono *"
          placeholder="+584121234567"
          {...register('telefono')}
          error={errors.telefono?.message}
        />
        <Input
          label="Secreto de bootstrap *"
          type="password"
          autoComplete="off"
          placeholder="Proporcionado por el equipo técnico"
          {...register('bootstrapSecret')}
          error={errors.bootstrapSecret?.message}
        />

        <label className="flex min-h-12 items-center gap-3 text-base">
          <input
            type="checkbox"
            className="h-5 w-5"
            checked={hasCredencial}
            onChange={(e) => setValue('hasCredencial', e.target.checked)}
          />
          Tengo credencial oficial
        </label>

        {hasCredencial ? (
          <>
            <Input
              label="ID credencial oficial *"
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

        {submitError && (
          <p className="text-sm font-medium text-danger-500" role="alert">
            {submitError}
          </p>
        )}
      </form>

      <div className="sticky bottom-0 border-t border-slate-200 bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <Button
          type="button"
          className="w-full"
          isLoading={isSubmitting}
          onClick={onSubmit}
        >
          Crear administrador
        </Button>
      </div>
    </div>
  );
};
