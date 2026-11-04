
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import { FaSave } from 'react-icons/fa'
import { toast } from 'react-toastify'

import { supabase } from '../../config/supabaseClient'
import {
  datosLocalSchema,
  valoresDatosLocal,
  METODOS_PAGO,
  MODALIDADES_ENTREGA,
} from '../../schemas/configuracionSchema'

async function consultarMapa() {
  const { data, error } = await supabase.rpc(
    'obtener_google_maps_url'
  )

  if (error) throw error
  return data ?? ''
}

function validarMapa(valor) {
  const texto = valor.trim()
  if (!texto) return ''

  let url

  try {
    url = new URL(texto)
  } catch {
    throw new Error('Ingresá una URL válida.')
  }

  const host = url.hostname.toLowerCase()

  const corto =
    host === 'maps.app.goo.gl' &&
    /^\/[a-zA-Z0-9_-]+\/?$/.test(url.pathname)

  const normal =
    ['google.com', 'www.google.com', 'maps.google.com']
      .includes(host) &&
    (url.pathname === '/maps' ||
      url.pathname.startsWith('/maps/'))

  if (
    url.protocol !== 'https:' ||
    url.username ||
    url.password ||
    texto.length > 1500 ||
    (!corto && !normal)
  ) {
    throw new Error('Pegá un enlace HTTPS de Google Maps.')
  }

  return texto
}

async function guardarMapa(valor) {
  const { data, error } = await supabase.rpc(
    'actualizar_google_maps_url',
    { p_url: validarMapa(valor) }
  )

  if (error) throw error
  return data ?? ''
}

