
import { FaTools, FaArrowLeft } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

export default function PanelSeccion({
  titulo = 'Sección',
  descripcion = 'Estamos terminando este módulo de Sky Burger.',
  children,
}) {
  const navigate = useNavigate()

  return (
    <section className="mx-auto max-w-3xl py-6 sm:py-12">
      <div className="rounded-2xl border border-white/10 bg-sky-surface p-6 sm:p-10">
        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-sky-primary/10 text-sky-primary">
          <FaTools aria-hidden="true" />
        </div>

        <p className="mt-7 text-xs font-bold uppercase tracking-widest text-sky-primary">
          Panel Sky Burger
        </p>

        <h1 className="mt-3 font-heading text-3xl font-bold sm:text-4xl">
          {titulo}
        </h1>

        <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/55">
          {descripcion}
        </p>

        {children && (
          <div className="mt-7">{children}</div>
        )}

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-xl border border-white/15 px-5 text-sm font-semibold transition hover:border-sky-primary"
        >
          <FaArrowLeft aria-hidden="true" />
          Volver
        </button>
      </div>
    </section>
  )
}
