
import {
  FaStore,
  FaClock,
  FaSlidersH,
  FaShoppingBag,
  FaPowerOff,
  FaGlobe,
} from 'react-icons/fa'
import Swal from 'sweetalert2'
import { toast } from 'react-toastify'

import { useAuth } from '../../context/AuthContext'
import { useGestionConfiguracion } from '../../hooks/useGestionConfiguracion'

import FormularioDatosLocal from '../../components/dashboard/FormularioDatosLocal'
import ConfiguracionHorarios from '../../components/dashboard/ConfiguracionHorarios'

async function confirmar(titulo, texto, peligro = false) {
  const resultado = await Swal.fire({
    title: titulo,
    text: texto,
    icon: peligro ? 'warning' : 'question',
    showCancelButton: true,
    confirmButtonText: 'Confirmar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: peligro ? '#E63946' : '#16a34a',
    cancelButtonColor: '#52525b',
    background: '#252525',
    color: '#fff',
  })

  return resultado.isConfirmed
}

function Accion({
  Icono,
  titulo,
  estado,
  accion,
  textoBoton,
  disabled,
  peligro = false,
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-white/10 py-2.5 last:border-0">
      <Icono
        aria-hidden="true"
        className="shrink-0 text-sm text-sky-primary"
      />

      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold">{titulo}</p>
        <p className="text-[10px] text-white/45">{estado}</p>
      </div>

      <button
        type="button"
        disabled={disabled}
        onClick={accion}
        className={`h-8 shrink-0 rounded-md px-2.5 text-[11px] font-bold transition disabled:opacity-40 ${
          peligro
            ? 'border border-sky-primary/40 text-sky-primary hover:bg-sky-primary/10'
            : 'border border-white/15 text-white/75 hover:bg-white/10'
        }`}
      >
        {textoBoton}
      </button>
    </div>
  )
}

