import { apiClient } from '@/api/client';
import type { ApiResponse } from '@/api/catalogTypes';
import type {
  CreateNnaPayload,
  CreateNnaResponse,
  CierreLegalPayload,
  NnaListData,
  NnaListQuery,
  NnaRecord,
  TimelineEvent,
  TimelineResponse,
  UploadPhotoResponse,
} from '@/api/nnaTypes';
import { API_ENDPOINTS } from '@/constants/routes';

export const fetchNnaList = async (
  query: NnaListQuery = {},
): Promise<NnaListData> => {
  const { data } = await apiClient.get<ApiResponse<NnaListData>>(
    API_ENDPOINTS.NNA,
    { params: query },
  );
  return data.data;
};

export const fetchNnaById = async (id: string): Promise<NnaRecord> => {
  const { data } = await apiClient.get<ApiResponse<{ nna: NnaRecord }>>(
    API_ENDPOINTS.NNA_BY_ID(id),
  );
  return data.data.nna;
};

export const uploadNnaPhoto = async (file: File): Promise<UploadPhotoResponse> => {
  const formData = new FormData();
  formData.append('archivo', file);

  const { data } = await apiClient.post<ApiResponse<UploadPhotoResponse>>(
    API_ENDPOINTS.NNA_UPLOAD_PHOTO,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return data.data;
};

export const createNna = async (
  payload: CreateNnaPayload,
): Promise<CreateNnaResponse> => {
  const { data } = await apiClient.post<ApiResponse<CreateNnaResponse>>(
    API_ENDPOINTS.NNA,
    payload,
  );
  return data.data;
};

export const appendTimelineEvent = async (
  nnaId: string,
  evento: TimelineEvent,
): Promise<TimelineResponse> => {
  const { data } = await apiClient.patch<ApiResponse<TimelineResponse>>(
    API_ENDPOINTS.NNA_TIMELINE(nnaId),
    evento,
  );
  return data.data;
};

export const submitCierreLegal = async (
  nnaId: string,
  payload: CierreLegalPayload,
): Promise<TimelineResponse> => {
  const { data } = await apiClient.post<ApiResponse<TimelineResponse>>(
    API_ENDPOINTS.NNA_LEGAL_CLOSURE(nnaId),
    payload,
  );
  return data.data;
};

export const uploadNnaArchivo = async (
  nnaId: string,
  file: File,
  tipo: 'FOTO_ROSTRO' | 'ACTA_ENTREGA',
): Promise<{ url: string }> => {
  const formData = new FormData();
  formData.append('archivo', file);
  formData.append('tipo', tipo);

  const { data } = await apiClient.post<
    ApiResponse<{
      fotoUrl?: string;
      archivo?: { url: string };
    }>
  >(API_ENDPOINTS.NNA_ARCHIVOS(nnaId), formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  const url = data.data.fotoUrl ?? data.data.archivo?.url;
  if (!url) throw new Error('No se recibió URL del archivo');
  return { url };
};
