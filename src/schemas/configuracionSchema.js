
import { z } from 'zod'

export const DIAS = [
  { id: 'lunes', nombre: 'Lunes' },
  { id: 'martes', nombre: 'Martes' },
  { id: 'miercoles', nombre: 'Miércoles' },
  { id: 'jueves', nombre: 'Jueves' },
  { id: 'viernes', nombre: 'Viernes' },
  { id: 'sabado', nombre: 'Sábado' },
  { id: 'domingo', nombre: 'Domingo' },
]

export const METODOS_PAGO = [
  { id: 'efectivo', nombre: 'Efectivo' },
  { id: 'transferencia', nombre: 'Transferencia' },
]

export const MODALIDADES_ENTREGA = [
  { id: 'retiro', nombre: 'Retiro en el local' },
  { id: 'domicilio', nombre: 'Envío a domicilio' },
]

export const datosLocalSchema = z.object({
  nombre_negocio: z.string().trim()
    .min(2, 'Ingresá el nombre del negocio')
    .max(120),

  descripcion: z.string().trim().max(2000),

  whatsapp: z.string().trim()
    .refine(
      (valor) =>
        !valor || /^\+?[0-9\s()-]{8,25}$/.test(valor),
      'Ingresá un WhatsApp válido, con código de país'
    ),

  instagram: z.string().trim().max(200),
  direccion: z.string().trim().max(300),

  costo_envio: z.number()
    .finite('Ingresá un costo válido')
    .min(0, 'El costo no puede ser negativo'),

  metodos_pago: z.array(
    z.enum(['efectivo', 'transferencia'])
  ).min(1, 'Seleccioná al menos un método de pago'),

  modalidades_entrega: z.array(
    z.enum(['retiro', 'domicilio'])
  ).min(1, 'Seleccioná al menos una modalidad'),
})

export const valoresDatosLocal = {
  nombre_negocio: 'Sky Burger',
  descripcion: '',
  whatsapp: '',
  instagram: '',
  direccion: '',
  costo_envio: 0,
  metodos_pago: ['efectivo', 'transferencia'],
  modalidades_entrega: ['retiro', 'domicilio'],
}

const HORA = /^([01]\d|2[0-3]):[0-5]\d$/

export function horariosVacios() {
  return Object.fromEntries(
    DIAS.map(({ id }) => [id, []])
  )
}

export function normalizarHorarios(valor) {
  const resultado = horariosVacios()

  if (!valor || typeof valor !== 'object' ||
      Array.isArray(valor)) {
    return resultado
  }

  for (const { id } of DIAS) {
    const turnos = valor[id]

    if (Array.isArray(turnos)) {
      resultado[id] = turnos
        .filter((turno) =>
          turno &&
          typeof turno.desde === 'string' &&
          typeof turno.hasta === 'string'
        )
        .map(({ desde, hasta }) => ({ desde, hasta }))
    }
  }

  return resultado
}

export function validarHorarios(horarios) {
  for (const { id, nombre } of DIAS) {
    const turnos = horarios[id] ?? []

    if (!Array.isArray(turnos)) {
      return `Los horarios de ${nombre} son inválidos`
    }

    const ordenados = [...turnos].sort(
      (a, b) => a.desde.localeCompare(b.desde)
    )

    for (let i = 0; i < ordenados.length; i++) {
      const { desde, hasta } = ordenados[i]

      if (!HORA.test(desde) || !HORA.test(hasta)) {
        return `Revisá el formato de horario del ${nombre}`
      }

      if (desde >= hasta) {
        return `En ${nombre}, el cierre debe ser posterior a la apertura`
      }

      if (i > 0 && ordenados[i - 1].hasta > desde) {
        return `Hay turnos superpuestos el ${nombre}`
      }
    }
  }

  return null
}
