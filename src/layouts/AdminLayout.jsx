
import { useEffect, useState } from 'react'
import {
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import {
  FaBars,
  FaTimes,
  FaHome,
  FaHamburger,
  FaTags,
  FaImages,
  FaCog,
  FaUserShield,
  FaChartBar,
  FaSignOutAlt,
  FaExternalLinkAlt,
  FaChevronLeft,
  FaChevronRight,
} from 'react-icons/fa'
import { toast } from 'react-toastify'

import { supabase } from '../config/supabaseClient'

const enlaces = [
  { to: '/admin', nombre: 'Inicio', Icono: FaHome, end: true },
  { to: '/admin/hamburguesas', nombre: 'Hamburguesas', Icono: FaHamburger },
  { to: '/admin/promociones', nombre: 'Promociones', Icono: FaTags },
  { to: '/admin/galeria', nombre: 'Galería', Icono: FaImages },
  { to: '/admin/configuracion', nombre: 'Configuración', Icono: FaCog },
  { to: '/admin/dueno', nombre: 'Gestionar dueño', Icono: FaUserShield },
  { to: '/admin/estadisticas', nombre: 'Estadísticas', Icono: FaChartBar },
]

function Menu({
  compacto = false,
  cerrar = () => {},
  salir,
  saliendo,
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* MARCA */}
      <div
        className={`flex h-16 shrink-0 items-center border-b border-white/10 ${
          compacto ? 'justify-center px-2' : 'px-5'
        }`}
      >
        <NavLink
          to="/admin"
          onClick={cerrar}
          aria-label="Ir al inicio"
          className="font-heading font-bold leading-none"
        >
          {compacto ? (
            <span className="text-2xl text-sky-primary">
              S.
            </span>
          ) : (
            <span className="text-xl tracking-tight text-white">
              SKY<span className="text-sky-primary">BURGER</span>
            </span>
          )}
        </NavLink>
      </div>

      {/* NAVEGACIÓN */}
      <nav
        aria-label="Navegación del panel"
        className={`min-h-0 flex-1 space-y-1 overflow-y-auto py-4 ${
          compacto ? 'px-2' : 'px-3'
        }`}
      >
        {enlaces.map(({ to, nombre, Icono, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            title={compacto ? nombre : undefined}
            aria-label={nombre}
            onClick={cerrar}
            className={({ isActive }) =>
              `flex min-h-10 items-center rounded-lg text-sm font-medium transition-colors ${
                compacto
                  ? 'justify-center px-2'
                  : 'gap-3 px-3'
              } ${
                isActive
                  ? 'bg-sky-primary text-white'
                  : 'text-white/55 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <Icono
              aria-hidden="true"
              className="shrink-0 text-[15px]"
            />

            {!compacto && (
              <span className="truncate">{nombre}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ACCIONES DEL PIE */}
      <div
        className={`shrink-0 space-y-1 border-t border-white/10 py-3 ${
          compacto ? 'px-2' : 'px-3'
        }`}
      >
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          title={compacto ? 'Ver sitio' : undefined}
          aria-label="Ver sitio"
          className={`flex min-h-10 items-center rounded-lg text-sm text-white/55 transition hover:bg-white/5 hover:text-white ${
            compacto
              ? 'justify-center'
              : 'gap-3 px-3'
          }`}
        >
          <FaExternalLinkAlt
            aria-hidden="true"
            className="shrink-0 text-sm"
          />

          {!compacto && <span>Ver sitio</span>}
        </a>

        <button
          type="button"
          onClick={salir}
          disabled={saliendo}
          title={compacto ? 'Cerrar sesión' : undefined}
          aria-label="Cerrar sesión"
          className={`flex min-h-10 w-full items-center rounded-lg text-sm text-white/55 transition hover:bg-white/5 hover:text-sky-primary disabled:opacity-50 ${
            compacto
              ? 'justify-center'
              : 'gap-3 px-3'
          }`}
        >
          <FaSignOutAlt
            aria-hidden="true"
            className="shrink-0 text-sm"
          />

          {!compacto && (
            <span>
              {saliendo ? 'Saliendo...' : 'Cerrar sesión'}
            </span>
          )}
        </button>
      </div>
    </div>
  )
}

export default function AdminLayout() {
  const [compacto, setCompacto] = useState(() => {
    try {
      return localStorage.getItem('sky-admin-menu') === 'compacto'
    } catch {
      return false
    }
  })

  const [menuMovil, setMenuMovil] = useState(false)
  const [saliendo, setSaliendo] = useState(false)

  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    setMenuMovil(false)
  }, [location.pathname])

  useEffect(() => {
    if (!menuMovil) return

    function alPresionarTecla(evento) {
      if (evento.key === 'Escape') {
        setMenuMovil(false)
      }
    }

    const overflowAnterior = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    window.addEventListener('keydown', alPresionarTecla)

    return () => {
      document.body.style.overflow = overflowAnterior
      window.removeEventListener('keydown', alPresionarTecla)
    }
  }, [menuMovil])

  function alternarMenu() {
    setCompacto((actual) => {
      const siguiente = !actual

      try {
        localStorage.setItem(
          'sky-admin-menu',
          siguiente ? 'compacto' : 'expandido'
        )
      } catch {
        // El menú sigue funcionando sin almacenamiento.
      }

      return siguiente
    })
  }

  async function cerrarSesion() {
    if (saliendo) return

    setSaliendo(true)

    try {
      const { error } = await supabase.auth.signOut()

      if (error) throw error

      navigate('/login', { replace: true })
    } catch (error) {
      toast.error(error.message || 'No se pudo cerrar sesión')
    } finally {
      setSaliendo(false)
    }
  }

  return (
    <div className="min-h-screen bg-sky-background text-white">
      {/* SIDEBAR ESCRITORIO */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden border-r border-white/10 bg-[#202020] transition-[width] duration-200 lg:block ${
          compacto ? 'w-[72px]' : 'w-56'
        }`}
      >
        <Menu
          compacto={compacto}
          salir={cerrarSesion}
          saliendo={saliendo}
        />

        {/* BOTÓN SIEMPRE EN EL MISMO LUGAR DEL BORDE */}
        <button
          type="button"
          onClick={alternarMenu}
          aria-label={
            compacto ? 'Expandir menú' : 'Contraer menú'
          }
          aria-expanded={!compacto}
          title={
            compacto ? 'Expandir menú' : 'Contraer menú'
          }
          className="absolute -right-3 top-5 z-10 grid h-7 w-7 place-items-center rounded-full border border-white/15 bg-[#303030] text-white/65 shadow-lg transition-colors hover:border-sky-primary hover:text-white"
        >
          {compacto ? (
            <FaChevronRight size={10} />
          ) : (
            <FaChevronLeft size={10} />
          )}
        </button>
      </aside>

      {/* BARRA MÓVIL */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-white/10 bg-[#202020] px-4 lg:hidden">
        <span className="font-heading text-lg font-bold">
          SKY<span className="text-sky-primary">BURGER</span>
        </span>

        <button
          type="button"
          onClick={() => setMenuMovil(true)}
          aria-label="Abrir menú"
          aria-expanded={menuMovil}
          className="grid h-10 w-10 place-items-center rounded-lg text-white/75 hover:bg-white/10"
        >
          <FaBars aria-hidden="true" />
        </button>
      </header>

      {/* MENÚ MÓVIL */}
      {menuMovil && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            onClick={() => setMenuMovil(false)}
            aria-label="Cerrar menú"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <aside className="absolute inset-y-0 left-0 w-[min(82vw,260px)] bg-[#202020] shadow-2xl">
            <Menu
              salir={cerrarSesion}
              saliendo={saliendo}
              cerrar={() => setMenuMovil(false)}
            />

            <button
              type="button"
              onClick={() => setMenuMovil(false)}
              aria-label="Cerrar navegación"
              className="absolute right-2 top-3 grid h-10 w-10 place-items-center rounded-lg text-white/60 hover:bg-white/10"
            >
              <FaTimes aria-hidden="true" />
            </button>
          </aside>
        </div>
      )}

      {/* VISTAS */}
      <main
        className={`min-w-0 transition-[margin] duration-200 ${
          compacto ? 'lg:ml-[72px]' : 'lg:ml-56'
        }`}
      >
        <div className="mx-auto w-full max-w-[1500px] min-w-0 px-4 py-5 sm:px-6 lg:px-7">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
