
import { useAuth } from '../../context/AuthContext'
import {
  FaPowerOff,
  FaShoppingBag,
  FaShieldAlt,
  FaStore,
} from 'react-icons/fa'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

async function confirmar({
  titulo,
  texto,
  peligro = false,
  boton = 'Confirmar',
}) {
  const resultado = await Swal.fire({
    title: titulo,
    text: texto,
    icon: peligro ? 'warning' : 'question',
    showCancelButton: true,
    confirmButtonText: boton,
    cancelButtonText: 'Cancelar',
    confirmButtonColor: peligro ? '#dc2626' : '#f59e0b',
    cancelButtonColor: '#52525b',
    background: '#18181b',
    color: '#fafafa',
    reverseButtons: true,
  })

  return resultado.isConfirmed
}

function Indicador({ activo, activoTexto, inactivoTexto }) {
  return (
    <span
      className={`rounded-full px-3 py-1.5 text-xs font-bold ${
        activo
          ? 'bg-green-500/15 text-green-400'
          : 'bg-red-500/15 text-red-400'
      }`}
    >
      {activo ? activoTexto : inactivoTexto}
    </span>
  )
}

export default function ControlOperacionLocal({
  configuracion,
  estado,
  publicado,
  guardarOperacion,
  cambiarPublicacion,
}) {
  const { perfil } = useAuth()

  const esAdmin = perfil?.rol === 'administrador'
  const pedidos = configuracion.pedidos_habilitados === true
  const cerradoManual = configuracion.cierre_manual === true

  const guardando =
    guardarOperacion.isPending ||
    cambiarPublicacion.isPending

  async function actualizarPedidos() {
    const nuevoValor = !pedidos

    const aceptado = await confirmar({
      titulo: nuevoValor
        ? '¿Habilitar pedidos?'
        : '¿Pausar pedidos?',
      texto: nuevoValor
        ? 'Se habilitará la recepción de pedidos. Los horarios y el cierre manual seguirán aplicándose.'
        : 'Se dejarán de recibir pedidos hasta que vuelvas a habilitarlos.',
      peligro: !nuevoValor,
      boton: nuevoValor ? 'Habilitar' : 'Pausar',
    })

    if (!aceptado) return

    try {
      await guardarOperacion.mutateAsync({
        pedidos_habilitados: nuevoValor,
        cierre_manual: cerradoManual,
      })

      toast.success(
        nuevoValor
          ? 'Recepción de pedidos habilitada'
          : 'Recepción de pedidos pausada'
      )
    } catch (error) {
      toast.error(error.message)
    }
  }

  async function actualizarCierre() {
    const nuevoValor = !cerradoManual

    const aceptado = await confirmar({
      titulo: nuevoValor
        ? '¿Cerrar el local manualmente?'
        : '¿Quitar el cierre manual?',
      texto: nuevoValor
        ? 'El local dejará de recibir pedidos aunque esté dentro de su horario habitual.'
        : 'El local volverá a respetar los horarios semanales y el estado de los pedidos.',
      peligro: nuevoValor,
      boton: nuevoValor ? 'Cerrar local' : 'Quitar cierre',
    })

    if (!aceptado) return

    try {
      await guardarOperacion.mutateAsync({
        pedidos_habilitados: pedidos,
        cierre_manual: nuevoValor,
      })

      toast.success(
        nuevoValor
          ? 'Local cerrado manualmente'
          : 'Cierre manual desactivado'
      )
    } catch (error) {
      toast.error(error.message)
    }
  }

  async function actualizarPublicacion() {
    if (!esAdmin) return

    const nuevoValor = !publicado

    const aceptado = await confirmar({
      titulo: nuevoValor
        ? '¿Publicar Sky Burger?'
        : '¿Suspender el sitio?',
      texto: nuevoValor
        ? 'El catálogo y las páginas públicas pasarán a estar disponibles para los visitantes.'
        : 'Los visitantes dejarán de ver el sitio público. Los paneles privados continuarán accesibles.',
      peligro: !nuevoValor,
      boton: nuevoValor ? 'Publicar sitio' : 'Suspender sitio',
    })

    if (!aceptado) return

    try {
      await cambiarPublicacion.mutateAsync(nuevoValor)

      toast.success(
        nuevoValor
          ? 'Sitio publicado correctamente'
          : 'Sitio suspendido correctamente'
      )
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <FaStore className="text-xl text-amber-500" />
        <div>
          <h2 className="text-xl font-black sm:text-2xl">
            Operación del local
          </h2>
          <p className="text-sm text-zinc-400">
            Controlá la recepción de pedidos y la apertura manual.
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <article className="space-y-5 rounded-2xl border border-zinc-800 bg-zinc-950 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <FaShoppingBag className="text-2xl text-amber-500" />
            <Indicador
              activo={pedidos}
              activoTexto="Pedidos habilitados"
              inactivoTexto="Pedidos pausados"
            />
          </div>

          <div>
            <h3 className="text-lg font-bold">
              Recepción de pedidos
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              Permite habilitar o pausar pedidos sin cambiar
              el horario de atención ni suspender el sitio.
            </p>
          </div>

          <button
            type="button"
            disabled={guardando}
            onClick={actualizarPedidos}
            className={`min-h-12 w-full rounded-xl px-5 font-bold transition disabled:opacity-50 ${
              pedidos
                ? 'bg-red-600 text-white hover:bg-red-500'
                : 'bg-amber-500 text-black hover:bg-amber-400'
            }`}
          >
            {pedidos ? 'Pausar pedidos' : 'Habilitar pedidos'}
          </button>
        </article>

        <article className="space-y-5 rounded-2xl border border-zinc-800 bg-zinc-950 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <FaPowerOff className="text-2xl text-amber-500" />
            <Indicador
              activo={!cerradoManual}
              activoTexto="Sin cierre manual"
              inactivoTexto="Cierre manual activo"
            />
          </div>

          <div>
            <h3 className="text-lg font-bold">
              Cierre manual del local
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              Usalo cuando el negocio necesite cerrar
              excepcionalmente, aunque esté dentro
              del horario habitual.
            </p>
          </div>

          <button
            type="button"
            disabled={guardando}
            onClick={actualizarCierre}
            className={`min-h-12 w-full rounded-xl px-5 font-bold transition disabled:opacity-50 ${
              cerradoManual
                ? 'bg-amber-500 text-black hover:bg-amber-400'
                : 'bg-red-600 text-white hover:bg-red-500'
            }`}
          >
            {cerradoManual
              ? 'Quitar cierre manual'
              : 'Cerrar local manualmente'}
          </button>
        </article>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-5 sm:p-6">
        <h3 className="text-lg font-bold">
          Estado actual de Sky Burger
        </h3>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          <div>
            <p className="text-sm text-zinc-400">
              Sitio público
            </p>
            <p className="mt-2 font-bold">
              {publicado ? 'Publicado' : 'Suspendido'}
            </p>
          </div>

          <div>
            <p className="text-sm text-zinc-400">
              Local según horarios
            </p>
            <p className="mt-2 font-bold">
              {estado?.local_abierto
                ? 'Abierto'
                : 'Cerrado'}
            </p>
          </div>

          <div>
            <p className="text-sm text-zinc-400">
              Puede recibir pedidos
            </p>
            <p className="mt-2 font-bold">
              {estado?.puede_pedir ? 'Sí' : 'No'}
            </p>
          </div>
        </div>
      </div>

      {esAdmin && (
        <section className="space-y-5 rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <FaShieldAlt className="text-xl text-amber-500" />
              <h3 className="text-lg font-black">
                Publicación del sitio
              </h3>
            </div>

            <Indicador
              activo={publicado}
              activoTexto="Publicado"
              inactivoTexto="Suspendido"
            />
          </div>

          <p className="text-sm leading-relaxed text-zinc-300">
            Este control es exclusivo del administrador.
            Suspender el sitio oculta el contenido público,
            pero permite continuar administrándolo.
          </p>

          <button
            type="button"
            disabled={guardando}
            onClick={actualizarPublicacion}
            className={`min-h-12 w-full rounded-xl px-6 font-bold transition disabled:opacity-50 sm:w-auto ${
              publicado
                ? 'bg-red-600 text-white hover:bg-red-500'
                : 'bg-amber-500 text-black hover:bg-amber-400'
            }`}
          >
            {publicado
              ? 'Suspender sitio público'
              : 'Publicar sitio público'}
          </button>
        </section>
      )}
    </div>
  )
}
