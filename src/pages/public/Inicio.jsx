
import { Link } from 'react-router-dom'
import {
  FaArrowRight,
  FaHamburger,
  FaFire,
  FaHeart,
  FaTruck,
} from 'react-icons/fa'

import {
  useHamburguesas,
  usePromociones,
  useDatosLocal,
} from '../../hooks/useCatalogo'

import TarjetaCatalogo from '../../components/public/TarjetaCatalogo'
import { obtenerUrlImagen } from '../../config/supabaseClient'

const beneficios = [
  {
    Icono: FaHamburger,
    titulo: 'Artesanales',
    texto: 'Hamburguesas hechas con dedicación y sabor.',
  },
  {
    Icono: FaHeart,
    titulo: 'Ingredientes frescos',
    texto: 'Calidad y cuidado en cada preparación.',
  },
  {
    Icono: FaTruck,
    titulo: 'A tu manera',
    texto: 'Consultá por retiro o envío a domicilio.',
  },
]

export default function Inicio() {
  const { data: config } = useDatosLocal()

  const {
    data: hamburguesas = [],
    isPending: cargandoHamburguesas,
  } = useHamburguesas()

  const { data: promociones = [] } = usePromociones()

  const destacadas = hamburguesas
    .filter((item) => item.destacado)
    .slice(0, 3)

  const seleccion = destacadas.length
    ? destacadas
    : hamburguesas.slice(0, 3)

  const primeraPromocion = promociones[0]

  return (
    <>
      {/* HERO */}
      <section className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute -right-32 top-10 h-96 w-96 rounded-full bg-sky-primary/15 blur-3xl" />

        <div className="relative mx-auto grid min-h-[min(760px,90vh)] max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:py-24">
          <div className="relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full border border-sky-primary/30 bg-sky-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-sky-primary">
              <FaFire aria-hidden="true" />
              Hamburguesas artesanales
            </span>

            <h1 className="mt-7 font-heading text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl xl:text-7xl">
              Cada bocado
              <span className="block text-sky-primary">
                cuenta una historia.
              </span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-white/70 sm:text-lg">
              {config?.descripcion ||
                'En Sky Burger combinamos ingredientes frescos, recetas únicas y pasión por las hamburguesas.'}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/hamburguesas"
                className="inline-flex min-h-13 items-center justify-center gap-3 rounded-xl bg-sky-primary px-7 py-4 font-bold text-white transition hover:brightness-110"
              >
                Descubrí el menú
                <FaArrowRight aria-hidden="true" />
              </Link>

              <Link
                to="/contacto#arma-la-tuya"
                className="inline-flex min-h-13 items-center justify-center rounded-xl border border-white/20 px-7 py-4 font-bold text-white transition hover:bg-white/5"
              >
                Armá la tuya
              </Link>
            </div>

            <p className="mt-8 text-sm font-medium text-sky-beige/80">
              Hamburguesas hechas para compartir buenos momentos.
            </p>
          </div>

          {/* IMAGEN HERO */}
          <div className="relative mx-auto flex w-full max-w-xl items-center justify-center">
            <div className="absolute inset-10 rounded-full bg-sky-primary/15 blur-3xl" />

            <div className="relative aspect-square w-full max-w-[550px]">
              <img
                src="/media/Especial-1.0.png"
                alt="Hamburguesa de Sky Burger"
                className="h-full w-full object-contain drop-shadow-[0_30px_30px_rgba(0,0,0,0.4)] bg-blend-color-dodge"
              />
            </div>

            <span className="absolute bottom-3 right-2 rotate-[-8deg] rounded-xl bg-sky-beige px-5 py-3 font-heading text-sm font-bold text-sky-background shadow-xl sm:bottom-8 sm:right-6 sm:text-lg">
              ¡Puro sabor!
            </span>
          </div>
        </div>
      </section>

      {/* BENEFICIOS */}
      <section className="border-y border-white/10 bg-sky-surface">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-9 sm:px-8 md:grid-cols-3">
          {beneficios.map(({ Icono, titulo, texto }) => (
            <article
              key={titulo}
              className="flex items-start gap-4"
            >
              <div className="shrink-0 rounded-2xl bg-sky-primary/10 p-4 text-sky-primary">
                <Icono size={22} aria-hidden="true" />
              </div>

              <div>
                <h2 className="font-heading text-lg font-bold">
                  {titulo}
                </h2>

                <p className="mt-1 text-sm leading-relaxed text-white/60">
                  {texto}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* HAMBURGUESAS DESTACADAS */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-sky-primary">
              Las favoritas
            </p>

            <h2 className="mt-3 font-heading text-3xl font-bold sm:text-4xl">
              Hamburguesas destacadas
            </h2>

            <p className="mt-3 text-white/60">
              Descubrí las opciones que tenemos para vos.
            </p>
          </div>

          <Link
            to="/hamburguesas"
            className="inline-flex items-center gap-2 font-bold text-sky-primary"
          >
            Ver todo el menú
            <FaArrowRight aria-hidden="true" />
          </Link>
        </div>

        {cargandoHamburguesas ? (
          <p className="text-white/60">
            Cargando hamburguesas...
          </p>
        ) : seleccion.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {seleccion.map((producto) => (
              <TarjetaCatalogo
                key={producto.id}
                producto={producto}
              />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-white/10 bg-sky-surface p-8 text-white/60">
            Próximamente vas a encontrar nuestras hamburguesas acá.
          </p>
        )}
      </section>

      {/* PROMOCIÓN */}
      {primeraPromocion && (
        <section className="bg-sky-beige text-sky-background">
          <div className="mx-auto grid max-w-7xl items-center gap-9 px-5 py-14 sm:px-8 md:grid-cols-2">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-sky-primary">
                Para aprovechar
              </p>

              <h2 className="mt-3 font-heading text-3xl font-bold sm:text-4xl">
                {primeraPromocion.titulo}
              </h2>

              <p className="mt-4 leading-relaxed text-sky-background/75">
                {primeraPromocion.descripcion ||
                  'Conocé nuestras promociones y elegí tu próxima favorita.'}
              </p>

              <Link
                to="/promociones"
                className="mt-7 inline-flex min-h-12 items-center gap-3 rounded-xl bg-sky-primary px-6 font-bold text-white"
              >
                Ver promociones
                <FaArrowRight aria-hidden="true" />
              </Link>
            </div>

            {primeraPromocion.imagen_ruta && (
              <img
                src={obtenerUrlImagen(
                  primeraPromocion.imagen_ruta
                )}
                alt={primeraPromocion.titulo}
                loading="lazy"
                className="aspect-[4/3] w-full rounded-2xl object-cover"
              />
            )}
          </div>
        </section>
      )}

      {/* PERSONALIZACIÓN */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-sky-surface px-6 py-12 text-center sm:px-10 sm:py-16">
          <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-sky-primary/10 blur-3xl" />

          <div className="relative">
            <p className="text-sm font-bold uppercase tracking-widest text-sky-primary">
              Vos elegís
            </p>

            <h2 className="mt-4 font-heading text-3xl font-bold sm:text-5xl">
              Tu hamburguesa, tus reglas.
            </h2>

            <p className="mx-auto mt-5 max-w-xl leading-relaxed text-white/65">
              Elegí tus ingredientes favoritos y consultanos
              por una combinación personalizada.
            </p>

            <Link
              to="/contacto#arma-la-tuya"
              className="mt-8 inline-flex min-h-12 items-center gap-3 rounded-xl bg-sky-primary px-7 py-3 font-bold text-white"
            >
              Empezar a crear
              <FaArrowRight aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