export default function FormularioDatosLocal({
  configuracion,
  guardarDatos,
}) {
  const queryClient = useQueryClient()
  const [mapa, setMapa] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(datosLocalSchema),
    defaultValues: valoresDatosLocal,
  })

  const consultaMapa = useQuery({
    queryKey: ['dashboard', 'google-maps'],
    queryFn: consultarMapa,
  })

  const mutacionMapa = useMutation({
    mutationFn: guardarMapa,
    onSuccess: async (valor) => {
      setMapa(valor)

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ['dashboard', 'google-maps'],
        }),
        queryClient.invalidateQueries({
          queryKey: ['publico', 'google-maps'],
        }),
      ])

      toast.success('Mapa actualizado')
    },
    onError: (err) => toast.error(err.message),
  })

  useEffect(() => {
    if (!configuracion) return

    reset({
      nombre_negocio:
        configuracion.nombre_negocio ?? 'Sky Burger',
      descripcion: configuracion.descripcion ?? '',
      whatsapp: configuracion.whatsapp ?? '',
      instagram: configuracion.instagram ?? '',
      direccion: configuracion.direccion ?? '',
      costo_envio: Number(configuracion.costo_envio ?? 0),
      metodos_pago: Array.isArray(configuracion.metodos_pago)
        ? configuracion.metodos_pago
        : valoresDatosLocal.metodos_pago,
      modalidades_entrega: Array.isArray(
        configuracion.modalidades_entrega
      )
        ? configuracion.modalidades_entrega
        : valoresDatosLocal.modalidades_entrega,
    })
  }, [configuracion, reset])

  useEffect(() => {
    if (consultaMapa.isSuccess) {
      setMapa(consultaMapa.data ?? '')
    }
  }, [consultaMapa.data, consultaMapa.isSuccess])

  const modalidades = watch('modalidades_entrega') ?? []

  async function enviar(datos) {
    try {
      await guardarDatos.mutateAsync(datos)
      toast.success('Datos guardados')
    } catch (err) {
      toast.error(err.message || 'Error al guardar')
    }
  }

  const campo =
    'h-9 w-full min-w-0 rounded-md border border-white/10 ' +
    'bg-[#1d1d1d] px-2.5 text-xs text-white outline-none ' +
    'focus:border-sky-primary'

  const etiqueta = 'mb-1 block text-[11px] font-semibold text-white/65'
  const errorClase = 'mt-1 text-[10px] text-sky-primary'

  return (
    <div className="space-y-3">
      <form onSubmit={handleSubmit(enviar)} className="space-y-3">
        <div className="grid gap-2 sm:grid-cols-2">
          <div>
            <label htmlFor="local-nombre" className={etiqueta}>
              Negocio
            </label>
            <input
              id="local-nombre"
              {...register('nombre_negocio')}
              className={campo}
            />
            {errors.nombre_negocio && (
              <p className={errorClase}>
                {errors.nombre_negocio.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="local-whatsapp" className={etiqueta}>
              WhatsApp
            </label>
            <input
              id="local-whatsapp"
              type="tel"
              {...register('whatsapp')}
              className={campo}
            />
            {errors.whatsapp && (
              <p className={errorClase}>
                {errors.whatsapp.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="local-instagram" className={etiqueta}>
              Instagram
            </label>
            <input
              id="local-instagram"
              {...register('instagram')}
              className={campo}
            />
            {errors.instagram && (
              <p className={errorClase}>
                {errors.instagram.message}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="local-direccion" className={etiqueta}>
              Dirección
            </label>
            <input
              id="local-direccion"
              {...register('direccion')}
              className={campo}
            />
            {errors.direccion && (
              <p className={errorClase}>
                {errors.direccion.message}
              </p>
            )}
          </div>

          <div className="sm:col-span-2">
            <label htmlFor="local-descripcion" className={etiqueta}>
              Descripción
            </label>
            <textarea
              id="local-descripcion"
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
        </div>

        <div className="grid gap-3 border-t border-white/10 pt-3 sm:grid-cols-2">
          <fieldset>
            <legend className={etiqueta}>
              Pagos
            </legend>

            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {METODOS_PAGO.map((item) => (
                <label
                  key={item.id}
                  className="inline-flex items-center gap-1.5 text-[11px]"
                >
                  <input
                    type="checkbox"
                    value={item.id}
                    {...register('metodos_pago')}
                    className="accent-sky-primary"
                  />
                  {item.nombre}
                </label>
              ))}
            </div>

            {errors.metodos_pago && (
              <p className={errorClase}>
                {errors.metodos_pago.message}
              </p>
            )}
          </fieldset>

          <fieldset>
            <legend className={etiqueta}>
              Entrega
            </legend>

            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {MODALIDADES_ENTREGA.map((item) => (
                <label
                  key={item.id}
                  className="inline-flex items-center gap-1.5 text-[11px]"
                >
                  <input
                    type="checkbox"
                    value={item.id}
                    {...register('modalidades_entrega')}
                    className="accent-sky-primary"
                  />
                  {item.nombre}
                </label>
              ))}
            </div>

            {errors.modalidades_entrega && (
              <p className={errorClase}>
                {errors.modalidades_entrega.message}
              </p>
            )}
          </fieldset>
        </div>

        {modalidades.includes('domicilio') && (
          <div className="max-w-44">
            <label htmlFor="local-costo" className={etiqueta}>
              Envío fijo (ARS)
            </label>

            <input
              id="local-costo"
              type="number"
              min="0"
              step="0.01"
              {...register('costo_envio', {
                valueAsNumber: true,
              })}
              className={campo}
            />

            {errors.costo_envio && (
              <p className={errorClase}>
                {errors.costo_envio.message}
              </p>
            )}
          </div>
        )}

        <div className="flex justify-end border-t border-white/10 pt-3">
          <button
            type="submit"
            disabled={guardarDatos.isPending}
            className="inline-flex h-9 items-center gap-2 rounded-md bg-sky-primary px-3 text-xs font-bold disabled:opacity-50"
          >
            <FaSave size={11} />
            {guardarDatos.isPending ? 'Guardando...' : 'Guardar datos'}
          </button>
        </div>
      </form>

      {/* GOOGLE MAPS: GUARDADO INDEPENDIENTE */}
      <div className="border-t border-white/10 pt-3">
        <label htmlFor="local-mapa" className={etiqueta}>
          Google Maps
        </label>

        <div className="flex flex-wrap gap-2">
          <input
            id="local-mapa"
            type="url"
            placeholder="https://maps.app.goo.gl/..."
            maxLength={1500}
            value={mapa}
            onChange={(e) => setMapa(e.target.value)}
            disabled={consultaMapa.isPending}
            className={`${campo} min-w-0 flex-1`}
          />

          <button
            type="button"
            disabled={
              consultaMapa.isPending ||
              consultaMapa.isError ||
              mutacionMapa.isPending
            }
            onClick={() => mutacionMapa.mutate(mapa)}
            className="inline-flex h-9 items-center gap-2 rounded-md border border-sky-primary/50 px-3 text-xs font-bold text-sky-primary disabled:opacity-40"
          >
            <FaSave size={11} />
            Mapa
          </button>
        </div>

        {consultaMapa.isError && (
          <p role="alert" className={errorClase}>
            {consultaMapa.error.message}
          </p>
        )}
      </div>
    </div>
  )
}
