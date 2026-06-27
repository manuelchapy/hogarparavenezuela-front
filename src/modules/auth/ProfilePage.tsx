import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { UbicacionSelector } from '@/components/ui/UbicacionSelector';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/hooks/useAuth';
import {
  profileSchema,
  type ProfileForm,
} from '@/modules/auth/schemas/authSchemas';
import { getAuthErrorMessage, updateUserProfile } from '@/services/authService';

export const ProfilePage = () => {
  const { user, setUser } = useAuth();

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
    <div className="flex flex-1 flex-col">
      <header className="border-b border-slate-200 bg-white px-4 py-5">
        <Link to={ROUTES.DASHBOARD} className="text-sm font-medium text-primary-700">
          ← Inicio
        </Link>
        <h1 className="mt-2 text-xl font-bold text-text-primary">Mi perfil</h1>
        <p className="mt-1 text-base text-text-secondary">{user.cedula}</p>
      </header>

      <form onSubmit={onSubmit} className="flex flex-1 flex-col gap-4 overflow-y-auto p-4">
        <div className="rounded-2xl bg-slate-100 p-4 text-base">
          <p>
            <span className="font-medium">Rol:</span> {user.rol.replace(/_/g, ' ')}
          </p>
          <p className="mt-1">
            <span className="font-medium">Estado:</span> {user.estadoCuenta}
          </p>
          {user.institucion && (
            <p className="mt-1">
              <span className="font-medium">Institución:</span> {user.institucion}
            </p>
          )}
          {ubicacionDisplay && (
            <p className="mt-1">
              <span className="font-medium">Ubicación:</span> {ubicacionDisplay}
            </p>
          )}
        </div>

        <Input
          label="Nombre completo"
          {...register('nombreCompleto')}
          error={errors.nombreCompleto?.message}
        />
        <Input
          label="Teléfono"
          {...register('telefono')}
          error={errors.telefono?.message}
        />

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

        {errors.root && (
          <p className="text-sm text-danger-500">{errors.root.message}</p>
        )}
      </form>

      <div className="sticky bottom-0 border-t border-slate-200 bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <Button type="button" className="w-full" isLoading={isSubmitting} onClick={onSubmit}>
          Guardar cambios
        </Button>
      </div>
    </div>
  );
};
