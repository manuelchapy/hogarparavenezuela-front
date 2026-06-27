import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import {
  legalClosureFormSchema,
  type LegalClosureForm,
} from '@/modules/nna/schemas/nnaSchemas';
import { submitCierreLegal, uploadNnaArchivo } from '@/api/nnaApi';
import { compressImage } from '@/services/imageCompression';
import { ROUTES } from '@/constants/routes';

export const useLegalClosure = (nnaId: string | undefined) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<LegalClosureForm>({
    resolver: zodResolver(legalClosureFormSchema),
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
    if (!file || !nnaId) return;

    setIsUploading(true);
    setSubmitError(null);
    try {
      const compressed = await compressImage(file);
      const { url } = await uploadNnaArchivo(
        nnaId,
        compressed.file,
        'ACTA_ENTREGA',
      );
      form.setValue('scannedActaUrl', url, { shouldValidate: true });
    } catch {
      setSubmitError(t('legalClosure.uploadActaError'));
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = form.handleSubmit(async (data) => {
    if (!nnaId) return;

    setSubmitError(null);
    try {
      const result = await submitCierreLegal(nnaId, {
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
            ? t('legalClosure.duplicate')
            : t('legalClosure.success'),
        },
      });
    } catch {
      setSubmitError(t('legalClosure.submitError'));
    }
  });

  return {
    form,
    submitError,
    isUploading,
    handleActaUpload,
    onSubmit,
    isSubmitting: form.formState.isSubmitting,
  };
};
