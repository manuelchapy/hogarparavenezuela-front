import { z } from 'zod';
import i18n from '@/i18n';

const ubicacionSchema = () =>
  z.object({
    state: z.string().min(1, i18n.t('validation.selectState')),
    city: z.string().min(1, i18n.t('validation.selectCity')),
    municipality: z.string(),
    parish: z.string(),
  });

const vozDelNnaSchema = () =>
  z
    .object({
      fueEscuchado: z.boolean(),
      manifestacion: z.string().max(2000).optional(),
      justificacionNoEscucha: z.string().max(2000).optional(),
    })
    .superRefine((data, ctx) => {
      if (data.fueEscuchado && !data.manifestacion?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: i18n.t('validation.manifestationRequired'),
          path: ['manifestacion'],
        });
      }
      if (!data.fueEscuchado && !data.justificacionNoEscucha?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: i18n.t('validation.noListenJustification'),
          path: ['justificacionNoEscucha'],
        });
      }
    });

export const createNnaRegisterSchema = () =>
  z
    .object({
      nombre: z.string().max(120).optional(),
      nombrePadres: z.string().max(200).optional(),
      sexo: z.enum(['F', 'M', 'DESCONOCIDO'], {
        required_error: i18n.t('validation.selectSex'),
      }),
      edadAparente: z.enum(
        ['LACTANTE', 'PREESCOLAR', 'ESCOLAR', 'ADOLESCENTE'],
        { required_error: i18n.t('validation.selectAge') },
      ),
      rasgosIdentificativos: z
        .string()
        .min(3, i18n.t('validation.traitsMin'))
        .max(2000),
      vozDelNna: vozDelNnaSchema().optional(),
      lugarExacto: z
        .string()
        .min(3, i18n.t('validation.findingPlace'))
        .max(500),
      fechaHora: z.string().min(1, i18n.t('validation.findingDate')),
      useGps: z.boolean(),
      gpsLng: z.number().optional(),
      gpsLat: z.number().optional(),
      ubicacion: ubicacionSchema(),
      ubicacionNombre: z
        .string()
        .min(3, i18n.t('validation.siteNameMin'))
        .max(300),
      estadoSalud: z.enum([
        'ESTABLE',
        'REQUIERE_ATENCION_URGENTE',
        'CON_LESIONES_VISIBLES',
      ]),
      observaciones: z.string().max(2000).optional(),
    })
    .superRefine((data, ctx) => {
      if (data.edadAparente === 'ADOLESCENTE' && !data.vozDelNna) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: i18n.t('validation.adolescentVoice'),
          path: ['vozDelNna'],
        });
      }
    });

/** @deprecated Use createNnaRegisterSchema() for i18n-aware validation */
export const nnaRegisterSchema = createNnaRegisterSchema();

export type NnaRegisterForm = z.infer<ReturnType<typeof createNnaRegisterSchema>> & {
  photoFile?: File;
};

export const createTimelineEventSchema = () =>
  z
    .object({
      tipoEvent: z.enum([
        'TRASLADO',
        'ATENCION_MEDICA',
        'INGRESO_REFUGIO',
      ]),
      ubicacionNombre: z.string().min(3).max(300),
      entidadAtencionId: z.string().optional(),
      estadoSalud: z.enum([
        'ESTABLE',
        'REQUIERE_ATENCION_URGENTE',
        'CON_LESIONES_VISIBLES',
      ]),
      observaciones: z.string().max(2000).optional(),
    })
    .superRefine((data, ctx) => {
      if (
        (data.tipoEvent === 'TRASLADO' ||
          data.tipoEvent === 'INGRESO_REFUGIO') &&
        !data.entidadAtencionId?.trim()
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: i18n.t('validation.entityRequired'),
          path: ['entidadAtencionId'],
        });
      }
    });

export const timelineEventSchema = createTimelineEventSchema();

export type TimelineEventForm = z.infer<ReturnType<typeof createTimelineEventSchema>>;

export const createLegalClosureFormSchema = () =>
  z.object({
    codigoActaEntrega: z.string().min(3).max(64),
    autoridadNombre: z.string().min(2).max(120),
    autoridadCredencial: z.string().min(3).max(64),
    scannedActaUrl: z
      .string()
      .url(i18n.t('validation.actaUrlRequired')),
    notificadoAlCpnna: z.boolean(),
    archivadoPorRescatista: z.boolean(),
  });

export const legalClosureFormSchema = createLegalClosureFormSchema();

export type LegalClosureForm = z.infer<ReturnType<typeof createLegalClosureFormSchema>>;

/** @deprecated Use LegalClosureForm */
export type CierreLegalForm = LegalClosureForm;

/** @deprecated Use legalClosureFormSchema */
export const cierreLegalFormSchema = legalClosureFormSchema;
