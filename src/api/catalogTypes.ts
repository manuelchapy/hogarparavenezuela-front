import type { CatalogKey } from '@/constants/catalogKeys';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface CatalogItem {
  code: string;
  label: string;
  description: string | null;
  order: number;
}

export interface CatalogTransition {
  eventType: string;
  statusCode: string;
}

export interface CatalogDomain {
  key: CatalogKey;
  name: string;
  field: string;
  items: CatalogItem[];
  transitions?: CatalogTransition[];
  statusMapping?: Record<string, string>;
}

export interface CatalogIndexDomain {
  key: CatalogKey;
  name: string;
  field: string;
  itemCount: number;
}

export interface CatalogIndexData {
  module: string;
  routes: {
    domains: string;
    full: string;
    byKey: string;
  };
  count: number;
  domains: CatalogIndexDomain[];
}

export interface CatalogFullData {
  version: string;
  domains: CatalogDomain[];
}

export interface CatalogByKeyData {
  catalog: CatalogDomain;
}

export interface CatalogSelectOption {
  value: string;
  label: string;
  description?: string | null;
}

export interface CatalogCache {
  id: string;
  data: CatalogFullData;
  updatedAt: number;
}
