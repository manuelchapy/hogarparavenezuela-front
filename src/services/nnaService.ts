import {
  appendTimelineEvent,
  createNna,
  uploadNnaPhoto,
} from '@/api/nnaApi';
import type {
  CreateNnaPayload,
  CreateNnaPayloadWithoutPhoto,
  CreateNnaResponse,
  PendingNnaCreate,
  TimelineEvent,
} from '@/api/nnaTypes';
import { API_ENDPOINTS } from '@/constants/routes';
import { db } from '@/services/db';
import { compressImage, generateOfflineId } from '@/services/imageCompression';
import {
  searchCachedNnaById,
  upsertNnaListItems,
} from '@/services/nnaCacheService';
import { buildUbicacionPayload } from '@/services/geoService';
import { isNetworkOrServerError } from '@/utils/apiErrors';
import type { NnaRegisterForm } from '@/modules/nna/schemas/nnaSchemas';

export const buildCreatePayloadFromForm = (
  form: NnaRegisterForm,
  ids: { idOfflineFallback: string; eventoId: string },
  fotoUrl: string,
): CreateNnaPayload => {
  const ubicacion = buildUbicacionPayload({
    state: form.ubicacion.state,
    city: form.ubicacion.city,
    municipality: form.ubicacion.municipality || undefined,
    parish: form.ubicacion.parish || undefined,
  });

  if (!ubicacion) {
    throw new Error('Ubicación incompleta');
  }

  return {
    idOfflineFallback: ids.idOfflineFallback,
    fotoUrl,
    datosNna: {
      nombre: form.nombre?.trim() || 'Desconocido/No recuerda',
      nombrePadres: form.nombrePadres?.trim() || 'Desconocido/No recuerda',
      sexo: form.sexo,
      edadAparente: form.edadAparente,
      rasgosIdentificativos: form.rasgosIdentificativos,
    },
    ...(form.edadAparente === 'ADOLESCENTE' && form.vozDelNna
      ? { vozDelNna: form.vozDelNna }
      : {}),
    hallazgo: {
      fechaHora: new Date(form.fechaHora).toISOString(),
      lugarExacto: form.lugarExacto,
      ...(form.useGps &&
      form.gpsLng !== undefined &&
      form.gpsLat !== undefined
        ? { posicionGps: { coordinates: [form.gpsLng, form.gpsLat] } }
        : {}),
    },
    ubicacion,
    eventoInicial: {
      eventoId: ids.eventoId,
      tipoEvent: 'REGISTRO_INICIAL',
      ubicacionNombre: form.ubicacionNombre,
      estadoSalud: form.estadoSalud,
      observaciones:
        form.observaciones || 'Registro inicial del NNA en sitio de hallazgo.',
    },
  };
};

export const buildOfflinePayloadFromForm = (
  form: NnaRegisterForm,
  ids: { idOfflineFallback: string; eventoId: string },
): CreateNnaPayloadWithoutPhoto => {
  const full = buildCreatePayloadFromForm(form, ids, 'pending');
  const { fotoUrl: _fotoUrl, ...rest } = full;
  return rest;
};

export const queueOfflineNnaCreate = async (
  form: NnaRegisterForm,
  cedulaRescatista: string,
): Promise<{ idOfflineFallback: string; queueId: number }> => {
  if (!form.photoFile) throw new Error('Foto requerida');

  const compressed = await compressImage(form.photoFile);
  const idOfflineFallback = generateOfflineId(cedulaRescatista);
  const eventoId = crypto.randomUUID();
  const payload = buildOfflinePayloadFromForm(form, {
    idOfflineFallback,
    eventoId,
  });

  const queueId = await db.pendingNnaCreates.add({
    idOfflineFallback,
    eventoId,
    photoBlob: compressed.file,
    photoName: compressed.file.name,
    payload,
    createdAt: Date.now(),
  });

  return { idOfflineFallback, queueId: queueId as number };
};