export default function GestionConfiguracion() {
  const { perfil } = useAuth()
  const esAdmin = perfil?.rol === 'administrador'

  const {
    configuracion,
    estadoLocal,
    publicacion,
    guardarDatos,
    guardarAgenda,
    guardarOperacion,
    cambiarPublicacion,
  } = useGestionConfiguracion()

  const cargando =
    configuracion.isPending ||
    estadoLocal.isPending ||
    publicacion.isPending

  const error =
    configuracion.error ||
    estadoLocal.error ||
    publicacion.error

  if (cargando) {
    return (
      <p className="py-6 text-center text-xs text-white/45">
        Cargando configuración...
      </p>
    )
  }

  if (error || !configuracion.data) {
    return (
      <div
        role="alert"
        className="rounded-lg border border-sky-primary/30 p-4"
      >
        <p className="text-sm text-sky-primary">
          {error?.message ||
            'No pudimos cargar la configuración.'}
        </p>

        <button
          type="button"
          onClick={() => {
            configuracion.refetch()
            estadoLocal.refetch()
            publicacion.refetch()
          }}
          className="mt-2 text-xs font-bold underline"
        >
          Reintentar
        </button>
      </div>
    )
  }

  const datos = configuracion.data
  const publicado = publicacion.data === true
  const pedidos = datos.pedidos_habilitados === true
  const cierreManual = datos.cierre_manual === true

  const guardando =
    guardarOperacion.isPending ||
    cambiarPublicacion.isPending

  async function modificarPedidos() {
    const siguiente = !pedidos

    const aceptado = await confirmar(
      siguiente ? '¿Habilitar pedidos?' : '¿Pausar pedidos?',
      'Esta opción modifica la recepción de pedidos.',
      !siguiente
    )

    if (!aceptado) return

    try {
      await guardarOperacion.mutateAsync({
        pedidos_habilitados: siguiente,
        cierre_manual: cierreManual,
      })

      toast.success('Estado de pedidos actualizado')
    } catch (err) {
      toast.error(err.message)
    }
  }

  async function modificarCierre() {
    const siguiente = !cierreManual

    const aceptado = await confirmar(
      siguiente
        ? '¿Cerrar el local?'
        : '¿Quitar cierre manual?',
      'La apertura seguirá dependiendo de los horarios.',
      siguiente
    )

    if (!aceptado) return

    try {
      await guardarOperacion.mutateAsync({
        pedidos_habilitados: pedidos,
        cierre_manual: siguiente,
      })

      toast.success('Estado del local actualizado')
    } catch (err) {
      toast.error(err.message)
    }
  }

  async function modificarPublicacion() {
    if (!esAdmin) return

    const siguiente = !publicado

    const aceptado = await confirmar(
      siguiente
        ? '¿Publicar el sitio?'
        : '¿Suspender el sitio?',
      siguiente
        ? 'El sitio estará disponible para los visitantes.'
        : 'El sitio público dejará de estar disponible.',
      !siguiente
    )

    if (!aceptado) return

    try {
      await cambiarPublicacion.mutateAsync(siguiente)
      toast.success('Publicación actualizada')
    } catch (err) {
      toast.error(err.message)
    }
  }

  return (
    <section className="min-w-0 space-y-3">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="font-heading text-xl font-bold sm:text-2xl">
            Configuración
          </h1>

          <p className="text-[11px] text-white/40">
            Datos, horarios y funcionamiento.
          </p>
        </div>

        <span
          className={`rounded-md px-2 py-1 text-[10px] font-bold ${
            publicado
              ? 'bg-green-500/10 text-green-400'
              : 'bg-sky-primary/10 text-sky-primary'
          }`}
        >
          {publicado ? 'Publicado' : 'Suspendido'}
        </span>
      </header>

      {/*
        AJUSTE PARA NOTEBOOKS

        1280–1535 px:
        Columnas equilibradas para aprovechar mejor
        la altura disponible.

        1536 px en adelante:
        Recuperamos la distribución original.

        Celulares y tablets:
        No cambian.
      */}
      <div
        className="
          grid items-start gap-3
          xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]
          2xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]
        "
      >
        {/* DATOS COMERCIALES */}
        <section className="min-w-0 rounded-xl border border-white/10 bg-sky-surface p-3">
          <h2 className="mb-3 flex items-center gap-2 font-heading text-sm font-bold">
            <FaStore className="text-sky-primary" />
            Datos comerciales
          </h2>

          <FormularioDatosLocal
            configuracion={datos}
            guardarDatos={guardarDatos}
          />
        </section>

        {/* COLUMNA DERECHA */}
        <div className="min-w-0 space-y-3">
          {/* OPERACIÓN */}
          <section className="rounded-xl border border-white/10 bg-sky-surface p-3">
            <h2 className="flex items-center gap-2 font-heading text-sm font-bold">
              <FaSlidersH className="text-sky-primary" />
              Operación
            </h2>

            <div className="mt-2">
              <Accion
                Icono={FaShoppingBag}
                titulo="Pedidos"
                estado={pedidos ? 'Habilitados' : 'Pausados'}
                textoBoton={pedidos ? 'Pausar' : 'Habilitar'}
                accion={modificarPedidos}
                disabled={guardando}
                peligro={pedidos}
              />

              <Accion
                Icono={FaPowerOff}
                titulo="Cierre manual"
                estado={cierreManual ? 'Activo' : 'Desactivado'}
                textoBoton={cierreManual ? 'Reabrir' : 'Cerrar'}
                accion={modificarCierre}
                disabled={guardando}
                peligro={!cierreManual}
              />

              {esAdmin && (
                <Accion
                  Icono={FaGlobe}
                  titulo="Sitio público"
                  estado={publicado ? 'Publicado' : 'Suspendido'}
                  textoBoton={
                    publicado ? 'Suspender' : 'Publicar'
                  }
                  accion={modificarPublicacion}
                  disabled={guardando}
                  peligro={publicado}
                />
              )}
            </div>

            <p className="mt-2 text-[10px] text-white/35">
              Atención actual:{' '}
              {estadoLocal.data?.puede_pedir
                ? 'recibiendo pedidos'
                : 'no disponible'}
            </p>
          </section>

          {/* HORARIOS */}
          <section className="min-w-0 rounded-xl border border-white/10 bg-sky-surface p-3">
            <h2 className="mb-2 flex items-center gap-2 font-heading text-sm font-bold">
              <FaClock className="text-sky-primary" />
              Horarios
            </h2>

            <ConfiguracionHorarios
              configuracion={datos}
              guardarAgenda={guardarAgenda}
            />
          </section>
        </div>
      </div>
    </section>
  )
}
