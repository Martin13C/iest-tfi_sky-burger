
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from 'react-router-dom'

import { useAuth } from '../context/AuthContext'
import { usePublicacion } from '../hooks/useCatalogo'

import PublicLayout from '../layouts/PublicLayout'
import AdminLayout from '../layouts/AdminLayout'
import DuenoLayout from '../layouts/DuenoLayout'

import PantallaCarga from '../components/ui/PantallaCarga'
import PanelSeccion from '../components/ui/PanelSeccion'
import NotFound from '../pages/NotFound'

import Inicio from '../pages/public/Inicio'
import Hamburguesas from '../pages/public/Hamburguesas'
import Promociones from '../pages/public/Promociones'
import Galeria from '../pages/public/Galeria'
import Nosotros from '../pages/public/Nosotros'
import Contacto from '../pages/public/Contacto'

import DashboardAdmin from '../pages/admin/DashboardAdmin'
import DashboardDueno from '../pages/dueno/DashboardDueno'
import Login from '../pages/auth/Login'

import GestionHamburguesas from '../pages/dashboard/GestionHamburguesas'
import GestionPromociones from '../pages/dashboard/GestionPromociones'
import GestionGaleria from '../pages/dashboard/GestionGaleria'
import GestionConfiguracion from '../pages/dashboard/GestionConfiguracion'

import GestionDueno from '../pages/admin/GestionDueno'
import GestionEstadisticas from '../pages/admin/GestionEstadisticas'

function ProtegerPublico() {
  const {
    data,
    isPending,
    isError,
    error,
  } = usePublicacion()

  if (isPending) {
    return <PantallaCarga />
  }

  if (isError) {
    return (
      <PantallaCarga
        mensaje={`Error al verificar el sitio: ${error.message}`}
      />
    )
  }

  if (!data) {
    return (
      <main className="grid min-h-screen place-items-center bg-sky-background px-6 text-center text-white">
        <div>
          <h1 className="font-heading text-4xl font-black text-sky-primary">
            SKY BURGER
          </h1>

          <p className="mt-4 text-white/70">
            El sitio está temporalmente suspendido.
          </p>
        </div>
      </main>
    )
  }

  return <Outlet />
}

function ProtegerRol({ rol }) {
  const {
    usuario,
    perfil,
    cargando,
    error,
  } = useAuth()

  if (cargando) {
    return <PantallaCarga />
  }

  if (!usuario || !perfil) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          motivo: error || 'Iniciá sesión para continuar',
        }}
      />
    )
  }

  if (perfil.bloqueado) {
    return (
      <PantallaCarga
        mensaje="Esta cuenta se encuentra bloqueada."
      />
    )
  }

  if (perfil.rol !== rol) {
    return (
      <Navigate
        to={
          perfil.rol === 'administrador'
            ? '/admin'
            : '/dueno'
        }
        replace
      />
    )
  }

  return <Outlet />
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* SITIO PÚBLICO */}
        <Route element={<ProtegerPublico />}>
          <Route element={<PublicLayout />}>
            <Route index element={<Inicio />} />

            <Route
              path="hamburguesas"
              element={<Hamburguesas />}
            />

            <Route
              path="promociones"
              element={<Promociones />}
            />

            <Route
              path="galeria"
              element={<Galeria />}
            />

            <Route
              path="nosotros"
              element={<Nosotros />}
            />

            <Route
              path="contacto"
              element={<Contacto />}
            />
          </Route>

          <Route
            path="arma-tu-hamburguesa"
            element={
              <Navigate
                to="/hamburguesas#arma-la-tuya"
                replace
              />
            }
          />
        </Route>

        {/* ADMINISTRADOR */}
        <Route element={<ProtegerRol rol="administrador" />}>
          <Route
            path="/admin"
            element={<AdminLayout />}
          >
            <Route
              index
              element={<DashboardAdmin />}
            />

            <Route
              path="hamburguesas"
              element={<GestionHamburguesas />}
            />

            <Route
              path="promociones"
              element={<GestionPromociones />}
            />

            <Route
              path="galeria"
              element={<GestionGaleria />}
            />

            <Route
              path="configuracion"
              element={<GestionConfiguracion />}
            />

            <Route
              path="dueno"
              element={<GestionDueno />}
            />

            <Route
              path="estadisticas"
              element={<GestionEstadisticas />}
            />
          </Route>

          {/* 404 SIN LAYOUT */}
          <Route
            path="/admin/*"
            element={<NotFound dentroDelPanel />}
          />
        </Route>

        {/* DUEÑO */}
        <Route element={<ProtegerRol rol="dueno" />}>
          <Route
            path="/dueno"
            element={<DuenoLayout />}
          >
            <Route
              index
              element={<DashboardDueno />}
            />

            <Route
              path="hamburguesas"
              element={<GestionHamburguesas />}
            />

            <Route
              path="promociones"
              element={<GestionPromociones />}
            />

            <Route
              path="galeria"
              element={<GestionGaleria />}
            />

            <Route
              path="configuracion"
              element={<GestionConfiguracion />}
            />

            <Route
              path="estadisticas"
              element={
                <PanelSeccion
                  titulo="Estadísticas"
                  descripcion="Las métricas administrativas están disponibles desde la cuenta del administrador."
                />
              }
            />
          </Route>

          {/* 404 SIN LAYOUT */}
          <Route
            path="/dueno/*"
            element={<NotFound dentroDelPanel />}
          />
        </Route>

        {/* 404 GENERAL */}
        <Route
          path="*"
          element={<NotFound />}
        />
      </Routes>
    </BrowserRouter>
  )
}
