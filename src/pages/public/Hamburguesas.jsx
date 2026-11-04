
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FaArrowDown,
  FaArrowRight,
  FaHamburger,
  FaSlidersH,
} from 'react-icons/fa'

import { useHamburguesas } from '../../hooks/useCatalogo'
import TarjetaCatalogo from '../../components/public/TarjetaCatalogo'
import ArmaTuHamburguesa from './ArmaTuHamburguesa'

export default function Hamburguesas() {
  const [categoria, setCategoria] = useState('Todas')

  const {
    data: hamburguesas = [],
    isPending,
    isError,
    error,
  } = useHamburguesas()

  const categorias = useMemo(() => {
    const disponibles = hamburguesas
      .map((producto) => producto.categoria?.trim())
      .filter(Boolean)

    return ['Todas', ...new Set(disponibles)]
  }, [hamburguesas])

  const filtradas = useMemo(() => {
    if (categoria === 'Todas') return hamburguesas

    return hamburguesas.filter(
      (producto) => producto.categoria?.trim() === categoria
    )
  }, [hamburguesas, categoria])

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute -right-20 top-0 h-72 w-72 rounded-full bg-sky-primary/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-8 sm:py-20">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-sky-primary/25 bg-sky-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-sky-primary">
              <FaHamburger aria-hidden="true" />
              El menú de Sky Burger
            </span>

            <h1 className="mt-6 font-heading text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Hamburguesas con
              <span className="block text-sky-primary">
                personalidad.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg">
              Descubrí nuestras recetas artesanales, elegí tu
              favorita y prepará tu próximo pedido.
              Cada combinación tiene algo especial.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="#catalogo"
                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-sky-primary px-6 font-bold text-white transition hover:brightness-110"
              >
                Explorar hamburguesas
                <FaArrowDown aria-hidden="true" />
              </a>

              <a
                href="#arma-la-tuya"
                className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl border border-white/20 px-6 font-bold text-white transition hover:border-sky-primary hover:bg-white/5"
              >
                Armá la tuya
                <FaArrowRight aria-hidden="true" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CATÁLOGO */}
      <section
        id="catalogo"
        className="scroll-mt-28 px-5 py-14 sm:px-8 sm:py-20"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mb-9 flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-sky-primary">
                Elegí tu favorita
              </p>

              <h2 className="mt-3 font-heading text-3xl font-bold sm:text-4xl">
                Nuestro menú
              </h2>

              <p className="mt-3 text-sm leading-relaxed text-white/60">
                Preparadas con ingredientes seleccionados
                y mucho sabor.
              </p>
            </div>

            {!isPending && !isError && (
              <p className="text-sm font-medium text-white/50">
                {filtradas.length}{' '}
                {filtradas.length === 1
                  ? 'hamburguesa'
                  : 'hamburguesas'}
              </p>
            )}
          </div>

          {/* FILTROS */}
          {!isPending && !isError && categorias.length > 1 && (
            <div className="mb-9 flex flex-wrap items-center gap-2">
              <FaSlidersH
                aria-hidden="true"
                className="mr-2 text-sky-primary"
              />

              {categorias.map((nombre) => (
                <button
                  key={nombre}
                  type="button"
                  aria-pressed={categoria === nombre}
                  onClick={() => setCategoria(nombre)}
                  className={`min-h-11 rounded-full border px-5 text-sm font-bold transition ${
                    categoria === nombre
                      ? 'border-sky-primary bg-sky-primary text-white'
                      : 'border-white/10 bg-sky-surface text-white/70 hover:border-white/30 hover:text-white'
                  }`}
                >
                  {nombre}
                </button>
              ))}
            </div>
          )}

          {/* CARGANDO */}
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

          {/* ERROR */}
          {isError && (
            <div
              role="alert"
              className="rounded-2xl border border-sky-primary/30 bg-sky-primary/10 p-6"
            >
              <p className="font-bold">
                No pudimos cargar el menú.
              </p>
              <p className="mt-2 text-sm text-white/65">
                {error?.message}
              </p>
            </div>
          )}

          {/* PRODUCTOS */}
          {!isPending && !isError && (
            filtradas.length > 0 ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {filtradas.map((producto) => (
                  <TarjetaCatalogo
                    key={producto.id}
                    producto={producto}
                    tipo="hamburguesa"
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-sky-surface p-10 text-center">
                <FaHamburger className="mx-auto text-3xl text-sky-primary" />

                <h3 className="mt-4 font-heading text-xl font-bold">
                  Todavía no hay hamburguesas disponibles.
                </h3>

                <p className="mt-2 text-sm text-white/60">
                  Podés explorar otra categoría o volver más tarde.
                </p>

                {categoria !== 'Todas' && (
                  <button
                    type="button"
                    onClick={() => setCategoria('Todas')}
                    className="mt-5 rounded-xl bg-sky-primary px-5 py-3 font-bold text-white"
                  >
                    Ver todas
                  </button>
                )}
              </div>
            )
          )}
        </div>
      </section>

      {/* ARMÁ LA TUYA: SIN CTA REDUNDANTE ENCIMA */}
      <ArmaTuHamburguesa />

      {/* PROMOCIONES */}
      <section className="border-t border-white/10 px-5 py-12 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-heading text-2xl font-bold">
              ¿Buscás algo para compartir?
            </h2>

            <p className="mt-2 text-sm text-white/60">
              Mirá las promociones y combos disponibles.
            </p>
          </div>

          <Link
            to="/promociones"
            className="inline-flex min-h-12 items-center gap-3 rounded-xl border border-white/20 px-6 font-bold transition hover:border-sky-primary"
          >
            Ver promociones
            <FaArrowRight aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  )
}
