
import { useEffect, useMemo, useState } from 'react'
import {
  FaPlus, FaEdit, FaTrash,
  FaSearch, FaImage, FaSyncAlt,
} from 'react-icons/fa'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

import { useGestionContenido } from '../../hooks/useGestionContenido'
import { obtenerUrlImagen } from '../../config/supabaseClient'
import { precioARS } from '../../utils/formato'
import FormularioContenido from '../../components/dashboard/FormularioContenido'

export default function GestionContenido({ tipo }) {
  const esPromo = tipo === 'promociones'
  const titulo = esPromo ? 'Promociones' : 'Galería'
  const singular = esPromo ? 'promoción' : 'imagen'

  const {
    registros,
    cargando,
    error,
    recargar,
    guardar,
    eliminar,
  } = useGestionContenido(tipo)

  const [busqueda, setBusqueda] = useState('')
  const [estado, setEstado] = useState('todos')
  const [seleccionado, setSeleccionado] = useState(null)
  const [modalAbierto, setModalAbierto] = useState(false)

  const filtrados = useMemo(() => {
    const texto = busqueda.trim().toLocaleLowerCase('es')

    return registros.filter((item) => {
      const coincide =
        !texto ||
        item.titulo?.toLocaleLowerCase('es').includes(texto) ||
        item.descripcion?.toLocaleLowerCase('es').includes(texto)

      const activo = esPromo ? item.activa : item.activo

      const coincideEstado =
        estado === 'todos' ||
        (estado === 'visibles' && activo) ||
        (estado === 'ocultos' && !activo) ||
        (estado === 'agotados' && esPromo && !item.disponible)

      return coincide && coincideEstado
    })
  }, [registros, busqueda, estado, esPromo])

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

  function abrir(item = null) {
    setSeleccionado(item)
    setModalAbierto(true)
  }

  function cerrar() {
    if (guardar.isPending) return
    setSeleccionado(null)
    setModalAbierto(false)
  }

  async function guardarRegistro(datos) {
    try {
      const resultado = await guardar.mutateAsync(datos)

      toast.success(
        datos.id
          ? 'Cambios guardados'
          : `${esPromo ? 'Promoción creada' : 'Imagen agregada'}`
      )

      if (resultado?.advertencia) {
        toast.warning(resultado.advertencia)
      }

      setModalAbierto(false)
      setSeleccionado(null)
    } catch (err) {
      toast.error(err.message || 'No se pudo guardar')
    }
  }

  async function confirmarEliminar(item) {
    const respuesta = await Swal.fire({
      title: `¿Eliminar ${singular}?`,
      text: item.titulo,
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
      toast.success('Registro eliminado')

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
      <header className="flex items-center justify-between gap-2">
        <div>
          <h1 className="font-heading text-xl font-bold sm:text-2xl">
            {titulo}
          </h1>

          <p className="text-[11px] text-white/40">
            {filtrados.length} de {registros.length} registros
          </p>
        </div>

        <button
          type="button"
          onClick={() => abrir()}
          disabled={bloqueado}
          className="inline-flex h-9 items-center gap-2 rounded-lg bg-sky-primary px-3 text-xs font-bold disabled:opacity-50"
        >
          <FaPlus size={11} />
          Nueva
        </button>
      </header>

      {/* FILTROS */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-full sm:w-48 lg:w-56">
          <FaSearch
            size={11}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-white/35"
          />

          <input
            type="search"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar..."
            aria-label={`Buscar en ${titulo}`}
            className="h-9 w-full rounded-lg border border-white/10 bg-sky-surface pl-8 pr-3 text-xs outline-none focus:border-sky-primary"
          />
        </div>

        <select
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
          aria-label="Filtrar por estado"
          className="h-9 rounded-lg border border-white/10 bg-sky-surface px-2 text-xs outline-none focus:border-sky-primary"
        >
          <option value="todos">Todos</option>
          <option value="visibles">Visibles</option>
          <option value="ocultos">Ocultos</option>
          {esPromo && <option value="agotados">Agotados</option>}
        </select>

        <button
          type="button"
          onClick={() => recargar()}
          title="Actualizar"
          aria-label="Actualizar listado"
          className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-white/55 hover:text-white"
        >
          <FaSyncAlt size={11} />
        </button>
      </div>

      {cargando && (
        <p className="py-6 text-center text-xs text-white/50">
          Cargando contenido...
        </p>
      )}

      {error && (
        <p role="alert" className="rounded-lg border border-sky-primary/30 p-3 text-xs text-sky-primary">
          {error.message}
        </p>
      )}

      {!cargando && !error && filtrados.length === 0 && (
        <div className="rounded-lg border border-white/10 p-8 text-center">
          <FaImage className="mx-auto text-sky-primary" />
          <p className="mt-2 text-xs text-white/50">
            No hay resultados para mostrar.
          </p>
        </div>
      )}

      {!cargando && !error && filtrados.length > 0 && (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
          {filtrados.map((item) => {
            const imagen = item.imagen_ruta
              ? obtenerUrlImagen(item.imagen_ruta)
              : null

            const visible = esPromo ? item.activa : item.activo

            return (
              <article
                key={item.id}
                className="group min-w-0 overflow-hidden rounded-lg border border-white/10 bg-sky-surface transition hover:border-sky-primary/40"
              >
                <div className="relative aspect-[5/3] overflow-hidden bg-[#181818]">
                  {imagen ? (
                    <img
                      src={imagen}
                      alt={item.titulo}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="grid h-full place-items-center text-white/20">
                      <FaImage />
                    </div>
                  )}

                  {!visible && (
                    <span className="absolute left-1.5 top-1.5 rounded bg-black/75 px-1.5 py-0.5 text-[9px]">
                      Oculta
                    </span>
                  )}
                </div>

                <div className="p-2">
                  <h2
                    title={item.titulo}
                    className="truncate font-heading text-xs font-bold"
                  >
                    {item.titulo}
                  </h2>

                  <p className="mt-0.5 line-clamp-1 text-[10px] text-white/40">
                    {item.descripcion || 'Sin descripción'}
                  </p>

                  <div className="mt-1 flex items-center justify-between gap-1">
                    {esPromo ? (
                      <span className="truncate font-heading text-xs font-bold text-sky-beige">
                        {precioARS(item.precio)}
                      </span>
                    ) : (
                      <span className="text-[10px] text-white/40">
                        Orden {item.orden}
                      </span>
                    )}

                    <span
                      className={`h-1.5 w-1.5 rounded-full ${
                        visible && (!esPromo || item.disponible)
                          ? 'bg-green-400'
                          : 'bg-sky-primary'
                      }`}
                    />
                  </div>

                  <div className="mt-2 flex justify-end gap-1 border-t border-white/10 pt-1">
                    <button
                      type="button"
                      disabled={bloqueado}
                      onClick={() => abrir(item)}
                      title="Editar"
                      aria-label={`Editar ${item.titulo}`}
                      className="grid h-8 w-8 place-items-center rounded-md text-white/55 hover:bg-white/10 disabled:opacity-40"
                    >
                      <FaEdit size={11} />
                    </button>

                    <button
                      type="button"
                      disabled={bloqueado}
                      onClick={() => confirmarEliminar(item)}
                      title="Eliminar"
                      aria-label={`Eliminar ${item.titulo}`}
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

      {/* MODAL */}
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
            aria-label={
              seleccionado
                ? `Editar ${singular}`
                : `Nueva ${singular}`
            }
            className="relative flex max-h-[calc(100dvh-16px)] w-full max-w-[510px] flex-col overflow-hidden rounded-xl border border-white/15 bg-[#252525] shadow-2xl"
          >
            <div className="shrink-0 border-b border-white/10 px-4 py-2.5">
              <h2 className="font-heading text-sm font-bold">
                {seleccionado
                  ? `Editar ${singular}`
                  : `Nueva ${singular}`}
              </h2>
            </div>

            <div className="min-h-0 overflow-y-auto p-3 sm:p-4">
              <FormularioContenido
                key={`${tipo}-${seleccionado?.id ?? 'nuevo'}`}
                tipo={tipo}
                registro={seleccionado}
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
