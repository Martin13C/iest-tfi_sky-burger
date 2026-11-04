
import { useQuery } from '@tanstack/react-query'
import {
  FaGlobe,
  FaStore,
  FaShoppingBag,
} from 'react-icons/fa'

import { supabase } from '../../config/supabaseClient'

async function obtenerEstado() {
  const { data, error } = await supabase.rpc(
    'estado_local_publico'
  )

  if (error) throw error

  return data
}

function Indicador({ Icono, titulo, valor, activo }) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-lg border border-white/10 bg-sky-background px-3 py-3">
      <Icono
        aria-hidden="true"
        className="shrink-0 text-sm text-sky-primary"
      />

      <div className="min-w-0">
        <p className="text-[11px] text-white/45">
          {titulo}
        </p>

        <p
          className={`mt-0.5 text-sm font-semibold ${
            activo ? 'text-green-400' : 'text-white/75'
          }`}
        >
          {valor}
        </p>
      </div>
    </div>
  )
}

export default function DashboardDueno() {
  const {
    data: estado,
    isPending,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['dueno', 'estado-principal'],
    queryFn: obtenerEstado,
    refetchInterval: 30000,
  })

  const consultando = isPending || isError

  return (
    <div className="min-w-0 space-y-5">
      <header>
        <h1 className="font-heading text-2xl font-bold sm:text-3xl">
          Resumen
        </h1>

        <p className="mt-1 text-xs text-white/45">
          Estado actual de Sky Burger.
        </p>
      </header>

      {isError && (
        <div
          role="alert"
          className="rounded-lg border border-sky-primary/30 bg-sky-primary/10 p-3 text-xs"
        >
          <p>{error.message}</p>

          <button
            type="button"
            onClick={() => refetch()}
            className="mt-2 font-semibold underline"
          >
            Reintentar
          </button>
        </div>
      )}

      <section
        aria-label="Estado del negocio"
        className="grid gap-3 sm:grid-cols-3"
      >
        <Indicador
          Icono={FaGlobe}
          titulo="Sitio"
          valor={
            consultando
              ? 'Consultando...'
              : estado?.sitio_publicado
                ? 'Publicado'
                : 'Suspendido'
          }
          activo={!consultando && estado?.sitio_publicado}
        />

        <Indicador
          Icono={FaStore}
          titulo="Local"
          valor={
            consultando
              ? 'Consultando...'
              : estado?.local_abierto
                ? 'Abierto'
                : 'Cerrado'
          }
          activo={!consultando && estado?.local_abierto}
        />

        <Indicador
          Icono={FaShoppingBag}
          titulo="Pedidos"
          valor={
            consultando
              ? 'Consultando...'
              : estado?.puede_pedir
                ? 'Disponibles'
                : 'No disponibles'
          }
          activo={!consultando && estado?.puede_pedir}
        />
      </section>

      <p className="text-xs leading-relaxed text-white/40">
        Los estados se actualizan automáticamente y dependen
        de la publicación, los horarios y la operación del local.
      </p>
    </div>
  )
}
