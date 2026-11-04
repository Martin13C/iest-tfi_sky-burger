
import { Link } from 'react-router-dom'
import {
  FaArrowRight,
  FaFire,
  FaGift,
} from 'react-icons/fa'

import { usePromociones } from '../../hooks/useCatalogo'
import TarjetaCatalogo from '../../components/public/TarjetaCatalogo'

export default function Promociones() {
  const {
    data: promociones = [],
    isPending,
    isError,
    error,
  } = usePromociones()

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute -right-24 top-0 h-80 w-80 rounded-full bg-sky-primary/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-primary/25 bg-sky-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-sky-primary">
              <FaFire aria-hidden="true" />
              Para aprovechar
            </div>

            <h1 className="mt-6 font-heading text-4xl font-bold sm:text-5xl lg:text-6xl">
              Más sabor.
              <span className="block text-sky-primary">
                Mejores momentos.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg">
              Descubrí nuestras promociones y combos.
              Propuestas pensadas para disfrutar una
              buena hamburguesa y compartir.
            </p>

            <a
              href="#promociones"
              className="mt-8 inline-flex min-h-12 items-center gap-3 rounded-xl bg-sky-primary px-6 font-bold text-white transition hover:brightness-110"
            >
              Ver promociones
              <FaArrowRight aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>

      {/* PROMOCIONES DINÁMICAS */}
      <section
        id="promociones"
        className="scroll-mt-28 px-5 py-16 sm:px-8 sm:py-20"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-9">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-primary">
              Elegí tu combo
            </p>

            <h2 className="mt-3 font-heading text-3xl font-bold sm:text-4xl">
              Promociones disponibles
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-white/60">
              Las promociones pueden cambiar según
              su disponibilidad y vigencia.
            </p>
          </div>

          {isPending && (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-96 animate-pulse rounded-2xl bg-sky-surface"
                />
              ))}
            </div>
          )}

          {isError && (
            <div
              role="alert"
              className="rounded-2xl border border-sky-primary/30 bg-sky-primary/10 p-6"
            >
              <h3 className="font-heading text-xl font-bold">
                No pudimos cargar las promociones.
              </h3>
              <p className="mt-2 text-sm text-white/65">
                {error?.message}
              </p>
            </div>
          )}

          {!isPending && !isError && (
            <>
              {promociones.length > 0 ? (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {promociones.map((promocion) => (
                    <TarjetaCatalogo
                      key={promocion.id}
                      producto={promocion}
                      tipo="promocion"
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-3xl border border-white/10 bg-sky-surface px-6 py-16 text-center">
                  <FaGift className="mx-auto text-4xl text-sky-primary" />

                  <h3 className="mt-5 font-heading text-2xl font-bold">
                    Estamos preparando nuevas promos.
                  </h3>

                  <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/60">
                    Todavía no hay promociones vigentes,
                    pero podés disfrutar nuestras hamburguesas
                    del menú.
                  </p>

                  <Link
                    to="/hamburguesas"
                    className="mt-7 inline-flex min-h-12 items-center gap-3 rounded-xl bg-sky-primary px-6 font-bold text-white"
                  >
                    Ir al menú
                    <FaArrowRight aria-hidden="true" />
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* PERSONALIZACIÓN */}
      <section className="border-t border-white/10 bg-sky-surface px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-7 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-sky-primary">
              Una propuesta diferente
            </p>

            <h2 className="mt-3 font-heading text-3xl font-bold sm:text-4xl">
              ¿Preferís crear tu propia hamburguesa?
            </h2>

            <p className="mt-4 leading-relaxed text-white/65">
              Elegí el pan, los medallones y todos los
              ingredientes que quieras. Después consultanos
              por WhatsApp.
            </p>
          </div>

          <Link
            to="/hamburguesas#arma-la-tuya"
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-3 rounded-xl bg-sky-primary px-6 font-bold text-white transition hover:brightness-110"
          >
            Armá la tuya
            <FaArrowRight aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  )
}
