
import { z } from 'zod'

const precio = z
  .number({ error: 'Ingresá un precio válido' })
  .finite()
  .min(0, 'El precio no puede ser negativo')
  .max(9999999999.99, 'Precio demasiado grande')

const orden = z
  .number({ error: 'Ingresá un orden válido' })
  .int('El orden debe ser entero')
  .min(0, 'El orden no puede ser negativo')

export const promocionSchema = z
  .object({
    titulo: z.string().trim()
      .min(2, 'Ingresá al menos 2 caracteres')
      .max(120, 'Máximo 120 caracteres'),

    descripcion: z.string().trim().max(2000),

    precio,
    orden,

    activa: z.boolean(),
    disponible: z.boolean(),

    inicio: z.string(),
    fin: z.string(),
  })
  .refine(
    (datos) =>
      !datos.inicio ||
      !datos.fin ||
      new Date(datos.fin) > new Date(datos.inicio),
    {
      message: 'El fin debe ser posterior al inicio',
      path: ['fin'],
    }
  )

export const galeriaSchema = z.object({
  titulo: z.string().trim()
    .min(2, 'Ingresá al menos 2 caracteres')
    .max(120, 'Máximo 120 caracteres'),

  descripcion: z.string().trim().max(2000),
  orden,
  activo: z.boolean(),
})

export const valoresPromocion = {
  titulo: '',
  descripcion: '',
  precio: 0,
  orden: 0,
  activa: false,
  disponible: true,
  inicio: '',
  fin: '',
}

export const valoresGaleria = {
  titulo: '',
  descripcion: '',
  orden: 0,
  activo: false,
}

export function fechaParaInput(valor) {
  if (!valor) return ''

  const fecha = new Date(valor)
  if (Number.isNaN(fecha.getTime())) return ''

  const local = new Date(
    fecha.getTime() - fecha.getTimezoneOffset() * 60000
  )

  return local.toISOString().slice(0, 16)
}
