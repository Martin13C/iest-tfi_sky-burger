
import { useEffect, useState } from 'react'
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
} from 'react-router-dom'

import {
  FaBars,
  FaTimes,
  FaWhatsapp,
  FaArrowUp,
  FaShoppingBag,
  FaInstagram,
} from 'react-icons/fa'

import { useCarrito } from '../context/CarritoContext'
import { useDatosLocal } from '../hooks/useCatalogo'
import { enlaceWhatsApp } from '../utils/formato'

import CarritoFlotante from '../components/carrito/CarritoFlotante'

const enlaces = [
  { to: '/', nombre: 'Inicio' },
  { to: '/hamburguesas', nombre: 'Hamburguesas' },
  { to: '/promociones', nombre: 'Promociones' },
  { to: '/nosotros', nombre: 'Nosotros' },
  { to: '/galeria', nombre: 'Galeria' },
  { to: '/contacto', nombre: 'Contacto' },
]

function Marca({ grande = false }) {
  const [imagenFallida, setImagenFallida] = useState(false)

  return (
    <Link
      to="/"
      aria-label="Sky Burger - inicio"
      className="inline-flex min-w-0 items-center gap-3"
    >
      {!imagenFallida && (
        <img
          src="/marca/logo.svg"
          alt=""
          onError={() => setImagenFallida(true)}
          className={`shrink-0 object-contain ${
            grande ? 'h-16 w-16' : 'h-11 w-11'
          }`}
        />
      )}

      <span
        className={`font-heading font-bold tracking-tight ${
          grande ? 'text-3xl' : 'text-xl sm:text-2xl'
        }`}
      >
        SKY<span className="text-sky-primary">BURGER</span>
      </span>
    </Link>
  )
}

