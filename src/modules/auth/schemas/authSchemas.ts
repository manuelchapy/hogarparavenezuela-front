import { z } from 'zod';
import { ROLES } from '@/constants/roles';

const cedulaSchema = z
  .string()
  .trim()
  .regex(/^[VEJvej]-?\d{6,9}$/, 'Formato: V12345678');

const telefonoSchema = z
  .string()
  .trim()
  .regex(/^\+?[0-9]{7,20}$/, 'Teléfono inválido');

const ubicacionSchema = z.object({
  state: z.string().min(1, 'Selecciona un estado'),
  city: z.string().min(1, 'Selecciona una ciudad'),
  municipality: z.string(),
  parish: z.string(),
});

export const loginSchema = z.object({
  cedula: cedulaSchema,
  credencialOficialId: z.string().min(3).max(64).optional().or(z.literal('')),
});

export type LoginForm = z.infer<typeof loginSchema>;

export const solicitudSchema = z
  .object({
    nombreCompleto: z.string().min(3).max(120),
    cedula: cedulaSchema,
    telefono: telefonoSchema,
    rolSolicitado: z.enum([
      ROLES.RESCATISTA_CIVIL,
      ROLES.PROTECCION_CIVIL,
      ROLES.PERSONAL_MEDICO,
    ]),
    institucionId: z.string().optional(),
    institucion: z.string().max(200).optional(),
    hasCredencial: z.boolean(),
    credencialOficialId: z.string().max(64).optional(),
    fotoCedulaFile: z.instanceof(File).optional(),
    fotoCredencialFile: z.instanceof(File).optional(),
    ubicacion: ubicacionSchema,
  })
  .superRefine((data, ctx) => {
    if (data.hasCredencial) {
      if (!data.credencialOficialId?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Indica el ID de credencial oficial',
          path: ['credencialOficialId'],
        });
      }
      if (!data.fotoCredencialFile) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Adjunta foto de la credencial',
          path: ['fotoCredencialFile'],
        });
      }
    } else if (!data.fotoCedulaFile) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Adjunta foto de la cédula',
        path: ['fotoCedulaFile'],
      });
    }
  });

export type SolicitudForm = z.infer<typeof solicitudSchema>;

export const profileSchema = z.object({
  nombreCompleto: z.string().min(3).max(120),
  telefono: telefonoSchema,
  ubicacion: ubicacionSchema,
});

export type ProfileForm = z.infer<typeof profileSchema>;

export const rejectUserSchema = z.object({
  motivoRechazo: z.string().min(10).max(500),
});

export type RejectUserForm = z.infer<typeof rejectUserSchema>;

export const bootstrapAdminSchema = z
  .object({
    nombreCompleto: z.string().min(3).max(120),
    cedula: cedulaSchema,
    telefono: telefonoSchema,
    bootstrapSecret: z.string().min(8, 'Mínimo 8 caracteres'),
    hasCredencial: z.boolean(),
    credencialOficialId: z.string().max(64).optional(),
    fotoCedulaFile: z.instanceof(File).optional(),
    fotoCredencialFile: z.instanceof(File).optional(),
    ubicacion: ubicacionSchema,
  })
  .superRefine((data, ctx) => {
    if (data.hasCredencial) {
      if (!data.credencialOficialId?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Indica el ID de credencial oficial',
          path: ['credencialOficialId'],
        });
      }
      if (!data.fotoCredencialFile) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Adjunta foto de la credencial',
          path: ['fotoCredencialFile'],
        });
      }
    } else if (!data.fotoCedulaFile) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Adjunta foto de la cédula',
        path: ['fotoCedulaFile'],
      });
    }
  });

export type BootstrapAdminForm = z.infer<typeof bootstrapAdminSchema>;
