import { apiClient } from '@/api/client';
import type {
  ApiResponse,
  CatalogByKeyData,
  CatalogDomain,
  CatalogFullData,
  CatalogIndexData,
} from '@/api/catalogTypes';
import type { CatalogKey } from '@/constants/catalogKeys';
import { API_ENDPOINTS } from '@/constants/routes';

export const fetchCatalogIndex = async (): Promise<CatalogIndexData> => {
  const { data } = await apiClient.get<ApiResponse<CatalogIndexData>>(
    API_ENDPOINTS.CATALOG,
  );
  return data.data;
};

export const fetchCatalogAll = async (): Promise<CatalogFullData> => {
  const { data } = await apiClient.get<ApiResponse<CatalogFullData>>(
    API_ENDPOINTS.CATALOG_ALL,
  );
  return data.data;
};

export const fetchCatalogByKey = async (
  key: CatalogKey,
): Promise<CatalogDomain> => {
  const { data } = await apiClient.get<ApiResponse<CatalogByKeyData>>(
    API_ENDPOINTS.CATALOG_BY_KEY(key),
  );
  return data.data.catalog;
};
