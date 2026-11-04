import { Link, useLocation } from 'react-router-dom'
import {
  FaArrowLeft,
  FaHome,
} from 'react-icons/fa'

import { useAuth } from '../context/AuthContext'

export default function NotFound({ dentroDelPanel = false }) {
  const location = useLocation()
  const { perfil } = useAuth()

  const rutaPanel =
    perfil?.rol === 'administrador'
      ? '/admin'
      : perfil?.rol === 'dueno'
        ? '/dueno'
        : '/'

  const destino = dentroDelPanel ? rutaPanel : '/'

  return (
    <main
      className={`flex flex-col items-center justify-center px-5 py-16 text-center ${
        dentroDelPanel
          ? 'min-h-[65vh]'
          : 'min-h-screen bg-sky-background'
      }`}
    >
      <p className="font-heading text-7xl font-bold tracking-tight text-sky-primary sm:text-8xl">
        404
      </p>

      <h1 className="mt-6 font-heading text-2xl font-bold text-white sm:text-3xl">
        Esta página no está en el menú.
      </h1>

      <p className="mt-4 max-w-md text-sm leading-relaxed text-white/55">
        No encontramos la dirección que buscabas.
        Podés volver al inicio y seguir navegando.
      </p>

      <p className="mt-3 max-w-full break-all text-xs text-white/30">
        {location.pathname}
      </p>

      <div className="mt-9 flex flex-col gap-3 sm:flex-row">
        <Link
          to={destino}
          className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-sky-primary px-6 font-bold text-white transition hover:brightness-110"
        >
          <FaHome aria-hidden="true" />
          {dentroDelPanel
            ? 'Volver al panel'
            : 'Ir al inicio'}
        </Link>

        <button
          type="button"
          onClick={() => window.history.back()}
          className="inline-flex min-h-12 items-center justify-center gap-3 rounded-xl border border-white/15 px-6 font-bold text-white transition hover:border-sky-primary"
        >
          <FaArrowLeft aria-hidden="true" />
          Página anterior
        </button>
      </div>
    </main>
  )
}
