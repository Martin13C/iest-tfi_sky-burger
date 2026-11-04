
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FaImage, FaSave } from 'react-icons/fa'

import {
  hamburguesaSchema,
  crearSlug,
  valoresHamburguesa,
} from '../../schemas/hamburguesaSchema'

import { validarImagen } from '../../services/imagenesService'
import { obtenerUrlImagen } from '../../config/supabaseClient'

export default function FormularioHamburguesa({
  hamburguesa,
  onGuardar,
  onCancelar,
  guardando = false,
}) {
  const [imagen, setImagen] = useState(null)
  const [preview, setPreview] = useState(null)
  const [errorImagen, setErrorImagen] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(hamburguesaSchema),
    defaultValues: hamburguesa
      ? {
          ...valoresHamburguesa,
          ...hamburguesa,
          precio: Number(hamburguesa.precio ?? 0),
          orden: Number(hamburguesa.orden ?? 0),
        }
      : valoresHamburguesa,
  })

  useEffect(() => {
    reset(
      hamburguesa
        ? {
            nombre: hamburguesa.nombre ?? '',
            slug: hamburguesa.slug ?? '',
            descripcion: hamburguesa.descripcion ?? '',
            categoria: hamburguesa.categoria ?? '',
            precio: Number(hamburguesa.precio ?? 0),
            orden: Number(hamburguesa.orden ?? 0),
            activo: hamburguesa.activo === true,
            disponible: hamburguesa.disponible === true,
            destacado: hamburguesa.destacado === true,
          }
        : valoresHamburguesa
    )
  }, [hamburguesa, reset])

  useEffect(() => {
    if (!imagen) {
      setPreview(null)
      return
    }

    const url = URL.createObjectURL(imagen)
    setPreview(url)

    return () => URL.revokeObjectURL(url)
  }, [imagen])

  function seleccionarImagen(evento) {
    const archivo = evento.target.files?.[0]

    setErrorImagen('')

    if (!archivo) {
      setImagen(null)
      return
    }

    try {
      validarImagen(archivo)
      setImagen(archivo)
    } catch (err) {
      setErrorImagen(err.message)
      setImagen(null)
      evento.target.value = ''
    }
  }

  async function enviar(datos) {
    const slug = hamburguesa?.slug ||
      crearSlug(datos.nombre)

    if (!slug) {
      setErrorImagen('Ingresá un nombre válido.')
      return
    }

    await onGuardar({
      id: hamburguesa?.id ?? null,
      datos: { ...datos, slug },
      imagen,
      imagenAnterior: hamburguesa?.imagen_ruta ?? null,
    })
  }

  const imagenActual = hamburguesa?.imagen_ruta
    ? obtenerUrlImagen(hamburguesa.imagen_ruta)
    : null

  const campo =
    'h-9 w-full min-w-0 rounded-md border border-white/10 ' +
    'bg-[#1d1d1d] px-2.5 text-xs text-white outline-none ' +
    'focus:border-sky-primary'

  const etiqueta = 'mb-1 block text-[11px] font-semibold text-white/65'
  const errorClase = 'mt-1 text-[10px] text-sky-primary'

  return (
    <form
      onSubmit={handleSubmit(enviar)}
      className="space-y-3"
    >
      {/* SLUG INTERNO, NO VISIBLE */}
      <input
        type="hidden"
        {...register('slug')}
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="hamb-nombre" className={etiqueta}>
            Nombre *
          </label>
          <input
            id="hamb-nombre"
            placeholder="Nombre de la hamburguesa"
            {...register('nombre', {
              onChange: (evento) => {
                if (!hamburguesa) {
                  setValue(
                    'slug',
                    crearSlug(evento.target.value),
                    { shouldValidate: true }
                  )
                }
              },
            })}
            className={campo}
          />
          {errors.nombre && (
            <p className={errorClase}>{errors.nombre.message}</p>
          )}
          {errors.slug && (
            <p className={errorClase}>
              No se pudo generar el identificador. Revisá el nombre.
            </p>
          )}
        </div>

        <div>
          <label htmlFor="hamb-categoria" className={etiqueta}>
            Categoría *
          </label>
          <input
            id="hamb-categoria"
            placeholder="Ej.: Clásicas"
            {...register('categoria')}
            className={campo}
          />
          {errors.categoria && (
            <p className={errorClase}>{errors.categoria.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label htmlFor="hamb-precio" className={etiqueta}>
              Precio *
            </label>
            <input
              id="hamb-precio"
              type="number"
              min="0"
              step="0.01"
              {...register('precio', { valueAsNumber: true })}
              className={campo}
            />
            {errors.precio && (
              <p className={errorClase}>{errors.precio.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="hamb-orden" className={etiqueta}>
              Orden
            </label>
            <input
              id="hamb-orden"
              type="number"
              min="0"
              step="1"
              {...register('orden', { valueAsNumber: true })}
              className={campo}
            />
            {errors.orden && (
              <p className={errorClase}>{errors.orden.message}</p>
            )}
          </div>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="hamb-descripcion" className={etiqueta}>
            Descripción
          </label>
          <textarea
            id="hamb-descripcion"
            rows={2}
            {...register('descripcion')}
            className={`${campo} h-auto min-h-16 resize-y py-2`}
          />
          {errors.descripcion && (
            <p className={errorClase}>{errors.descripcion.message}</p>
          )}
        </div>
      </div>

      {/* IMAGEN Y ESTADOS */}
      <div className="grid gap-3 border-t border-white/10 pt-3 sm:grid-cols-[90px_1fr]">
        <div className="aspect-[4/3] overflow-hidden rounded-md border border-white/10 bg-[#1d1d1d]">
          {preview || imagenActual ? (
            <img
              src={preview || imagenActual}
              alt="Vista previa"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="grid h-full place-items-center text-white/25">
              <FaImage />
            </div>
          )}
        </div>

        <div className="min-w-0 space-y-2">
          <label
            htmlFor="hamb-imagen"
            className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-md border border-white/15 px-3 text-xs font-semibold hover:border-sky-primary"
          >
            <FaImage size={11} className="text-sky-primary" />
            {imagen ? 'Cambiar archivo' : 'Elegir imagen'}
          </label>

          <input
            id="hamb-imagen"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={seleccionarImagen}
            className="sr-only"
          />

          {imagen && (
            <p className="truncate text-[10px] text-white/45">
              {imagen.name}
            </p>
          )}

          {errorImagen && (
            <p role="alert" className={errorClase}>
              {errorImagen}
            </p>
          )}

          <div className="flex flex-wrap gap-x-4 gap-y-2 pt-1">
            {[
              ['activo', 'Publicada'],
              ['disponible', 'Disponible'],
              ['destacado', 'Destacada'],
            ].map(([id, texto]) => (
              <label
                key={id}
                className="inline-flex items-center gap-1.5 text-[11px] text-white/75"
              >
                <input
                  type="checkbox"
                  {...register(id)}
                  className="accent-sky-primary"
                />
                {texto}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* ACCIONES */}
      <div className="flex justify-end gap-2 border-t border-white/10 pt-3">
        <button
          type="button"
          onClick={onCancelar}
          disabled={guardando}
          className="h-9 rounded-md border border-white/15 px-3 text-xs text-white/65"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={guardando}
          className="inline-flex h-9 items-center gap-2 rounded-md bg-sky-primary px-3 text-xs font-bold text-white disabled:opacity-50"
        >
          <FaSave size={11} />
          {guardando ? 'Guardando...' : 'Guardar'}
        </button>
      </div>
    </form>
  )
}
