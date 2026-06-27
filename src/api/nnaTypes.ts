import type { ApiResponse } from '@/api/catalogTypes';
import type { UbicacionEnriched, UbicacionPayload } from '@/api/geoTypes';

export type NnaStatus =
  | 'EN_SITIO'
  | 'EN_TRANSITO'
  | 'RESGUARDADO'
  | 'ENTREGADO_AUTORIDAD';

export type EdadAparente =
  | 'LACTANTE'
  | 'PREESCOLAR'
  | 'ESCOLAR'
  | 'ADOLESCENTE';

export type SexoNna = 'F' | 'M' | 'DESCONOCIDO';

export type EstadoSalud =
  | 'ESTABLE'
  | 'REQUIERE_ATENCION_URGENTE'
  | 'CON_LESIONES_VISIBLES';

export type TimelineEventType =
  | 'REGISTRO_INICIAL'
  | 'TRASLADO'
  | 'ATENCION_MEDICA'
  | 'INGRESO_REFUGIO'
  | 'ENTREGA_OFICIAL';

export interface DatosNna {
  nombre?: string;
  nombrePadres?: string;
  sexo: SexoNna;
  edadAparente: EdadAparente;
  rasgosIdentificativos: string;
}

export interface VozDelNna {
  fueEscuchado: boolean;
  manifestacion?: string;
  justificacionNoEscucha?: string;
  nivelComprension?: EdadAparente;
}

export interface Hallazgo {
  fechaHora: string;
  lugarExacto: string;
  posicionGps?: {
    coordinates: [number, number];
  };
}

export interface CustodioResponsable {
  nombre: string;
  cedula: string;
  telefono: string;
  institucion: string;
}

export interface TimelineEvent {
  eventoId: string;
  tipoEvent: TimelineEventType;
  fechaHora?: string;
  ubicacionNombre: string;
  entidadAtencionId?: string;
  estadoSalud: EstadoSalud;
  custodioResponsable?: CustodioResponsable;
  observaciones?: string;
  nuevoStatus?: NnaStatus;
}

export interface CierreLegal {
  notificadoAlCpnna?: boolean;
  fechaHoraNotificacion?: string;
  codigoActaEntrega?: string;
  autoridadReceptora?: {
    nombre: string;
    credencial: string;
  };
  scannedActaUrl?: string;
  archivadoPorRescatista?: boolean;
}

export interface NnaRecord {
  _id: string;
  idUnico: string;
  idOfflineFallback?: string;
  statusActual: NnaStatus;
  fotoUrl: string;
  datosNna: DatosNna;
  vozDelNna?: VozDelNna;
  hallazgo: Hallazgo;
  ubicacion: UbicacionEnriched | UbicacionPayload;
  timeline: TimelineEvent[];
  cierreLegal?: CierreLegal;
  createdAt?: string;
  updatedAt?: string;
}

export interface NnaListItem {
  _id: string;
  idUnico?: string;
  idOfflineFallback?: string;
  datosNna: Pick<DatosNna, 'nombre' | 'edadAparente'>;
  statusActual: NnaStatus;
  fotoUrl: string;
  hallazgo: Pick<Hallazgo, 'lugarExacto'>;
  createdAt: string;
}

export interface NnaPagination {
  page: number;
  limit: number;
  total: number;
  hasNextPage: boolean;
}

export interface NnaListData {
  items: NnaListItem[];
  pagination: NnaPagination;
}

export interface NnaListQuery {
  page?: number;
  limit?: number;
  status?: NnaStatus;
  stateId?: string;
  cityId?: string;
}

export interface CreateNnaPayload {
  idOfflineFallback?: string;
  idUnico?: string;
  fotoUrl: string;
  datosNna: DatosNna;
  vozDelNna?: VozDelNna;
  hallazgo: Hallazgo;
  ubicacion: UbicacionPayload;
  eventoInicial?: TimelineEvent;
}

export interface CreateNnaPayloadWithoutPhoto extends Omit<
  CreateNnaPayload,
  'fotoUrl'
> {}

export interface UploadPhotoResponse {
  fotoUrl: string;
  storagePath: string;
}

export interface CreateNnaResponse {
  nna: NnaRecord;
  created: boolean;
}

export interface TimelineResponse {
  nna: NnaRecord;
  duplicated: boolean;
}

export interface CierreLegalPayload {
  eventoId?: string;
  notificadoAlCpnna?: boolean;
  fechaHoraNotificacion?: string;
  codigoActaEntrega: string;
  autoridadReceptora: {
    nombre: string;
    credencial: string;
  };
  scannedActaUrl: string;
  archivadoPorRescatista?: boolean;
}

export interface PendingNnaCreate {
  id?: number;
  idOfflineFallback: string;
  eventoId: string;
  photoBlob: Blob;
  photoName: string;
  payload: CreateNnaPayloadWithoutPhoto;
  createdAt: number;
}

export type NnaApiResponse<T> = ApiResponse<T>;
