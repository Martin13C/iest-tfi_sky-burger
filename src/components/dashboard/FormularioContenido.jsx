
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FaImage, FaSave } from 'react-icons/fa'

import {
  promocionSchema,
  galeriaSchema,
  valoresPromocion,
  valoresGaleria,
  fechaParaInput,
} from '../../schemas/contenidoSchema'

import { validarImagen } from '../../services/imagenesService'
import { obtenerUrlImagen } from '../../config/supabaseClient'

export default function FormularioContenido({
  tipo,
  registro,
  onGuardar,
  onCancelar,
  guardando = false,
}) {
  const esPromo = tipo === 'promociones'

  const [imagen, setImagen] = useState(null)
  const [preview, setPreview] = useState(null)
  const [errorImagen, setErrorImagen] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(
      esPromo ? promocionSchema : galeriaSchema
    ),
    defaultValues: esPromo
      ? valoresPromocion
      : valoresGaleria,
  })

  useEffect(() => {
    reset(
      esPromo
        ? {
            titulo: registro?.titulo ?? '',
            descripcion: registro?.descripcion ?? '',
            precio: Number(registro?.precio ?? 0),
            orden: Number(registro?.orden ?? 0),
            activa: registro?.activa === true,
            disponible: registro?.disponible ?? true,
            inicio: fechaParaInput(registro?.inicio),
            fin: fechaParaInput(registro?.fin),
          }
        : {
            titulo: registro?.titulo ?? '',
            descripcion: registro?.descripcion ?? '',
            orden: Number(registro?.orden ?? 0),
            activo: registro?.activo === true,
          }
    )

    setImagen(null)
    setErrorImagen('')
  }, [registro, esPromo, reset])

  useEffect(() => {
    if (!imagen) {
      setPreview(null)
      return
    }

    const url = URL.createObjectURL(imagen)
    setPreview(url)

    return () => URL.revokeObjectURL(url)
  }, [imagen])

  function elegirImagen(evento) {
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
    if (!esPromo && !registro?.id && !imagen) {
      setErrorImagen('Seleccioná una imagen.')
      return
    }

    await onGuardar({
      id: registro?.id ?? null,
      datos,
      imagen,
      imagenAnterior: registro?.imagen_ruta ?? null,
    })
  }

  const imagenActual = registro?.imagen_ruta
    ? obtenerUrlImagen(registro.imagen_ruta)
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
      <div>
        <label htmlFor="contenido-titulo" className={etiqueta}>
          Título *
        </label>

        <input
          id="contenido-titulo"
          {...register('titulo')}
          className={campo}
        />

        {errors.titulo && (
          <p className={errorClase}>{errors.titulo.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="contenido-descripcion" className={etiqueta}>
          Descripción
        </label>

        <textarea
          id="contenido-descripcion"
          rows={2}
          {...register('descripcion')}
          className={`${campo} h-auto min-h-14 resize-y py-2`}
        />

        {errors.descripcion && (
          <p className={errorClase}>
            {errors.descripcion.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        {esPromo && (
          <div>
            <label htmlFor="contenido-precio" className={etiqueta}>
              Precio *
            </label>

            <input
              id="contenido-precio"
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
        )}

        <div>
          <label htmlFor="contenido-orden" className={etiqueta}>
            Orden
          </label>

          <input
            id="contenido-orden"
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

      {esPromo && (
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label htmlFor="contenido-inicio" className={etiqueta}>
              Inicio
            </label>

            <input
              id="contenido-inicio"
              type="datetime-local"
              {...register('inicio')}
              className={campo}
            />

            {errors.inicio && (
              <p className={errorClase}>{errors.inicio.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="contenido-fin" className={etiqueta}>
              Fin
            </label>

            <input
              id="contenido-fin"
              type="datetime-local"
              {...register('fin')}
              className={campo}
            />

            {errors.fin && (
              <p className={errorClase}>{errors.fin.message}</p>
            )}
          </div>
        </div>
      )}

      <div className="grid items-center gap-3 border-t border-white/10 pt-3 sm:grid-cols-[90px_1fr]">
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

        <div className="min-w-0">
          <label
            htmlFor="contenido-imagen"
            className="inline-flex h-9 cursor-pointer items-center gap-2 rounded-md border border-white/15 px-3 text-xs font-semibold hover:border-sky-primary"
          >
            <FaImage size={11} className="text-sky-primary" />
            {imagen ? 'Cambiar archivo' : 'Elegir imagen'}
          </label>

          <input
            id="contenido-imagen"
            type="file"
            accept="image/jpeg,image/png,image/webp,image/avif"
            onChange={elegirImagen}
            className="sr-only"
          />

          {imagen && (
            <p className="mt-1 truncate text-[10px] text-white/45">
              {imagen.name}
            </p>
          )}

          {errorImagen && (
            <p role="alert" className={errorClase}>
              {errorImagen}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-4 border-t border-white/10 pt-3">
        <label className="inline-flex items-center gap-2 text-[11px] text-white/75">
          <input
            type="checkbox"
            {...register(esPromo ? 'activa' : 'activo')}
            className="accent-sky-primary"
          />
          {esPromo ? 'Activa' : 'Visible'}
        </label>

        {esPromo && (
          <label className="inline-flex items-center gap-2 text-[11px] text-white/75">
            <input
              type="checkbox"
              {...register('disponible')}
              className="accent-sky-primary"
            />
            Disponible
          </label>
        )}
      </div>

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