export default function PublicLayout() {
  const [menuAbierto, setMenuAbierto] = useState(false)
  const location = useLocation()

  const { cantidadTotal, setAbierto } = useCarrito()
  const { data: config } = useDatosLocal()

  const whatsapp = enlaceWhatsApp(
    config?.whatsapp,
    '¡Hola Sky Burger! Quisiera hacer una consulta.'
  )

  const usuarioInstagram = (config?.instagram ?? '')
    .trim()
    .replace(/^https?:\/\/(www\.)?instagram\.com\//i, '')
    .replace(/^@/, '')
    .split('/')[0]

  const instagramUrl =
    /^[a-zA-Z0-9._]{1,30}$/.test(usuarioInstagram)
      ? `https://www.instagram.com/${usuarioInstagram}/`
      : null

  useEffect(() => {
    setMenuAbierto(false)

    if (location.hash) {
      const id = decodeURIComponent(location.hash.slice(1))

      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        })
      })
    } else {
      window.scrollTo({
        top: 0,
        behavior: 'auto',
      })
    }
  }, [location.pathname, location.hash])

  useEffect(() => {
    if (!menuAbierto) return

    function cerrarConEscape(evento) {
      if (evento.key === 'Escape') {
        setMenuAbierto(false)
      }
    }

    window.addEventListener('keydown', cerrarConEscape)

    return () =>
      window.removeEventListener('keydown', cerrarConEscape)
  }, [menuAbierto])

  return (
    <div className="flex min-h-screen flex-col bg-sky-background">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[90] focus:rounded-lg focus:bg-white focus:p-3 focus:text-black"
      >
        Saltar al contenido
      </a>

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-sky-background/95 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
          <Marca />

          {/* ENLACES A LA DERECHA */}
          <nav
            aria-label="Navegación principal"
            className="ml-auto hidden items-center justify-end gap-7 lg:flex"
          >
            {enlaces.map(({ to, nombre }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `py-2 text-sm font-bold transition-colors ${
                    isActive
                      ? 'text-sky-primary'
                      : 'text-white/75 hover:text-sky-primary'
                  }`
                }
              >
                {nombre}
              </NavLink>
            ))}
          </nav>

          {/* MENÚ MÓVIL */}
          <button
            type="button"
            onClick={() =>
              setMenuAbierto((actual) => !actual)
            }
            aria-label={
              menuAbierto ? 'Cerrar menú' : 'Abrir menú'
            }
            aria-expanded={menuAbierto}
            aria-controls="menu-movil"
            className="ml-auto inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/15 text-xl transition hover:border-sky-primary lg:hidden"
          >
            {menuAbierto ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {menuAbierto && (
          <nav
            id="menu-movil"
            aria-label="Navegación móvil"
            className="absolute left-0 right-0 top-full border-b border-white/10 bg-sky-background p-5 shadow-2xl lg:hidden"
          >
            <div className="mx-auto flex max-w-7xl flex-col gap-2">
              {enlaces.map(({ to, nombre }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  onClick={() => setMenuAbierto(false)}
                  className={({ isActive }) =>
                    `rounded-xl px-4 py-3 text-sm font-semibold ${
                      isActive
                        ? 'bg-sky-primary text-white'
                        : 'text-white/80 hover:bg-white/5'
                    }`
                  }
                >
                  {nombre}
                </NavLink>
              ))}
            </div>
          </nav>
        )}
      </header>

      {/* CONTENIDO */}
      <main id="contenido" className="min-w-0 flex-1">
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-[#181818]">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 md:grid-cols-3 md:py-16">
          <div>
            <Marca grande />

            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/65">
              Cada bocado cuenta una historia.
              Hamburguesas artesanales preparadas con pasión.
            </p>
          </div>

          <div>
            <h2 className="font-heading text-lg font-semibold text-sky-beige">
              Explorá
            </h2>

            <nav className="mt-5 flex flex-col gap-3">
              {enlaces.map(({ to, nombre }) => (
                <Link
                  key={to}
                  to={to}
                  className="w-fit text-sm text-white/65 transition hover:text-sky-primary"
                >
                  {nombre}
                </Link>
              ))}

            
            </nav>
          </div>

          <div>
            <h2 className="font-heading text-lg font-semibold text-sky-beige">
              Hablemos
            </h2>

            <div className="mt-5 flex flex-col gap-4 text-sm text-white/65">
              {config?.direccion && (
                <p>{config.direccion}</p>
              )}

              {whatsapp && (
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 hover:text-white"
                >
                  <FaWhatsapp className="text-green-400" />
                  WhatsApp
                </a>
              )}

              {instagramUrl && (
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 hover:text-white"
                >
                  <FaInstagram className="text-sky-primary" />
                  Instagram
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 px-5 py-5 text-center text-xs text-white/40">
          © {new Date().getFullYear()} Sky Burger.
          Todos los derechos reservados.
        </div>
      </footer>

      {/* CARRITO ACTUAL */}
      <CarritoFlotante />

      {/* BOTONES FLOTANTES: SIN CAMBIOS */}
      <div className="fixed bottom-4 right-4 z-40 flex items-end gap-3 sm:bottom-6 sm:right-6">
        <button
          type="button"
          onClick={() => setAbierto(true)}
          aria-label={`Abrir carrito con ${cantidadTotal} productos`}
          className="relative flex h-13 w-13 items-center justify-center rounded-full bg-sky-primary text-xl text-white shadow-xl transition hover:scale-105 sm:h-14 sm:w-14"
        >
          <FaShoppingBag aria-hidden="true" />

          {cantidadTotal > 0 && (
            <span className="absolute -right-1 -top-1 grid h-6 min-w-6 place-items-center rounded-full bg-sky-beige px-1 text-xs font-bold text-sky-background">
              {cantidadTotal}
            </span>
          )}
        </button>

        <div className="flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: 'smooth',
              })
            }
            aria-label="Volver arriba"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-sky-surface text-white shadow-xl transition hover:scale-105 sm:h-12 sm:w-12"
          >
            <FaArrowUp aria-hidden="true" />
          </button>

          {whatsapp && (
            <a
              href={whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Consultar por WhatsApp"
              className="flex h-13 w-13 items-center justify-center rounded-full bg-green-600 text-2xl text-white shadow-xl transition hover:scale-105 sm:h-14 sm:w-14"
            >
              <FaWhatsapp aria-hidden="true" />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