export const registerNnaOnline = async (
  form: NnaRegisterForm,
  cedulaRescatista: string,
): Promise<CreateNnaResponse> => {
  if (!form.photoFile) throw new Error('Foto requerida');

  const compressed = await compressImage(form.photoFile);
  const { fotoUrl } = await uploadNnaPhoto(compressed.file);
  const idOfflineFallback = generateOfflineId(cedulaRescatista);
  const eventoId = crypto.randomUUID();
  const payload = buildCreatePayloadFromForm(form, { idOfflineFallback, eventoId }, fotoUrl);

  return createNna(payload);
};

export const registerNna = async (
  form: NnaRegisterForm & { photoFile: File },
  cedulaRescatista: string,
): Promise<
  | { mode: 'online'; result: CreateNnaResponse }
  | { mode: 'offline'; idOfflineFallback: string }
> => {
  if (!navigator.onLine) {
    const { idOfflineFallback } = await queueOfflineNnaCreate(
      form,
      cedulaRescatista,
    );
    return { mode: 'offline', idOfflineFallback };
  }

  try {
    const result = await registerNnaOnline(form, cedulaRescatista);
    return { mode: 'online', result };
  } catch (error) {
    if (!isNetworkOrServerError(error)) {
      throw error;
    }
    const { idOfflineFallback } = await queueOfflineNnaCreate(
      form,
      cedulaRescatista,
    );
    return { mode: 'offline', idOfflineFallback };
  }
};

export const listPendingNnaCreates = async (): Promise<PendingNnaCreate[]> => {
  return db.pendingNnaCreates.orderBy('createdAt').reverse().toArray();
};

export const getPendingNnaCreateCount = async (): Promise<number> => {
  return db.pendingNnaCreates.count();
};

export const processPendingNnaCreates = async (): Promise<{
  synced: number;
  failed: number;
}> => {
  if (!navigator.onLine) return { synced: 0, failed: 0 };

  const pending = await db.pendingNnaCreates.orderBy('createdAt').toArray();
  let synced = 0;
  let failed = 0;

  for (const item of pending) {
    const success = await syncPendingNnaCreate(item);
    if (success) {
      await db.pendingNnaCreates.delete(item.id!);
      synced += 1;
    } else {
      failed += 1;
    }
  }

  return { synced, failed };
};

const syncPendingNnaCreate = async (
  item: PendingNnaCreate,
): Promise<boolean> => {
  try {
    const file = new File([item.photoBlob], item.photoName, {
      type: item.photoBlob.type || 'image/jpeg',
    });
    const { fotoUrl } = await uploadNnaPhoto(file);
    await createNna({ ...item.payload, fotoUrl });
    return true;
  } catch {
    return false;
  }
};

export const addTimelineEvent = async (
  nnaId: string,
  evento: TimelineEvent,
): Promise<void> => {
  if (!navigator.onLine) {
    const { enqueueMutation } = await import('@/services/syncService');
    await enqueueMutation(
      'PATCH_TIMELINE',
      API_ENDPOINTS.NNA_TIMELINE(nnaId),
      evento,
    );
    return;
  }

  await appendTimelineEvent(nnaId, evento);
};

export const searchNnaByIdUnico = async (
  idUnico: string,
): Promise<{ _id: string; idUnico: string } | null> => {
  const query = idUnico.trim().toLowerCase();
  if (!query) return null;

  if (!navigator.onLine) {
    return searchCachedNnaById(query);
  }

  const { fetchNnaList } = await import('@/api/nnaApi');
  const data = await fetchNnaList({ limit: 50 });
  await upsertNnaListItems(data.items);
  const match = data.items.find((item) => {
    const candidates = [item.idUnico, item.idOfflineFallback].filter(
      (id): id is string => typeof id === 'string' && id.length > 0,
    );
    return candidates.some((id) => id.toLowerCase() === query);
  });
  if (!match) return searchCachedNnaById(query);
  const resolvedId = match.idUnico ?? match.idOfflineFallback ?? match._id;
  return { _id: match._id, idUnico: resolvedId };
};
