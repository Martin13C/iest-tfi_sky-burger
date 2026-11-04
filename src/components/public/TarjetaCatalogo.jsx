
import { FaShoppingBag, FaFire, FaCheck } from 'react-icons/fa'
import { toast } from 'react-toastify'

import { obtenerUrlImagen } from '../../config/supabaseClient'
import { useCarrito } from '../../context/CarritoContext'
import { precioARS } from '../../utils/formato'

export default function TarjetaCatalogo({
  producto,
  tipo = 'hamburguesa',
}) {
  const { agregar } = useCarrito()

  const promocion = tipo === 'promocion'

  const nombre = promocion
    ? producto.titulo
    : producto.nombre

  const imagen = producto.imagen_ruta
    ? obtenerUrlImagen(producto.imagen_ruta)
    : null

  const disponible = producto.disponible === true
  const destacado = producto.destacado === true

  const precio = Number(producto.precio ?? 0)

  function agregarAlCarrito() {
    if (!disponible) return

    agregar(
      {
        id: producto.id,
        nombre,
      },
      tipo
    )

    toast.success(`${nombre} agregado al carrito`)
  }

  return (
    <article className="group flex h-full min-w-0 flex-col overflow-hidden rounded-2xl border border-white/10 bg-sky-surface shadow-[0_12px_40px_rgba(0,0,0,0.12)] transition-all duration-300 hover:-translate-y-1 hover:border-sky-primary/40 hover:shadow-[0_20px_50px_rgba(0,0,0,0.24)]">
      {/* IMAGEN */}
      <div className="relative aspect-[4/3] overflow-hidden bg-[#181818]">
        {imagen ? (
          <img
            src={imagen}
            alt={nombre}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-5 text-center">
            <span className="font-heading text-2xl font-bold text-white/20">
              SKY BURGER
            </span>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          {destacado && (
            <span className="inline-flex items-center gap-2 rounded-full bg-sky-primary px-3 py-1.5 text-xs font-bold text-white shadow-lg">
              <FaFire aria-hidden="true" />
              Destacada
            </span>
          )}

          {promocion && (
            <span className="rounded-full bg-sky-beige px-3 py-1.5 text-xs font-bold text-sky-background">
              Promo
            </span>
          )}
        </div>

        {!disponible && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/65 backdrop-blur-[2px]">
            <span className="rounded-xl border border-white/25 bg-black/50 px-5 py-3 font-heading text-lg font-bold text-white">
              No disponible
            </span>
          </div>
        )}
      </div>

      {/* CONTENIDO */}
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex-1">
          {!promocion && producto.categoria && (
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-sky-primary">
              {producto.categoria}
            </p>
          )}

          <h3 className="mt-2 font-heading text-2xl font-bold leading-tight text-white">
            {nombre}
          </h3>

          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/60">
            {producto.descripcion ||
              'Una propuesta artesanal preparada con el sabor de Sky Burger.'}
          </p>
        </div>

        {/* PRECIO Y PEDIDO */}
        <div className="mt-6 border-t border-white/10 pt-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs text-white/45">
                Precio
              </p>

              <p className="mt-1 font-heading text-2xl font-bold text-sky-beige">
                {precioARS(precio)}
              </p>
            </div>

            <span
              className={`inline-flex items-center gap-2 text-xs font-semibold ${
                disponible
                  ? 'text-green-400'
                  : 'text-white/40'
              }`}
            >
              {disponible && <FaCheck aria-hidden="true" />}
              {disponible ? 'Disponible' : 'Agotado'}
            </span>
          </div>

          <button
            type="button"
            disabled={!disponible}
            onClick={agregarAlCarrito}
            className="mt-5 flex min-h-12 w-full items-center justify-center gap-3 rounded-xl bg-sky-primary px-5 font-bold text-white transition hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/40"
          >
            <FaShoppingBag aria-hidden="true" />
            {disponible
              ? 'Agregar al carrito'
              : 'No disponible'}
          </button>
        </div>
      </div>
    </article>
  )
}
