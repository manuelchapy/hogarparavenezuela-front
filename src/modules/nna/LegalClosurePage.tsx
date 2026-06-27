import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  cierreLegalFormSchema,
  type CierreLegalForm,
} from '@/modules/nna/schemas/nnaSchemas';
import { submitCierreLegal, uploadNnaArchivo } from '@/api/nnaApi';
import { compressImage } from '@/services/imageCompression';
import { LopnnaLegalNotice } from '@/components/ui/LopnnaLegalNotice';
import { ROUTES } from '@/constants/routes';

export const LegalClosurePage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CierreLegalForm>({
    resolver: zodResolver(cierreLegalFormSchema),
    defaultValues: {
      codigoActaEntrega: '',
      autoridadNombre: '',
      autoridadCredencial: '',
      scannedActaUrl: '',
      notificadoAlCpnna: true,
      archivadoPorRescatista: false,
    },
  });

  const handleActaUpload = async (file: File | undefined) => {
    if (!file || !id) return;

    setIsUploading(true);
    setSubmitError(null);
    try {
      const compressed = await compressImage(file);
      const { url } = await uploadNnaArchivo(id, compressed.file, 'ACTA_ENTREGA');
      setValue('scannedActaUrl', url, { shouldValidate: true });
    } catch {
      setSubmitError('No se pudo subir el acta escaneada');
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    if (!id) return;

    setSubmitError(null);
    try {
      const result = await submitCierreLegal(id, {
        eventoId: crypto.randomUUID(),
        codigoActaEntrega: data.codigoActaEntrega,
        autoridadReceptora: {
          nombre: data.autoridadNombre,
          credencial: data.autoridadCredencial,
        },
        scannedActaUrl: data.scannedActaUrl,
        notificadoAlCpnna: data.notificadoAlCpnna,
        archivadoPorRescatista: data.archivadoPorRescatista,
      });

      navigate(ROUTES.NNA_DETAIL.replace(':id', result.nna._id), {
        state: {
          message: result.duplicated
            ? 'Cierre legal ya registrado'
            : 'Cierre legal completado',
        },
      });
    } catch {
      setSubmitError('No se pudo registrar el cierre legal');
    }
  });

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-slate-200 bg-white px-4 py-5">
        <Link
          to={id ? ROUTES.NNA_DETAIL.replace(':id', id) : ROUTES.NNA_LIST}
          className="text-sm font-medium text-primary-700"
        >
          ← Volver a la ficha
        </Link>
        <h1 className="mt-2 text-xl font-bold text-text-primary">Cierre Legal</h1>
        <p className="mt-1 text-base text-text-secondary">
          Solo Consejeros CPNNA y Administradores
        </p>
      </header>

      <form
        onSubmit={onSubmit}
        className="flex flex-1 flex-col gap-4 overflow-y-auto p-4"
        noValidate
      >
        <LopnnaLegalNotice variant="legalClosure" />

        <Input
          label="Código del acta de entrega *"
          {...register('codigoActaEntrega')}
          error={errors.codigoActaEntrega?.message}
        />
        <Input
          label="Nombre de la autoridad receptora *"
          {...register('autoridadNombre')}
          error={errors.autoridadNombre?.message}
        />
        <Input
          label="Credencial de la autoridad *"
          {...register('autoridadCredencial')}
          error={errors.autoridadCredencial?.message}
        />

        <div className="flex flex-col gap-2">
          <span className="text-base font-medium text-text-primary">
            Acta escaneada *
          </span>
          <input
            type="file"
            accept="image/*,application/pdf"
            disabled={isUploading}
            className="text-base"
            onChange={(e) => void handleActaUpload(e.target.files?.[0])}
          />
          <input type="hidden" {...register('scannedActaUrl')} />
          {errors.scannedActaUrl && (
            <p className="text-sm text-danger-500">
              {errors.scannedActaUrl.message}
            </p>
          )}
        </div>

        <label className="flex min-h-12 items-center gap-3 text-base">
          <input type="checkbox" className="h-5 w-5" {...register('notificadoAlCpnna')} />
          Notificado al CPNNA
        </label>
        <label className="flex min-h-12 items-center gap-3 text-base">
          <input
            type="checkbox"
            className="h-5 w-5"
            {...register('archivadoPorRescatista')}
          />
          Archivado por rescatista
        </label>

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
          isLoading={isSubmitting || isUploading}
          onClick={onSubmit}
        >
          Registrar cierre legal
        </Button>
      </div>
    </div>
  );
};
