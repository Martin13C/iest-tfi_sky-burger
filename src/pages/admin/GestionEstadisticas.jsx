
import {
  FaChartLine,
  FaLock,
} from 'react-icons/fa'

export default function GestionEstadisticas() {
  return (
    <section className="max-w-3xl space-y-4">
      <header>
        <h1 className="font-heading text-xl font-bold text-white sm:text-2xl">
          Estadísticas
        </h1>

        <p className="mt-1 text-xs text-white/45">
          Análisis del rendimiento de Sky Burger.
        </p>
      </header>

      <div className="rounded-xl border border-white/10 bg-sky-surface p-6 sm:p-8">
        <div className="flex flex-col items-center gap-4 py-5 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-primary/10 text-sky-primary">
            <FaChartLine size={23} />
          </div>

          <div className="max-w-md space-y-2">
            <h2 className="font-heading text-lg font-bold text-white">
              Analítica web
            </h2>

            <p className="text-sm leading-relaxed text-white/55">
              Próximamente podrás consultar las visitas
              del sitio, la interacción de los clientes
              y el rendimiento de los productos.
            </p>
          </div>

          <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-[11px] font-medium text-white/55">
            <FaLock size={11} />
            Disponible en futuras versiones
          </span>
        </div>
      </div>
    </section>
  )
}
