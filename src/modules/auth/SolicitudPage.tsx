import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PhotoCaptureInput } from '@/components/ui/PhotoCaptureInput';
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
import { ViewApiHint } from '@/components/ui/ViewApiHint';
import { useCatalog } from '@/hooks/useCatalog';

export const SolicitudPage = () => {
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

  if (successMessage) {
    return (
      <div className="flex h-dvh flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="text-lg font-semibold text-success-500">Solicitud enviada</p>
        <p className="text-base text-text-secondary">{successMessage}</p>
        <p className="text-sm text-text-secondary">Redirigiendo al login...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-slate-200 bg-white px-4 py-5">
        <Link
          to={ROUTES.LOGIN_OPERATIVO}
          className="text-sm font-medium text-primary-700"
        >
          ← Volver al login operativo
        </Link>
        <h1 className="mt-2 text-xl font-bold text-text-primary">
          Solicitud de acceso
        </h1>
        <p className="mt-1 text-base text-text-secondary">
          Roles operativos: rescatista, protección civil o personal médico
        </p>
      </header>

      <form
        onSubmit={onSubmit}
        className="flex flex-1 flex-col gap-4 overflow-y-auto p-4"
        noValidate
      >
        <LopnnaLegalNotice variant="identity" />

        <ViewApiHint route={ROUTES.SOLICITUD} />

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

        <GeoSelect
          label="Rol solicitado *"
          name="rolSolicitado"
          value={watch('rolSolicitado')}
          onChange={(v) =>
            setValue('rolSolicitado', v as SolicitudForm['rolSolicitado'])
          }
          options={roleOptions}
          placeholder="Selecciona tu rol operativo"
        />

        {institutions.length > 0 && (
          <GeoSelect
            label="Institución (opcional)"
            name="institucionId"
            value={watch('institucionId') ?? ''}
            onChange={(v) => setValue('institucionId', v)}
            options={institutions.map((i) => ({ id: i.id, name: i.nombre }))}
            placeholder="Seleccionar del catálogo"
          />
        )}

        <Input
          label="Institución (texto libre, opcional)"
          {...register('institucion')}
          error={errors.institucion?.message}
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
          Enviar solicitud
        </Button>
      </div>
    </div>
  );
};
