import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { NnaRecord } from '@/api/nnaTypes';
import {
  timelineEventSchema,
  type TimelineEventForm,
} from '@/modules/nna/schemas/nnaSchemas';
import { addTimelineEvent } from '@/services/nnaService';
import { useSyncStore } from '@/store/syncStore';

export const useNnaTimeline = (
  nnaId: string,
  onSuccess: (nna: NnaRecord) => void,
) => {
  const refreshPendingCount = useSyncStore((s) => s.refreshPendingCount);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [offlineQueued, setOfflineQueued] = useState(false);

  const form = useForm<TimelineEventForm>({
    resolver: zodResolver(timelineEventSchema),
    defaultValues: {
      tipoEvent: 'ATENCION_MEDICA',
      ubicacionNombre: '',
      entidadAtencionId: '',
      estadoSalud: 'ESTABLE',
      observaciones: '',
    },
  });

  const tipoEvent = form.watch('tipoEvent');
  const requiresEntidad =
    tipoEvent === 'TRASLADO' || tipoEvent === 'INGRESO_REFUGIO';

  const onSubmit = form.handleSubmit(async (data) => {
    setSubmitError(null);
    setOfflineQueued(false);

    const evento = {
      eventoId: crypto.randomUUID(),
      tipoEvent: data.tipoEvent,
      ubicacionNombre: data.ubicacionNombre,
      estadoSalud: data.estadoSalud,
      ...(data.entidadAtencionId
        ? { entidadAtencionId: data.entidadAtencionId }
        : {}),
      ...(data.observaciones ? { observaciones: data.observaciones } : {}),
    };

    try {
      if (!navigator.onLine) {
        await addTimelineEvent(nnaId, evento);
        await refreshPendingCount();
        setOfflineQueued(true);
        form.reset();
        return;
      }

      const { appendTimelineEvent } = await import('@/api/nnaApi');
      const result = await appendTimelineEvent(nnaId, evento);
      onSuccess(result.nna);
      form.reset();
    } catch {
      setSubmitError('No se pudo registrar el hito');
    }
  });

  return {
    form,
    onSubmit,
    submitError,
    offlineQueued,
    requiresEntidad,
    isSubmitting: form.formState.isSubmitting,
  };
};
