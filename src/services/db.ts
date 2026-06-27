import Dexie, { type EntityTable } from 'dexie';
import type { CatalogCache } from '@/api/catalogTypes';
import type { GeoListCache } from '@/api/geoTypes';
import type { PendingNnaCreate } from '@/api/nnaTypes';
import type { PendingMutation } from '@/services/syncTypes';
import type { NnaCacheRow } from '@/services/nnaCacheService';

class HogarDatabase extends Dexie {
  pendingMutations!: EntityTable<PendingMutation, 'id'>;
  catalog!: EntityTable<CatalogCache, 'id'>;
  geoCache!: EntityTable<GeoListCache, 'id'>;
  pendingNnaCreates!: EntityTable<PendingNnaCreate, 'id'>;
  nnaCache!: EntityTable<NnaCacheRow, '_id'>;

  constructor() {
    super('hogarparavenezuela-db');
    this.version(1).stores({
      pendingMutations: '++id, type, createdAt',
      catalog: 'id, updatedAt',
    });
    this.version(2).stores({
      pendingMutations: '++id, type, createdAt',
      catalog: 'id, updatedAt',
      geoCache: 'id, updatedAt',
    });
    this.version(3).stores({
      pendingMutations: '++id, type, createdAt',
      catalog: 'id, updatedAt',
      geoCache: 'id, updatedAt',
      pendingNnaCreates: '++id, idOfflineFallback, createdAt',
    });
    this.version(4).stores({
      pendingMutations: '++id, type, createdAt',
      catalog: 'id, updatedAt',
      geoCache: 'id, updatedAt',
      pendingNnaCreates: '++id, idOfflineFallback, createdAt',
      nnaCache: '_id, idUnico, idOfflineFallback, cachedAt',
    });
  }
}

export const db = new HogarDatabase();
