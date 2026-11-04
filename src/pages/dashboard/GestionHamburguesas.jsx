
import { useEffect, useMemo, useState } from 'react'
import {
  FaPlus, FaEdit, FaTrash, FaSearch,
  FaHamburger, FaSyncAlt,
} from 'react-icons/fa'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

import { useGestionHamburguesas } from '../../hooks/useGestionHamburguesas'
import { obtenerUrlImagen } from '../../config/supabaseClient'
import { precioARS } from '../../utils/formato'
import FormularioHamburguesa from '../../components/dashboard/FormularioHamburguesa'

export default function GestionHamburguesas() {
  const {
    hamburguesas,
    cargando,
    error,
    recargar,
    guardar,
    eliminar,
  } = useGestionHamburguesas()

  const [busqueda, setBusqueda] = useState('')
  const [categoria, setCategoria] = useState('todas')
  const [estado, setEstado] = useState('todos')
  const [seleccionada, setSeleccionada] = useState(null)
  const [modalAbierto, setModalAbierto] = useState(false)

  const categorias = useMemo(
    () => [
      ...new Set(
        hamburguesas
          .map((item) => item.categoria?.trim())
          .filter(Boolean)
      ),
    ].sort((a, b) => a.localeCompare(b, 'es')),
    [hamburguesas]
  )

  const filtradas = useMemo(() => {
    const texto = busqueda.trim().toLocaleLowerCase('es')

    return hamburguesas.filter((item) => {
      const coincideTexto =
        !texto ||
        item.nombre?.toLocaleLowerCase('es').includes(texto) ||
        item.descripcion?.toLocaleLowerCase('es').includes(texto)

      const coincideCategoria =
        categoria === 'todas' ||
        item.categoria === categoria

      const coincideEstado =
        estado === 'todos' ||
        (estado === 'publicadas' && item.activo) ||
        (estado === 'ocultas' && !item.activo) ||
        (estado === 'agotadas' && !item.disponible) ||
        (estado === 'destacadas' && item.destacado)

      return coincideTexto && coincideCategoria && coincideEstado
    })
  }, [hamburguesas, busqueda, categoria, estado])

  useEffect(() => {
    if (!modalAbierto) return

    const previo = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    function teclado(evento) {
      if (evento.key === 'Escape' && !guardar.isPending) {
        setModalAbierto(false)
      }
    }

    window.addEventListener('keydown', teclado)

    return () => {
      document.body.style.overflow = previo
      window.removeEventListener('keydown', teclado)
    }
  }, [modalAbierto, guardar.isPending])

  function abrir(producto = null) {
    setSeleccionada(producto)
    setModalAbierto(true)
  }

  function cerrar() {
    if (guardar.isPending) return
    setModalAbierto(false)
    setSeleccionada(null)
  }

  async function guardarRegistro(datos) {
    try {
      const resultado = await guardar.mutateAsync(datos)

      toast.success(
        datos.id
          ? 'Hamburguesa actualizada'
          : 'Hamburguesa creada'
      )

      if (resultado?.advertencia) {
        toast.warning(resultado.advertencia)
      }

      setModalAbierto(false)
      setSeleccionada(null)
    } catch (err) {
      toast.error(err.message || 'No se pudo guardar')
    }
  }

  async function confirmarEliminar(item) {
    const respuesta = await Swal.fire({
      title: '¿Eliminar hamburguesa?',
      text: item.nombre,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#E63946',
      cancelButtonColor: '#52525b',
      background: '#252525',
      color: '#fff',
    })

    if (!respuesta.isConfirmed) return

    try {
      const resultado = await eliminar.mutateAsync(item)
      toast.success('Hamburguesa eliminada')

      if (resultado?.advertencia) {
        toast.warning(resultado.advertencia)
      }
    } catch (err) {
      toast.error(err.message || 'No se pudo eliminar')
    }
  }

  const bloqueado = guardar.isPending || eliminar.isPending

  return (
    <section className="min-w-0 space-y-3">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="font-heading text-xl font-bold sm:text-2xl">
            Hamburguesas
          </h1>
          <p className="text-[11px] text-white/40">
            {filtradas.length} de {hamburguesas.length} productos
          </p>
        </div>

        <button
          type="button"
          onClick={() => abrir()}
          disabled={bloqueado}
          className="inline-flex h-9 items-center gap-2 rounded-lg bg-sky-primary px-3 text-xs font-bold text-white disabled:opacity-50"
        >
          <FaPlus size={11} />
          Nueva
        </button>
      </header>

      {/* TRES FILTROS */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-full sm:w-48 lg:w-100">
          <FaSearch
            size={11}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35"
          />

          <input
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar..."
            aria-label="Buscar productos"
            className="h-9 w-full rounded-lg border border-white/10 bg-sky-surface pl-8 pr-3 text-xs outline-none focus:border-sky-primary"
          />
        </div>

        <select
          value={categoria}
          onChange={(e) => setCategoria(e.target.value)}
          aria-label="Filtrar por categoría"
          className="h-9 min-w-0 flex-1 rounded-lg border border-white/10 bg-sky-surface px-2 text-xs outline-none focus:border-sky-primary sm:max-w-50"
        >
          <option value="todas">Todas las categorías</option>
          {categorias.map((nombre) => (
            <option key={nombre} value={nombre}>
              {nombre}
            </option>
          ))}
        </select>

        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          aria-label="Filtrar por estado"
          className="h-9 min-w-0 flex-1 rounded-lg border border-white/10 bg-sky-surface px-2 text-xs outline-none focus:border-sky-primary sm:max-w-48"
        >
          <option value="todos">Todos los estados</option>
          <option value="publicadas">Publicadas</option>
          <option value="ocultas">Ocultas</option>
          <option value="agotadas">Agotadas</option>
          <option value="destacadas">Destacadas</option>
        </select>

        <button
          type="button"
          onClick={() => recargar()}
          aria-label="Actualizar productos"
          title="Actualizar"
          className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-white/55 hover:text-white"
        >
          <FaSyncAlt size={11} />
        </button>
      </div>

      {cargando && (
        <p className="py-6 text-center text-xs text-white/45">
          Cargando productos...
        </p>
      )}

      {error && (
        <p role="alert" className="rounded-lg border border-sky-primary/30 p-3 text-xs text-sky-primary">
          {error.message}
        </p>
      )}

      {!cargando && !error && filtradas.length === 0 && (
        <div className="rounded-xl border border-white/10 p-8 text-center">
          <FaHamburger className="mx-auto text-sky-primary" />
          <p className="mt-2 text-xs text-white/50">
            No encontramos hamburguesas con esos filtros.
          </p>
        </div>
      )}

      {!cargando && !error && filtradas.length > 0 && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {filtradas.map((item) => {
            const imagen = item.imagen_ruta
              ? obtenerUrlImagen(item.imagen_ruta)
              : null

            return (
              <article
                key={item.id}
                className="group min-w-0 overflow-hidden rounded-lg border border-white/10 bg-sky-surface transition hover:border-sky-primary/40"
              >
                <div className="relative aspect-[5/3] overflow-hidden bg-[#181818]">
                  {imagen ? (
                    <img
                      src={imagen}
                      alt={item.nombre}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="grid h-full place-items-center text-white/20">
                      <FaHamburger />
                    </div>
                  )}

                  {!item.activo && (
                    <span className="absolute left-1.5 top-1.5 rounded bg-black/75 px-1.5 py-0.5 text-[9px] text-white/80">
                      Oculta
                    </span>
                  )}

                  {item.destacado && (
                    <span className="absolute right-1.5 top-1.5 rounded bg-sky-primary px-1.5 py-0.5 text-[9px] font-bold">
                      ★
                    </span>
                  )}
                </div>

                <div className="p-2">
                  <p className="truncate text-[9px] text-sky-primary">
                    {item.categoria || 'Sin categoría'}
                  </p>

                  <h2
                    title={item.nombre}
                    className="mt-0.5 truncate font-heading text-xs font-bold"
                  >
                    {item.nombre}
                  </h2>

                  <div className="mt-1 flex items-center justify-between gap-1">
                    <span className="truncate font-heading text-xs font-bold text-sky-beige">
                      {precioARS(item.precio)}
                    </span>

                    <span
                      className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                        item.activo && item.disponible
                          ? 'bg-green-400'
                          : 'bg-sky-primary'
                      }`}
                      title={
                        !item.activo
                          ? 'Oculta'
                          : item.disponible
                            ? 'Disponible'
                            : 'Agotada'
                      }
                    />
                  </div>

                  <div className="mt-2 flex justify-end gap-1 border-t border-white/10 pt-1">
                    <button
                      type="button"
                      disabled={bloqueado}
                      onClick={() => abrir(item)}
                      title="Editar"
                      aria-label={`Editar ${item.nombre}`}
                      className="grid h-8 w-8 place-items-center rounded-md text-white/55 hover:bg-white/10 hover:text-white disabled:opacity-40"
                    >
                      <FaEdit size={11} />
                    </button>

                    <button
                      type="button"
                      disabled={bloqueado}
                      onClick={() => confirmarEliminar(item)}
                      title="Eliminar"
                      aria-label={`Eliminar ${item.nombre}`}
                      className="grid h-8 w-8 place-items-center rounded-md text-sky-primary/70 hover:bg-sky-primary/10 disabled:opacity-40"
                    >
                      <FaTrash size={10} />
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {/* MODAL: UN SOLO BOTÓN DE CANCELACIÓN */}
      {modalAbierto && (
        <div className="fixed inset-0 z-[100] grid place-items-center p-2 sm:p-4">
          <button
            type="button"
            aria-label="Cerrar formulario"
            onClick={cerrar}
            className="absolute inset-0 bg-black/65 backdrop-blur-sm"
          />

          <div
            role="dialog"
            aria-modal="true"
            aria-label={seleccionada ? 'Editar hamburguesa' : 'Nueva hamburguesa'}
            className="relative flex max-h-[calc(100dvh-16px)] w-full max-w-[570px] flex-col overflow-hidden rounded-xl border border-white/15 bg-[#252525] shadow-2xl sm:max-h-[calc(100dvh-32px)]"
          >
            <div className="shrink-0 border-b border-white/10 px-4 py-2.5">
              <h2 className="font-heading text-sm font-bold">
                {seleccionada ? 'Editar hamburguesa' : 'Nueva hamburguesa'}
              </h2>
            </div>

            <div className="min-h-0 overflow-y-auto p-3 sm:p-4">
              <FormularioHamburguesa
                key={seleccionada?.id ?? 'nueva'}
                hamburguesa={seleccionada}
                onGuardar={guardarRegistro}
                onCancelar={cerrar}
                guardando={guardar.isPending}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
