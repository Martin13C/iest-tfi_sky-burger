
import { useEffect, useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import {
  FaTimes,
  FaTrashAlt,
  FaWhatsapp,
  FaShoppingBag,
  FaMinus,
  FaPlus,
} from 'react-icons/fa'

import { supabase } from '../../config/supabaseClient'
import { useCarrito } from '../../context/CarritoContext'

import {
  useDatosLocal,
  useEstadoLocal,
  usePublicacion,
} from '../../hooks/useCatalogo'

import {
  enlaceWhatsApp,
  precioARS,
} from '../../utils/formato'

async function consultarProductos(items) {
  const hamburguesas = [
    ...new Set(
      items
        .filter((item) => item.tipo === 'hamburguesa')
        .map((item) => item.id)
    ),
  ]

  const promociones = [
    ...new Set(
      items
        .filter((item) => item.tipo === 'promocion')
        .map((item) => item.id)
    ),
  ]

  const consultas = []

  if (hamburguesas.length) {
    consultas.push(
      supabase
        .from('hamburguesas')
        .select('id,nombre,precio,activo,disponible')
        .in('id', hamburguesas)
        .then(({ data, error }) => {
          if (error) throw error

          return (data ?? []).map((item) => ({
            id: item.id,
            tipo: 'hamburguesa',
            nombre: item.nombre,
            precio: Number(item.precio),
            disponible: item.activo && item.disponible,
          }))
        })
    )
  }

  if (promociones.length) {
    consultas.push(
      supabase
        .from('promociones')
        .select('id,titulo,precio,activa,disponible,inicio,fin')
        .in('id', promociones)
        .then(({ data, error }) => {
          if (error) throw error

          const ahora = Date.now()

          return (data ?? []).map((item) => ({
            id: item.id,
            tipo: 'promocion',
            nombre: item.titulo,
            precio: Number(item.precio),
            disponible:
              item.activa &&
              item.disponible &&
              (!item.inicio || Date.parse(item.inicio) <= ahora) &&
              (!item.fin || Date.parse(item.fin) >= ahora),
          }))
        })
    )
  }

  return (await Promise.all(consultas)).flat()
}

export default function CarritoFlotante() {
  const {
    items,
    abierto,
    setAbierto,
    cambiarCantidad,
    quitar,
    vaciar,
  } = useCarrito()

  const {
    data: config,
    isPending: cargandoConfig,
  } = useDatosLocal()

  const {
    data: estado,
    isPending: cargandoEstado,
  } = useEstadoLocal()

  const {
    data: publicado,
    isPending: cargandoPublicacion,
  } = usePublicacion()

  const firma = items
    .map((item) => `${item.tipo}:${item.id}`)
    .sort()
    .join('|')

  const {
    data: productos = [],
    isPending: cargandoPrecios,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['carrito', 'precios', firma],
    queryFn: () => consultarProductos(items),
    enabled: abierto && items.length > 0,
    staleTime: 0,
    refetchOnMount: 'always',
    refetchOnWindowFocus: 'always',
    refetchInterval:
      abierto && items.length > 0 ? 15000 : false,
  })

  useEffect(() => {
    if (!abierto) return

    function cerrar(evento) {
      if (evento.key === 'Escape') {
        setAbierto(false)
      }
    }

    const anterior = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    window.addEventListener('keydown', cerrar)

    return () => {
      document.body.style.overflow = anterior
      window.removeEventListener('keydown', cerrar)
    }
  }, [abierto, setAbierto])

  const detalle = useMemo(() => {
    return items.map((item) => {
      const actual = productos.find(
        (producto) =>
          producto.id === item.id &&
          producto.tipo === item.tipo
      )

      return {
        ...item,
        nombre: actual?.nombre ?? item.nombre,
        precio: actual?.precio ?? null,
        disponible: actual?.disponible === true,
      }
    })
  }, [items, productos])

  const cantidad = detalle.reduce(
    (total, item) => total + item.cantidad,
    0
  )

  const subtotal = detalle.reduce(
    (total, item) =>
      total + (item.precio ?? 0) * item.cantidad,
    0
  )

  const productosValidos =
    detalle.length > 0 &&
    detalle.every(
      (item) =>
        item.disponible &&
        item.precio !== null &&
        Number.isFinite(item.precio) &&
        item.precio >= 0
    )

  const cargando =
    cargandoConfig ||
    cargandoEstado ||
    cargandoPublicacion ||
    cargandoPrecios

  const puedePedir =
    abierto &&
    !cargando &&
    !isError &&
    publicado === true &&
    estado?.puede_pedir === true &&
    productosValidos &&
    Boolean(config?.whatsapp)

  const mensaje = [
    '¡Hola Sky Burger! 🍔',
    'Quisiera realizar este pedido:',
    '',
    ...detalle.map(
      (item) =>
        `• ${item.cantidad} x ${item.nombre} — ${precioARS(
          (item.precio ?? 0) * item.cantidad
        )}`
    ),
    '',
    `Total de productos: ${precioARS(subtotal)}`,
    '',
    'Quisiera coordinar la entrega o retiro y el método de pago.',
    '¿Me confirman la disponibilidad y el total final?',
    '¡Gracias!',
  ].join('\n')

  const whatsapp = puedePedir
    ? enlaceWhatsApp(config.whatsapp, mensaje)
    : null

  let aviso = ''

  if (!cargando) {
    if (publicado !== true || estado?.puede_pedir !== true) {
      aviso = 'No estamos recibiendo pedidos en este momento.'
    } else if (isError) {
      aviso = 'No pudimos comprobar los precios.'
    } else if (!productosValidos) {
      aviso = 'Hay productos que ya no están disponibles.'
    } else if (!config?.whatsapp) {
      aviso = 'WhatsApp no está configurado.'
    }
  }

  if (!abierto) return null

  return (
    <div className="fixed inset-0 z-[100]">
      {/* DESENFOQUE */}
      <button
        type="button"
        aria-label="Cerrar carrito"
        onClick={() => setAbierto(false)}
        className="absolute inset-0 bg-black/55 backdrop-blur-sm"
      />

      {/* VENTANA */}
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="carrito-titulo"
        className="absolute bottom-4 left-4 right-4 flex max-h-[min(78dvh,560px)] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#242424] text-white shadow-[0_24px_80px_rgba(0,0,0,0.55)] sm:bottom-6 sm:left-auto sm:right-6 sm:w-[350px]"
      >
        {/* CABECERA */}
        <header className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-3">
          <div className="flex items-center gap-2.5">
            <FaShoppingBag
              aria-hidden="true"
              className="text-sm text-sky-primary"
            />

            <h2
              id="carrito-titulo"
              className="font-heading text-base font-bold"
            >
              Tu carrito
            </h2>

            <span className="text-xs text-white/40">
              ({cantidad})
            </span>
          </div>

          <button
            type="button"
            onClick={() => setAbierto(false)}
            aria-label="Cerrar carrito"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-white/50 hover:bg-white/10 hover:text-white"
          >
            <FaTimes size={14} />
          </button>
        </header>

        {/* PRODUCTOS */}
        <div className="min-h-0 flex-1 overflow-y-auto px-4">
          {detalle.length === 0 ? (
            <div className="py-12 text-center">
              <FaShoppingBag className="mx-auto text-2xl text-sky-primary" />

              <p className="mt-4 text-sm font-semibold">
                Tu carrito está vacío.
              </p>

              <button
                type="button"
                onClick={() => setAbierto(false)}
                className="mt-4 text-xs font-semibold text-sky-primary hover:underline"
              >
                Explorar el menú
              </button>
            </div>
          ) : (
            detalle.map((item) => (
              <article
                key={`${item.tipo}:${item.id}`}
                className="flex items-center justify-between gap-3 border-b border-white/10 py-4 last:border-0"
              >
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-white">
                    {item.nombre}
                  </h3>

                  <p className="mt-1 text-xs text-sky-beige">
                    {item.precio === null
                      ? 'Consultando...'
                      : precioARS(item.precio)}
                  </p>

                  {!cargando && !item.disponible && (
                    <p className="mt-1 text-[11px] text-sky-primary">
                      No disponible
                    </p>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    aria-label={`Restar ${item.nombre}`}
                    onClick={() =>
                      cambiarCantidad(
                        item.id,
                        item.tipo,
                        item.cantidad - 1
                      )
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white/70 hover:bg-white/10"
                  >
                    <FaMinus size={10} />
                  </button>

                  <span className="w-5 text-center text-xs font-bold">
                    {item.cantidad}
                  </span>

                  <button
                    type="button"
                    aria-label={`Sumar ${item.nombre}`}
                    onClick={() =>
                      cambiarCantidad(
                        item.id,
                        item.tipo,
                        item.cantidad + 1
                      )
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/5 text-white/70 hover:bg-white/10"
                  >
                    <FaPlus size={10} />
                  </button>

                  <button
                    type="button"
                    onClick={() => quitar(item.id, item.tipo)}
                    aria-label={`Quitar ${item.nombre}`}
                    className="ml-1 flex h-8 w-7 items-center justify-center text-white/35 hover:text-sky-primary"
                  >
                    <FaTrashAlt size={11} />
                  </button>
                </div>
              </article>
            ))
          )}
        </div>

        {/* RESUMEN */}
        {detalle.length > 0 && (
          <footer className="shrink-0 border-t border-white/10 bg-[#202020] px-4 py-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white/70">
                Total estimado
              </span>

              <span className="font-heading text-xl font-bold text-sky-beige">
                {cargandoPrecios || isError
                  ? '—'
                  : precioARS(subtotal)}
              </span>
            </div>

            <p className="mt-2 text-[11px] leading-relaxed text-white/40">
              Pago y entrega se coordinan por WhatsApp.
            </p>

            {aviso && (
              <p
                role="status"
                className="mt-3 text-xs text-sky-primary"
              >
                {aviso}
              </p>
            )}

            {isError && (
              <button
                type="button"
                onClick={() => refetch()}
                className="mt-2 text-xs underline"
              >
                Reintentar
              </button>
            )}

            {whatsapp ? (
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex min-h-11 items-center justify-center gap-2 rounded-xl bg-sky-primary px-4 text-sm font-bold text-white transition hover:brightness-110"
              >
                <FaWhatsapp aria-hidden="true" />
                Enviar pedido
              </a>
            ) : (
              <button
                type="button"
                disabled
                className="mt-4 min-h-11 w-full rounded-xl bg-sky-primary px-4 text-sm font-bold text-white opacity-40"
              >
                {cargando ? 'Verificando...' : 'Enviar pedido'}
              </button>
            )}

            <button
              type="button"
              onClick={vaciar}
              className="mt-3 w-full text-center text-[11px] text-white/40 transition hover:text-white"
            >
              Vaciar carrito
            </button>
          </footer>
        )}
      </section>
    </div>
  )
}
