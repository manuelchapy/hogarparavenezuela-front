import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import {
  nnaRegisterSchema,
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
  const navigate = useNavigate();
  const { user } = useAuth();
  const refreshPendingCount = useSyncStore((s) => s.refreshPendingCount);
  const [step, setStep] = useState(0);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isGpsLoading, setIsGpsLoading] = useState(false);

  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const form = useForm<NnaRegisterForm>({
    resolver: zodResolver(nnaRegisterSchema),
    defaultValues,
    mode: 'onTouched',
  });

  const edadAparente = form.watch('edadAparente');
  const isAdolescente = edadAparente === 'ADOLESCENTE';

  const captureGps = () => {
    if (!navigator.geolocation) {
      setSubmitError('GPS no disponible en este dispositivo');
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
        setSubmitError('No se pudo obtener la ubicación GPS');
        setIsGpsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000 },
    );
  };

  const nextStep = async () => {
    if (step === 0) {
      if (!photoFile) {
        setPhotoError('Debes capturar o seleccionar una foto');
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
          message: 'Completa la voz del NNA para adolescentes',
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
      setSubmitError('Sesión inválida — vuelve a iniciar sesión');
      return;
    }

    if (!photoFile) {
      setPhotoError('Debes capturar o seleccionar una foto');
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
            message: `Registro guardado offline (${result.idOfflineFallback}). Se sincronizará al reconectar.`,
          },
        });
        return;
      }

      navigate(
        ROUTES.NNA_DETAIL.replace(':id', result.result.nna._id),
        {
          state: {
            message: result.result.created
              ? `NNA registrado: ${result.result.nna.idUnico}`
              : `Registro ya existía: ${result.result.nna.idUnico}`,
          },
        },
      );
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Error al registrar el NNA. Intenta de nuevo.',
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
