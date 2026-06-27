import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import {
  createNnaRegisterSchema,
  type NnaRegisterForm,
} from '@/modules/nna/schemas/nnaSchemas';
import { registerNna } from '@/services/nnaService';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/constants/routes';
import { useSyncStore } from '@/store/syncStore';

const defaultValues: Partial<NnaRegisterForm> = {
  nombre: '',
  nombrePadres: '',
  sexo: 'DESCONOCIDO',
  edadAparente: 'ESCOLAR',
  rasgosIdentificativos: '',
  lugarExacto: '',
  fechaHora: new Date().toISOString().slice(0, 16),
  useGps: false,
  ubicacion: { state: '', city: '', municipality: '', parish: '' },
  ubicacionNombre: '',
  estadoSalud: 'ESTABLE',
  observaciones: '',
};

export const useNnaRegister = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const refreshPendingCount = useSyncStore((s) => s.refreshPendingCount);
  const [step, setStep] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isGpsLoading, setIsGpsLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const form = useForm<NnaRegisterForm>({
    resolver: zodResolver(createNnaRegisterSchema()),
    defaultValues,
    mode: 'onTouched',
  });

  const edadAparente = form.watch('edadAparente');
  const isAdolescente = edadAparente === 'ADOLESCENTE';

  const captureGps = () => {
    if (!navigator.geolocation) {
      setSubmitError(t('nna.gpsUnavailable'));
      return;
    }

    setIsGpsLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        form.setValue('useGps', true);
        form.setValue('gpsLng', position.coords.longitude);
        form.setValue('gpsLat', position.coords.latitude);
        setIsGpsLoading(false);
      },
      () => {
        setSubmitError(t('nna.gpsFailed'));
        setIsGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000 },
    );
  };

  const nextStep = async () => {
    if (step === 0) {
      if (!photoFile) {
        setPhotoError(t('nna.photoRequired'));
        return;
      }
      setPhotoError(null);
      setStep(1);
      return;
    }

    const fieldsByStep: (keyof NnaRegisterForm)[][] = [
      [],
      ['sexo', 'edadAparente', 'rasgosIdentificativos'],
      ['lugarExacto', 'fechaHora', 'ubicacion'],
      ['ubicacionNombre', 'estadoSalud'],
    ];

    if (step === 1 && isAdolescente) {
      const voz = form.getValues('vozDelNna');
      if (!voz) {
        form.setError('vozDelNna', {
          message: t('nna.adolescentVoiceRequired'),
        });
        return;
      }
    }

    const valid = await form.trigger(fieldsByStep[step]);
    if (valid) setStep((s) => Math.min(s + 1, 3));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const onSubmit = form.handleSubmit(async (data) => {
    if (!user?.cedula) {
      setSubmitError(t('auth.invalidSession'));
      return;
    }

    if (!photoFile) {
      setPhotoError(t('nna.photoRequired'));
      setStep(0);
      return;
    }

    setSubmitError(null);
    try {
      const result = await registerNna({ ...data, photoFile }, user.cedula);
      await refreshPendingCount();

      if (result.mode === 'offline') {
        navigate(ROUTES.NNA_LIST, {
          state: {
            message: t('nna.registerOfflineSaved', {
              id: result.idOfflineFallback,
            }),
          },
        });
        return;
      }

      navigate(ROUTES.NNA_DETAIL.replace(':id', result.result.nna._id), {
        state: {
          message: result.result.created
            ? t('nna.registerSuccess', { id: result.result.nna.idUnico })
            : t('nna.registerDuplicate', { id: result.result.nna.idUnico }),
        },
      });
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : t('nna.registerError'),
      );
    }
  });

  return {
    form,
    step,
    setStep,
    nextStep,
    prevStep,
    onSubmit,
    submitError,
    isAdolescente,
    captureGps,
    isGpsLoading,
    isSubmitting: form.formState.isSubmitting,
    photoFile,
    setPhotoFile,
    photoError,
    setPhotoError,
  };
};
