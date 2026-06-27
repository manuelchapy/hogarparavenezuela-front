import type { NnaListItem, NnaRecord, NnaStatus } from '@/api/nnaTypes';
import { db } from '@/services/db';

export interface NnaCacheRow {
  _id: string;
  idUnico?: string;
  idOfflineFallback?: string;
  listItem: NnaListItem;
  record?: NnaRecord;
  cachedAt: number;
}

const listItemFromRecord = (record: NnaRecord): NnaListItem => ({
  _id: record._id,
  idUnico: record.idUnico,
  idOfflineFallback: record.idOfflineFallback,
  datosNna: {
    nombre: record.datosNna.nombre,
    edadAparente: record.datosNna.edadAparente,
  },
  statusActual: record.statusActual,
  fotoUrl: record.fotoUrl,
  hallazgo: { lugarExacto: record.hallazgo.lugarExacto },
  createdAt: record.createdAt ?? new Date().toISOString(),
});

export const upsertNnaListItems = async (items: NnaListItem[]): Promise<void> => {
  const now = Date.now();
  await db.transaction('rw', db.nnaCache, async () => {
    for (const item of items) {
      const existing = await db.nnaCache.get(item._id);
      await db.nnaCache.put({
        _id: item._id,
        idUnico: item.idUnico,
        idOfflineFallback: item.idOfflineFallback,
        listItem: item,
        record: existing?.record,
        cachedAt: now,
      });
    }
  });
};

export const upsertNnaRecord = async (record: NnaRecord): Promise<void> => {
  await db.nnaCache.put({
    _id: record._id,
    idUnico: record.idUnico,
    idOfflineFallback: record.idOfflineFallback,
    listItem: listItemFromRecord(record),
    record,
    cachedAt: Date.now(),
  });
};

export const getCachedNnaRecord = async (
  id: string,
): Promise<NnaRecord | null> => {
  const row = await db.nnaCache.get(id);
  return row?.record ?? null;
};

export const listCachedNnaItems = async (filters?: {
  status?: NnaStatus;
}): Promise<NnaListItem[]> => {
  let rows = await db.nnaCache.orderBy('cachedAt').reverse().toArray();
  if (filters?.status) {
    rows = rows.filter((row) => row.listItem.statusActual === filters.status);
  }
  const seen = new Set<string>();
  return rows
    .map((row) => row.listItem)
    .filter((item) => {
      if (seen.has(item._id)) return false;
      seen.add(item._id);
      return true;
    });
};

export const searchCachedNnaById = async (
  query: string,
): Promise<{ _id: string; idUnico: string } | null> => {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return null;

  const rows = await db.nnaCache.toArray();
  const match = rows.find((row) => {
    const ids = [row.idUnico, row.idOfflineFallback, row._id].filter(
      (id): id is string => typeof id === 'string' && id.length > 0,
    );
    return ids.some((id) => id.toLowerCase() === normalized);
  });

  if (!match) return null;
  const resolvedId =
    match.idUnico ?? match.idOfflineFallback ?? match._id;
  return { _id: match._id, idUnico: resolvedId };
};
