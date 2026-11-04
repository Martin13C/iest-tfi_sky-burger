
import { z } from 'zod'

export const hamburguesaSchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(2, 'Ingresá al menos 2 caracteres')
    .max(120, 'Máximo 120 caracteres'),

  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      'Usá minúsculas, números y guiones'
    )
    .max(160, 'Máximo 160 caracteres'),

  descripcion: z
    .string()
    .trim()
    .max(2000, 'Máximo 2000 caracteres'),

  categoria: z
    .string()
    .trim()
    .min(2, 'Indicá una categoría')
    .max(80, 'Máximo 80 caracteres'),

  precio: z
    .number({
      error: 'Ingresá un precio válido',
    })
    .finite('Ingresá un precio válido')
    .min(0, 'El precio no puede ser negativo')
    .max(9999999999.99, 'El precio es demasiado grande'),

  orden: z
    .number({
      error: 'Ingresá un orden válido',
    })
    .int('El orden debe ser entero')
    .min(0, 'El orden no puede ser negativo'),

  activo: z.boolean(),
  disponible: z.boolean(),
  destacado: z.boolean(),
})

export function crearSlug(texto) {
  return String(texto || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export const valoresHamburguesa = {
  nombre: '',
  slug: '',
  descripcion: '',
  categoria: '',
  precio: 0,
  orden: 0,
  activo: false,
  disponible: true,
  destacado: false,
}
