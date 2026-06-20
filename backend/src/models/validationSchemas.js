import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string().email('Debe ser un correo electrónico válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  first_name: z.string().min(1, 'El nombre es obligatorio'),
  last_name: z.string().min(1, 'El apellido es obligatorio'),
  dni: z.string().min(1, 'El RUT/DNI es obligatorio'),
  phone: z.string().optional(),
  address: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Debe ser un correo electrónico válido'),
  password: z.string().min(1, 'La contraseña es obligatoria'),
});

export const createAccountSchema = z.object({
  account_type: z.enum(['VISTA', 'CORRIENTE', 'AHORRO'], {
    errorMap: () => ({ message: 'El tipo de cuenta debe ser VISTA, CORRIENTE o AHORRO' }),
  }),
  initial_deposit: z
    .number()
    .int('El depósito inicial debe ser un número entero (pesos)')
    .min(0, 'El depósito inicial no puede ser negativo')
    .optional()
    .default(0),
});

export const blockAccountSchema = z.object({
  status: z.enum(['active', 'blocked'], {
    errorMap: () => ({ message: 'El estado debe ser active o blocked' }),
  }),
});
