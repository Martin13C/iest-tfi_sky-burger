
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'

import { supabase } from '../config/supabaseClient'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [perfil, setPerfil] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  const solicitudActual = useRef(0)
  const usuarioActualId = useRef(null)
  const sesionVerificada = useRef(false)

  const cargarSesion = useCallback(async (
    sesion,
    { forzarCarga = false } = {},
  ) => {
    const solicitud = ++solicitudActual.current

    const idEntrante = sesion?.user?.id ?? null

    // Mostrar la pantalla de carga solo cuando sea
    // necesario: primera visita o cambio de cuenta.
    const cambiarUsuario =
      usuarioActualId.current !== idEntrante

    const mostrarCarga =
      forzarCarga ||
      !sesionVerificada.current ||
      cambiarUsuario

    if (mostrarCarga) {
      setCargando(true)
    }

    setError(null)

    if (!sesion) {
      usuarioActualId.current = null
      sesionVerificada.current = true

      setUsuario(null)
      setPerfil(null)
      setCargando(false)

      return null
    }

    // Si cambia la cuenta, no conservar los datos
    // del usuario anterior durante la verificación.
    if (cambiarUsuario) {
      setUsuario(null)
      setPerfil(null)
    }

    try {
      const { data: authData, error: authError } =
        await supabase.auth.getUser()

      if (authError) throw authError

      if (!authData.user) {
        throw new Error('Sesión inválida')
      }

      // Evitar que una consulta antigua sobrescriba
      // la sesión de otra cuenta.
      if (authData.user.id !== idEntrante) {
        return null
      }

      const { data, error: perfilError } =
        await supabase.rpc('mi_perfil')

      if (perfilError) throw perfilError

      if (solicitud !== solicitudActual.current) {
        return null
      }

      if (!data) {
        throw new Error('No se encontró el perfil autorizado')
      }

      usuarioActualId.current = authData.user.id
      sesionVerificada.current = true

      setUsuario(authData.user)
      setPerfil(data)

      return data
    } catch (err) {
      if (solicitud === solicitudActual.current) {
        setError(err.message)

        // Ante un fallo de verificación, no debemos
        // conservar permisos que no pudimos validar.
        usuarioActualId.current = null
        sesionVerificada.current = true
        setUsuario(null)
        setPerfil(null)
      }

      return null
    } finally {
      if (solicitud === solicitudActual.current) {
        sesionVerificada.current = true
        setCargando(false)
      }
    }
  }, [])

  useEffect(() => {
    let activo = true

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (evento, sesion) => {
        if (
          [
            'INITIAL_SESSION',
            'SIGNED_IN',
            'SIGNED_OUT',
            'USER_UPDATED',
          ].includes(evento)
        ) {
          queueMicrotask(() => {
            if (!activo) return

            // No volver a desmontar el panel cuando
            // se renueva la misma sesión.
            cargarSesion(sesion)
          })
        }
      },
    )

    return () => {
      activo = false
      solicitudActual.current += 1
      subscription.unsubscribe()
    }
  }, [cargarSesion])

  async function iniciarSesion(email, password) {
    const { data, error: loginError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      })

    if (loginError) throw loginError

    const perfilActual = await cargarSesion(
      data.session,
    )

    if (!perfilActual) {
      throw new Error(
        'No se pudo obtener el perfil autorizado. Reintentá.',
      )
    }

    return perfilActual
  }

  async function cerrarSesion() {
    const { error: logoutError } =
      await supabase.auth.signOut()

    if (logoutError) throw logoutError

    await cargarSesion(null)
  }

  async function recargarPerfil() {
    const { data } = await supabase.auth.getSession()

    return cargarSesion(data.session)
  }

  return (
    <AuthContext.Provider
      value={{
        usuario,
        perfil,
        cargando,
        error,
        iniciarSesion,
        cerrarSesion,
        recargarPerfil,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const contexto = useContext(AuthContext)

  if (!contexto) {
    throw new Error('useAuth necesita AuthProvider')
  }

  return contexto
}
