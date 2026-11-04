
import { Link } from 'react-router-dom'
import {
  FaArrowRight,
  FaHeart,
  FaStar,
  FaHamburger,
  FaUsers,
} from 'react-icons/fa'

const valores = [
  {
    Icono: FaHeart,
    titulo: 'Pasión por lo artesanal',
    descripcion:
      'Nos gusta cuidar cada preparación y ofrecer una experiencia llena de sabor.',
  },
  {
    Icono: FaStar,
    titulo: 'Calidad en cada detalle',
    descripcion:
      'Buscamos combinar buenos ingredientes con recetas que tengan personalidad.',
  },
  {
    Icono: FaUsers,
    titulo: 'Momentos para compartir',
    descripcion:
      'Creemos que una buena hamburguesa también es una excusa para encontrarse.',
  },
]

export default function Nosotros() {
  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute -right-20 top-0 h-96 w-96 rounded-full bg-sky-primary/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 lg:grid-cols-2 lg:py-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-primary/25 bg-sky-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-sky-primary">
              <FaHeart aria-hidden="true" />
              Nuestra esencia
            </div>

            <h1 className="mt-6 font-heading text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Somos
              <span className="block text-sky-primary">
                Sky Burger.
              </span>
            </h1>

            <p className="mt-6 text-lg font-medium leading-relaxed text-sky-beige">
              Cada bocado cuenta una historia.
            </p>

            <p className="mt-5 max-w-xl leading-relaxed text-white/65">
              Amamos las hamburguesas artesanales y creemos
              que comer algo rico debería ser una experiencia
              especial. Por eso buscamos crear combinaciones
              únicas, con sabor y personalidad.
            </p>

            <Link
              to="/hamburguesas"
              className="mt-8 inline-flex min-h-12 items-center gap-3 rounded-xl bg-sky-primary px-6 font-bold text-white transition hover:brightness-110"
            >
              Conocé nuestro menú
              <FaArrowRight aria-hidden="true" />
            </Link>
          </div>

          <div className="relative mx-auto flex aspect-square w-full max-w-md items-center justify-center">
            <div className="absolute inset-6 rounded-full bg-sky-primary/15 blur-3xl" />

            <div className="relative flex aspect-square w-full items-center justify-center rounded-full border border-white/10 bg-sky-surface p-10">
              <img
                src="/marca/LOGO PRINCIPAL.webp"
                alt="Logo de Sky Burger"
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* MISIÓN Y VISIÓN */}
      <section className="border-y border-white/10 bg-sky-surface px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-sky-primary">
              Lo que nos mueve
            </p>

            <h2 className="mt-3 font-heading text-3xl font-bold sm:text-4xl">
              Nuestra filosofía
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <article className="rounded-2xl border border-white/10 bg-sky-background p-7 sm:p-9">
              <span className="font-heading text-5xl font-bold text-sky-primary/50">
                01.
              </span>

              <h3 className="mt-5 font-heading text-2xl font-bold">
                Nuestra misión
              </h3>

              <p className="mt-4 leading-relaxed text-white/65">
                Brindar hamburguesas artesanales de alta
                calidad con recetas únicas, cuidando el sabor
                y la experiencia de quienes nos eligen.
              </p>
            </article>

            <article className="rounded-2xl border border-white/10 bg-sky-background p-7 sm:p-9">
              <span className="font-heading text-5xl font-bold text-sky-primary/50">
                02.
              </span>

              <h3 className="mt-5 font-heading text-2xl font-bold">
                Nuestra visión
              </h3>

              <p className="mt-4 leading-relaxed text-white/65">
                Ser la mejor hamburguesería de la zona,
                reconocida por la calidad de nuestros
                productos, la creatividad y la cercanía
                con nuestros clientes.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* VALORES */}
      <section className="px-5 py-16 sm:px-8 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-sky-primary">
              Así somos
            </p>

            <h2 className="mt-3 font-heading text-3xl font-bold sm:text-4xl">
              Lo que hace especial a Sky Burger
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {valores.map(({ Icono, titulo, descripcion }) => (
              <article
                key={titulo}
                className="rounded-2xl border border-white/10 bg-sky-surface p-7 transition-colors hover:border-sky-primary/40"
              >
                <div className="inline-flex rounded-2xl bg-sky-primary/10 p-4 text-sky-primary">
                  <Icono size={24} aria-hidden="true" />
                </div>

                <h3 className="mt-6 font-heading text-xl font-bold">
                  {titulo}
                </h3>

                <p className="mt-4 text-sm leading-relaxed text-white/65">
                  {descripcion}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-20 sm:px-8">
        <div className="mx-auto max-w-7xl rounded-3xl bg-sky-beige px-6 py-12 text-center text-sky-background sm:px-10 sm:py-16">
          <FaHamburger className="mx-auto text-4xl text-sky-primary" />

          <h2 className="mt-5 font-heading text-3xl font-bold sm:text-4xl">
            ¿Listo para conocer nuestro sabor?
          </h2>

          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-sky-background/70">
            Elegí una receta del menú o armá tu propia
            combinación con tus ingredientes favoritos.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/hamburguesas"
              className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-sky-primary px-6 font-bold text-white"
            >
              Ver menú
              <FaArrowRight aria-hidden="true" />
            </Link>

            <Link
              to="/hamburguesas#arma-la-tuya"
              className="inline-flex min-h-12 items-center justify-center rounded-xl border border-sky-background/20 px-6 font-bold text-sky-background transition hover:bg-black/5"
            >
              Armá la tuya
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
