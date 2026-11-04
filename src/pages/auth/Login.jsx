
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'react-toastify'
import {
  FaEye,
  FaEyeSlash,
  FaLock,
  FaArrowRight,
  FaClock,
} from 'react-icons/fa'

import { useAuth } from '../../context/AuthContext'
import useLoginCooldown from '../../hooks/useLoginCooldown'

const esquema = z.object({
  email: z.email('Ingresá un correo válido.'),
  password: z.string().min(1, 'Ingresá la contraseña.'),
})

export default function Login() {
  const [mostrarPassword, setMostrarPassword] = useState(false)

  const { iniciarSesion, perfil, cargando } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(esquema),
    defaultValues: { email: '', password: '' },
  })

  const email = watch('email')

  const {
    intentos,
    restantes,
    bloqueadoTemporalmente,
    registrarError,
    reiniciar,
    puedeIntentar,
    maxIntentos,
  } = useLoginCooldown(email)

  useEffect(() => {
    if (cargando || !perfil || perfil.bloqueado) return

    if (perfil.rol === 'administrador') {
      navigate('/admin', { replace: true })
    } else if (perfil.rol === 'dueno') {
      navigate('/dueno', { replace: true })
    }
  }, [perfil, cargando, navigate])

  async function enviar(datos) {
    if (!puedeIntentar(datos.email)) {
      toast.info('Esperá a que termine la cuenta regresiva.')
      return
    }

    try {
      const perfilActual = await iniciarSesion(
        datos.email,
        datos.password
      )

      reiniciar(datos.email)

      if (perfilActual.bloqueado) {
        toast.error('La cuenta se encuentra bloqueada.')
        return
      }

      if (perfilActual.rol === 'administrador') {
        navigate('/admin', { replace: true })
      } else if (perfilActual.rol === 'dueno') {
        navigate('/dueno', { replace: true })
      } else {
        toast.error('La cuenta no tiene un rol autorizado.')
      }
    } catch (error) {
      // Contamos únicamente errores de credenciales.
      // No penalizamos fallos de red o lectura del perfil.
      const codigo = String(error?.code || '')
      const mensaje = String(error?.message || '')

      const credencialesInvalidas =
        codigo === 'invalid_credentials' ||
        /invalid login credentials/i.test(mensaje)

      if (credencialesInvalidas) {
        const resultado = registrarError(datos.email)

        if (resultado.intentos >= maxIntentos) {
          toast.warning('Tres intentos fallidos. Esperá 30 segundos.')
        } else {
          toast.error('Correo o contraseña incorrectos.')
        }
      } else {
        toast.error(mensaje || 'No se pudo iniciar sesión.')
      }
    }
  }

  const deshabilitado =
    isSubmitting ||
    cargando ||
    bloqueadoTemporalmente

  const campo =
    'h-10 w-full rounded-lg border border-white/10 ' +
    'bg-[#1d1d1d] px-3 text-sm text-white outline-none ' +
    'placeholder:text-white/25 focus:border-sky-primary'

  return (
    <main className="flex min-h-screen items-center justify-center bg-sky-background px-4 py-8 text-white">
      <div className="w-full max-w-[360px] rounded-2xl border border-white/10 bg-sky-surface p-6 shadow-2xl">
        <header className="mb-6 text-center">
          <div className="mx-auto grid h-11 w-11 place-items-center rounded-xl bg-sky-primary/10 text-sky-primary">
            <FaLock aria-hidden="true" size={17} />
          </div>

          <h1 className="mt-4 font-heading text-2xl font-bold">
            SKY<span className="text-sky-primary">BURGER</span>
          </h1>

          <p className="mt-1 text-xs text-white/45">
            Acceso al panel
          </p>
        </header>

        <form
          onSubmit={handleSubmit(enviar)}
          className="space-y-3"
        >
          <div>
            <label
              htmlFor="login-email"
              className="mb-1 block text-xs font-semibold text-white/65"
            >
              Correo electrónico
            </label>

            <input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="correo@ejemplo.com"
              {...register('email')}
              aria-invalid={Boolean(errors.email)}
              className={campo}
            />

            {errors.email && (
              <p role="alert" className="mt-1 text-xs text-sky-primary">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="mb-1 block text-xs font-semibold text-white/65"
            >
              Contraseña
            </label>

            <div className="relative">
              <input
                id="login-password"
                type={mostrarPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Tu contraseña"
                {...register('password')}
                aria-invalid={Boolean(errors.password)}
                className={`${campo} pr-11`}
              />

              <button
                type="button"
                onClick={() => setMostrarPassword((v) => !v)}
                aria-label={
                  mostrarPassword
                    ? 'Ocultar contraseña'
                    : 'Mostrar contraseña'
                }
                className="absolute inset-y-0 right-0 grid w-10 place-items-center text-white/45 hover:text-white"
              >
                {mostrarPassword
                  ? <FaEyeSlash size={14} />
                  : <FaEye size={14} />}
              </button>
            </div>

            {errors.password && (
              <p role="alert" className="mt-1 text-xs text-sky-primary">
                {errors.password.message}
              </p>
            )}
          </div>

          {bloqueadoTemporalmente ? (
            <div
              role="status"
              className="flex items-center gap-2 rounded-lg border border-sky-primary/25 bg-sky-primary/10 p-3 text-xs text-white/75"
            >
              <FaClock
                aria-hidden="true"
                className="shrink-0 text-sky-primary"
              />
              Podés volver a intentar en{' '}
              <strong className="text-sky-primary">
                {restantes} s
              </strong>
            </div>
          ) : intentos > 0 ? (
            <p className="text-[11px] text-white/40">
              {intentos} de {maxIntentos} intentos fallidos.
            </p>
          ) : null}

          <button
            type="submit"
            disabled={deshabilitado}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-sky-primary text-sm font-bold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-45"
          >
            {isSubmitting
              ? 'Ingresando...'
              : bloqueadoTemporalmente
                ? `Esperá ${restantes} s`
                : 'Ingresar'}

            {!deshabilitado && (
              <FaArrowRight aria-hidden="true" size={12} />
            )}
          </button>
        </form>

        <div className="mt-5 border-t border-white/10 pt-4 text-center">
          <Link
            to="/"
            className="text-xs text-white/45 transition hover:text-sky-primary"
          >
            Volver al sitio
          </Link>
        </div>
      </div>
    </main>
  )
}
