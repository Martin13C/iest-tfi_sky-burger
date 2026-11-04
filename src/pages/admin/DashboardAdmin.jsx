
import { useQuery } from '@tanstack/react-query'
import {
  FaHamburger,
  FaTags,
  FaImages,
  FaGlobe,
  FaStore,
  FaShoppingBag,
} from 'react-icons/fa'

import { supabase } from '../../config/supabaseClient'

async function obtenerResumen() {
  const [
    hamburguesas,
    promociones,
    galeria,
    estado,
  ] = await Promise.all([
    supabase
      .from('hamburguesas')
      .select('id', { count: 'exact', head: true }),

    supabase
      .from('promociones')
      .select('id', { count: 'exact', head: true }),

    supabase
      .from('galeria')
      .select('id', { count: 'exact', head: true }),

    supabase.rpc('estado_local_publico'),
  ])

  for (const resultado of [
    hamburguesas,
    promociones,
    galeria,
    estado,
  ]) {
    if (resultado.error) throw resultado.error
  }

  return {
    hamburguesas: hamburguesas.count ?? 0,
    promociones: promociones.count ?? 0,
    galeria: galeria.count ?? 0,
    estado: estado.data,
  }
}

function Metrica({ titulo, valor, Icono }) {
  return (
    <article className="flex min-w-0 items-center gap-3 rounded-xl border border-white/10 bg-sky-surface px-4 py-4">
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-sky-primary/10 text-sky-primary">
        <Icono aria-hidden="true" />
      </div>

      <div className="min-w-0">
        <p className="truncate text-xs text-white/50">
          {titulo}
        </p>

        <p className="mt-0.5 font-heading text-2xl font-bold">
          {valor}
        </p>
      </div>
    </article>
  )
}

function Estado({ titulo, valor, Icono, activo = false }) {
  return (
    <div className="flex min-w-0 items-center gap-3 rounded-lg bg-sky-background px-3 py-3">
      <Icono
        aria-hidden="true"
        className="shrink-0 text-sm text-sky-primary"
      />

      <div className="min-w-0 flex-1">
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

export default function DashboardAdmin() {
  const {
    data,
    isPending,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['admin', 'resumen-principal'],
    queryFn: obtenerResumen,
    refetchInterval: 60000,
  })

  const consultando = isPending || isError
  const estado = data?.estado

  return (
    <div className="min-w-0 space-y-5">
      {/* ENCABEZADO */}
      <header>
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-sky-primary">
          Panel del administrador
        </p>

        <h1 className="mt-1 font-heading text-2xl font-bold sm:text-3xl">
          Resumen
        </h1>

        <p className="mt-1 text-xs text-white/45">
          Información general de Sky Burger.
        </p>
      </header>

      {/* ERROR */}
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

      {/* CONTENIDO DEL SITIO */}
      <section
        aria-label="Contenido del sitio"
        className="grid gap-3 sm:grid-cols-3"
      >
        <Metrica
          titulo="Hamburguesas"
          valor={consultando ? '—' : data.hamburguesas}
          Icono={FaHamburger}
        />

        <Metrica
          titulo="Promociones"
          valor={consultando ? '—' : data.promociones}
          Icono={FaTags}
        />

        <Metrica
          titulo="Fotografías"
          valor={consultando ? '—' : data.galeria}
          Icono={FaImages}
        />
      </section>

      {/* ESTADO OPERATIVO */}
      <section className="rounded-xl border border-white/10 bg-sky-surface p-4">
        <h2 className="font-heading text-base font-bold">
          Estado actual
        </h2>

        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          <Estado
            titulo="Sitio"
            valor={
              consultando
                ? 'Consultando...'
                : estado?.sitio_publicado
                  ? 'Publicado'
                  : 'Suspendido'
            }
            activo={
              !consultando && estado?.sitio_publicado
            }
            Icono={FaGlobe}
          />

          <Estado
            titulo="Local"
            valor={
              consultando
                ? 'Consultando...'
                : estado?.local_abierto
                  ? 'Abierto'
                  : 'Cerrado'
            }
            activo={
              !consultando && estado?.local_abierto
            }
            Icono={FaStore}
          />

          <Estado
            titulo="Pedidos"
            valor={
              consultando
                ? 'Consultando...'
                : estado?.puede_pedir
                  ? 'Disponibles'
                  : 'No disponibles'
            }
            activo={
              !consultando && estado?.puede_pedir
            }
            Icono={FaShoppingBag}
          />
        </div>
      </section>
    </div>
  )
}
