
import { useEffect, useState } from 'react'
import { FaPlus, FaTrash, FaSave } from 'react-icons/fa'
import { toast } from 'react-toastify'

import {
  DIAS,
  normalizarHorarios,
  validarHorarios,
} from '../../schemas/configuracionSchema'

function resumenTurnos(turnos) {
  if (!turnos?.length) return 'Cerrado'

  return turnos
    .map(({ desde, hasta }) => `${desde}–${hasta}`)
    .join(' · ')
}

export default function ConfiguracionHorarios({
  configuracion,
  guardarAgenda,
}) {
  const [horarios, setHorarios] = useState(() =>
    normalizarHorarios({})
  )

  const [expandido, setExpandido] = useState(null)

  useEffect(() => {
    if (configuracion) {
      setHorarios(
        normalizarHorarios(configuracion.horarios)
      )
    }
  }, [configuracion])

  function actualizarDia(dia, turnos) {
    setHorarios((actual) => ({
      ...actual,
      [dia]: turnos,
    }))
  }

  function alternarDia(dia) {
    const actual = horarios[dia] ?? []

    actualizarDia(
      dia,
      actual.length
        ? []
        : [{ desde: '12:00', hasta: '15:00' }]
    )

    setExpandido(dia)
  }

  function agregarTurno(dia) {
    actualizarDia(dia, [
      ...(horarios[dia] ?? []),
      { desde: '20:00', hasta: '23:00' },
    ])
  }

  function quitarTurno(dia, indice) {
    actualizarDia(
      dia,
      (horarios[dia] ?? []).filter(
        (_, i) => i !== indice
      )
    )
  }

  function cambiarHora(dia, indice, campo, valor) {
    actualizarDia(
      dia,
      (horarios[dia] ?? []).map((turno, i) =>
        i === indice
          ? { ...turno, [campo]: valor }
          : turno
      )
    )
  }

  async function guardar(evento) {
    evento.preventDefault()

    const error = validarHorarios(horarios)

    if (error) {
      toast.error(error)
      return
    }

    try {
      await guardarAgenda.mutateAsync(horarios)
      toast.success('Horarios guardados')
    } catch (err) {
      toast.error(err.message || 'No se pudieron guardar')
    }
  }

  return (
    <form onSubmit={guardar} className="space-y-2">
      <div className="divide-y divide-white/10 rounded-lg border border-white/10 bg-[#1d1d1d]">
        {DIAS.map(({ id, nombre }) => {
          const turnos = horarios[id] ?? []
          const abierto = turnos.length > 0
          const visible = expandido === id

          return (
            <div key={id}>
              <div className="flex min-h-9 items-center gap-2 px-2">
                <input
                  type="checkbox"
                  checked={abierto}
                  onChange={() => alternarDia(id)}
                  aria-label={`Atender el ${nombre}`}
                  className="shrink-0 accent-sky-primary"
                />

                <button
                  type="button"
                  onClick={() =>
                    setExpandido(visible ? null : id)
                  }
                  aria-expanded={visible}
                  className="flex min-w-0 flex-1 items-center justify-between gap-2 py-2 text-left"
                >
                  <span className="w-16 shrink-0 text-[11px] font-semibold">
                    {nombre}
                  </span>

                  <span
                    className="min-w-0 truncate text-right text-[10px] text-white/45"
                    title={resumenTurnos(turnos)}
                  >
                    {resumenTurnos(turnos)}
                  </span>
                </button>
              </div>

              {visible && abierto && (
                <div className="space-y-1.5 border-t border-white/5 px-2 pb-2 pt-2">
                  {turnos.map((turno, indice) => (
                    <div
                      key={`${id}-${indice}`}
                      className="flex items-center gap-1.5"
                    >
                      <input
                        type="time"
                        aria-label={`Apertura ${nombre} turno ${indice + 1}`}
                        value={turno.desde}
                        onChange={(e) =>
                          cambiarHora(
                            id,
                            indice,
                            'desde',
                            e.target.value
                          )
                        }
                        className="h-8 min-w-0 flex-1 rounded-md border border-white/10 bg-sky-surface px-1 text-[11px]"
                      />

                      <span className="text-[10px] text-white/40">
                        a
                      </span>

                      <input
                        type="time"
                        aria-label={`Cierre ${nombre} turno ${indice + 1}`}
                        value={turno.hasta}
                        onChange={(e) =>
                          cambiarHora(
                            id,
                            indice,
                            'hasta',
                            e.target.value
                          )
                        }
                        className="h-8 min-w-0 flex-1 rounded-md border border-white/10 bg-sky-surface px-1 text-[11px]"
                      />

                      <button
                        type="button"
                        onClick={() => quitarTurno(id, indice)}
                        title="Quitar turno"
                        aria-label={`Eliminar turno ${indice + 1} del ${nombre}`}
                        className="grid h-8 w-8 shrink-0 place-items-center rounded-md text-sky-primary hover:bg-sky-primary/10"
                      >
                        <FaTrash size={10} />
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => agregarTurno(id)}
                    className="inline-flex h-7 items-center gap-1.5 px-1 text-[10px] font-bold text-sky-primary"
                  >
                    <FaPlus size={9} />
                    Agregar turno
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <div className="flex items-center justify-between gap-2 pt-1">
        <p className="max-w-[190px] text-[10px] leading-tight text-white/35">
          Los turnos deben terminar el mismo día.
        </p>

        <button
          type="submit"
          disabled={guardarAgenda.isPending}
          className="inline-flex h-9 shrink-0 items-center gap-2 rounded-md bg-sky-primary px-3 text-xs font-bold disabled:opacity-50"
        >
          <FaSave size={11} />
          {guardarAgenda.isPending
            ? 'Guardando...'
            : 'Guardar horarios'}
        </button>
      </div>
    </form>
  )
}
