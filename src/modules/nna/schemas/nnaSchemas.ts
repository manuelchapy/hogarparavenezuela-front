import { z } from 'zod';

const ubicacionSchema = z.object({
  state: z.string().min(1, 'Selecciona un estado'),
  city: z.string().min(1, 'Selecciona una ciudad'),
  municipality: z.string(),
  parish: z.string(),
});

const vozDelNnaSchema = z
  .object({
    fueEscuchado: z.boolean(),
    manifestacion: z.string().max(2000).optional(),
    justificacionNoEscucha: z.string().max(2000).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.fueEscuchado && !data.manifestacion?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Registra la manifestación del NNA (Art. 80 LOPNNA)',
        path: ['manifestacion'],
      });
    }
    if (!data.fueEscuchado && !data.justificacionNoEscucha?.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Justifica por qué no fue posible escuchar al NNA',
        path: ['justificacionNoEscucha'],
      });
    }
  });

export const nnaRegisterSchema = z
  .object({
    nombre: z.string().max(120).optional(),
    nombrePadres: z.string().max(200).optional(),
    sexo: z.enum(['F', 'M', 'DESCONOCIDO'], {
      required_error: 'Selecciona el sexo',
    }),
    edadAparente: z.enum(
      ['LACTANTE', 'PREESCOLAR', 'ESCOLAR', 'ADOLESCENTE'],
      { required_error: 'Selecciona la edad aparente' },
    ),
    rasgosIdentificativos: z
      .string()
      .min(3, 'Describe rasgos identificativos (mín. 3 caracteres)')
      .max(2000),
    vozDelNna: vozDelNnaSchema.optional(),
    lugarExacto: z
      .string()
      .min(3, 'Indica el lugar exacto del hallazgo')
      .max(500),
    fechaHora: z.string().min(1, 'Indica fecha y hora del hallazgo'),
    useGps: z.boolean(),
    gpsLng: z.number().optional(),
    gpsLat: z.number().optional(),
    ubicacion: ubicacionSchema,
    ubicacionNombre: z
      .string()
      .min(3, 'Nombre del sitio para el evento inicial')
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
        message: 'vozDelNna es obligatorio para adolescentes (Art. 80 LOPNNA)',
        path: ['vozDelNna'],
      });
    }
  });

export type NnaRegisterForm = z.infer<typeof nnaRegisterSchema> & {
  photoFile?: File;
};

export const timelineEventSchema = z
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
      (data.tipoEvent === 'TRASLADO' || data.tipoEvent === 'INGRESO_REFUGIO') &&
      !data.entidadAtencionId?.trim()
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Traslado e ingreso a refugio requieren entidad de atención',
        path: ['entidadAtencionId'],
      });
    }
  });

export type TimelineEventForm = z.infer<typeof timelineEventSchema>;

export const cierreLegalFormSchema = z.object({
  codigoActaEntrega: z.string().min(3).max(64),
  autoridadNombre: z.string().min(2).max(120),
  autoridadCredencial: z.string().min(3).max(64),
  scannedActaUrl: z.string().url('URL del acta escaneada requerida'),
  notificadoAlCpnna: z.boolean(),
  archivadoPorRescatista: z.boolean(),
});

export type CierreLegalForm = z.infer<typeof cierreLegalFormSchema>;
