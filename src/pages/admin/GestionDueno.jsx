
import { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  FaUserShield,
  FaEdit,
  FaKey,
  FaLock,
  FaUnlock,
  FaTrash,
  FaPlus,
  FaSave,
  FaEye,
  FaEyeSlash,
  FaSyncAlt,
} from 'react-icons/fa'
import { toast } from 'react-toastify'
import Swal from 'sweetalert2'

import {
  consultarDueno,
  crearDueno,
  editarNombreDueno,
  cambiarBloqueoDueno,
  cambiarPasswordDueno,
  eliminarDueno,
} from '../../services/duenoAdminService'

const CLAVE_QUERY = ['admin', 'cuenta-dueno']

const campo =
  'h-9 w-full min-w-0 rounded-lg border border-white/10 ' +
  'bg-[#1d1d1d] px-3 text-xs text-white outline-none ' +
  'focus:border-sky-primary'

const boton =
  'inline-flex h-9 items-center justify-center gap-2 rounded-lg ' +
  'border border-white/10 px-3 text-xs font-semibold ' +
  'text-white/75 transition hover:bg-white/5 disabled:opacity-40'

function CampoPassword({
  valor,
  onChange,
  placeholder,
  autoComplete = 'new-password',
}) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      <input
        type={visible ? 'text' : 'password'}
        value={valor}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required
        minLength={8}
        className={`${campo} pr-10`}
      />

      <button
        type="button"
        onClick={() => setVisible((actual) => !actual)}
        aria-label={visible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
        className="absolute inset-y-0 right-0 grid w-9 place-items-center text-white/40 hover:text-white"
      >
        {visible ? <FaEyeSlash size={12} /> : <FaEye size={12} />}
      </button>
    </div>
  )
}

export default function GestionDueno() {
  const queryClient = useQueryClient()

  const [modo, setModo] = useState(null)
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmacion, setConfirmacion] = useState('')

  const {
    data: dueno,
    isPending,
    isError,
    error,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: CLAVE_QUERY,
    queryFn: consultarDueno,
  })

  useEffect(() => {
    if (dueno && modo !== 'nombre') {
      setNombre(dueno.nombre ?? '')
    }
  }, [dueno, modo])

  const mutacion = useMutation({
    mutationFn: async ({ accion, datos }) => {
      if (accion === 'crear') {
        return crearDueno(datos)
      }

      if (accion === 'nombre') {
        return editarNombreDueno(datos.nombre)
      }

      if (accion === 'password') {
        return cambiarPasswordDueno(datos.password)
      }

      if (accion === 'bloqueo') {
        return cambiarBloqueoDueno(datos.bloqueado)
      }

      if (accion === 'eliminar') {
        return eliminarDueno(datos.id)
      }

      throw new Error('Acción inválida')
    },

    onSuccess: async (resultado, variables) => {
      if (resultado?.advertencia) {
        toast.warning(resultado.advertencia)
      } else {
        toast.success(
          variables.accion === 'eliminar'
            ? 'Cuenta eliminada'
            : 'Cambios guardados',
        )
      }

      setModo(null)
      setPassword('')
      setConfirmacion('')
      setEmail('')

      await queryClient.invalidateQueries({
        queryKey: CLAVE_QUERY,
      })
    },

    onError: (err) => {
      toast.error(err.message || 'No se pudo completar la operación')
    },
  })

  const ocupado = mutacion.isPending

  function cambiarModo(siguiente) {
    if (ocupado) return

    setModo((actual) => actual === siguiente ? null : siguiente)
    setPassword('')
    setConfirmacion('')
    setNombre(dueno?.nombre ?? '')
  }

  function guardarNombre(evento) {
    evento.preventDefault()

    if (nombre.trim().length < 2) {
      toast.error('Ingresá un nombre válido')
      return
    }

    mutacion.mutate({
      accion: 'nombre',
      datos: { nombre },
    })
  }

  function guardarPassword(evento) {
    evento.preventDefault()

    if (password.length < 8) {
      toast.error('Usá al menos 8 caracteres')
      return
    }

    if (password !== confirmacion) {
      toast.error('Las contraseñas no coinciden')
      return
    }

    mutacion.mutate({
      accion: 'password',
      datos: { password },
    })
  }

  function guardarCreacion(evento) {
    evento.preventDefault()

    if (nombre.trim().length < 2) {
      toast.error('Ingresá un nombre válido')
      return
    }

    if (password.length < 8 || password !== confirmacion) {
      toast.error('Revisá las contraseñas')
      return
    }

    mutacion.mutate({
      accion: 'crear',
      datos: { nombre, email, password },
    })
  }

  async function cambiarBloqueo() {
    if (!dueno || ocupado) return

    const bloquear = !dueno.bloqueado

    const respuesta = await Swal.fire({
      title: bloquear ? '¿Bloquear cuenta?' : '¿Desbloquear cuenta?',
      text: bloquear
        ? 'El dueño no podrá iniciar sesión en el panel.'
        : 'El dueño podrá volver a iniciar sesión.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#E63946',
      background: '#252525',
      color: '#fff',
    })

    if (!respuesta.isConfirmed) return

    mutacion.mutate({
      accion: 'bloqueo',
      datos: { bloqueado: bloquear },
    })
  }

  async function confirmarEliminacion() {
    if (!dueno || ocupado) return

    const respuesta = await Swal.fire({
      title: 'Eliminar cuenta del dueño',
      html: `
        <p style="font-size:13px;line-height:1.6;color:#c5c5c5">
          Esta acción elimina la cuenta de acceso y puede afectar
          registros asociados. No se puede deshacer.
        </p>
        <p style="font-size:12px;margin-top:12px;color:#f0b0b4">
          Escribí <strong>ELIMINAR</strong> para confirmar.
        </p>
      `,
      input: 'text',
      inputPlaceholder: 'ELIMINAR',
      inputAttributes: {
        autocomplete: 'off',
        spellcheck: 'false',
      },
      inputValidator: (valor) =>
        valor === 'ELIMINAR'
          ? undefined
          : 'Escribí ELIMINAR exactamente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar definitivamente',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#E63946',
      background: '#252525',
      color: '#fff',
      reverseButtons: true,
      focusCancel: true,
    })

    if (!respuesta.isConfirmed) return

    mutacion.mutate({
      accion: 'eliminar',
      datos: { id: dueno.id },
    })
  }

  return (
    <section className="max-w-3xl space-y-3">
      <header className="flex items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-xl font-bold sm:text-2xl">
            Cuenta del dueño
          </h1>
          <p className="mt-0.5 text-[11px] text-white/40">
            Acceso y seguridad del perfil comercial.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching || ocupado}
          title="Actualizar"
          aria-label="Actualizar cuenta"
          className={boton}
        >
          <FaSyncAlt size={12} />
        </button>
      </header>

      {isPending && (
        <p className="py-5 text-xs text-white/45">
          Cargando cuenta...
        </p>
      )}

      {isError && (
        <div
          role="alert"
          className="rounded-xl border border-sky-primary/30 bg-sky-primary/10 p-3 text-xs"
        >
          <p>{error.message}</p>

          <button
            type="button"
            onClick={() => refetch()}
            className="mt-2 font-semibold text-sky-primary underline"
          >
            Reintentar
          </button>
        </div>
      )}

      {!isPending && !isError && !dueno && (
        <div className="rounded-xl border border-white/10 bg-sky-surface p-4">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-lg bg-sky-primary/10 text-sky-primary">
              <FaUserShield />
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-bold">Sin cuenta asignada</h2>
              <p className="text-[11px] text-white/45">
                Creá el usuario que gestionará el negocio.
              </p>
            </div>

            <button
              type="button"
              onClick={() => cambiarModo('crear')}
              className="inline-flex h-9 items-center gap-2 rounded-lg bg-sky-primary px-3 text-xs font-bold"
            >
              <FaPlus size={11} />
              Crear
            </button>
          </div>

          {modo === 'crear' && (
            <form
              onSubmit={guardarCreacion}
              className="mt-4 grid gap-2 border-t border-white/10 pt-4 sm:grid-cols-2"
            >
              <input
                required
                minLength={2}
                maxLength={120}
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre"
                aria-label="Nombre"
                className={campo}
              />

              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Correo"
                aria-label="Correo"
                className={campo}
              />

              <CampoPassword
                valor={password}
                onChange={setPassword}
                placeholder="Contraseña (mín. 8)"
              />

              <CampoPassword
                valor={confirmacion}
                onChange={setConfirmacion}
                placeholder="Confirmar contraseña"
              />

              <div className="flex justify-end gap-2 sm:col-span-2">
                <button
                  type="button"
                  onClick={() => cambiarModo(null)}
                  disabled={ocupado}
                  className={boton}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={ocupado}
                  className="h-9 rounded-lg bg-sky-primary px-4 text-xs font-bold disabled:opacity-40"
                >
                  {ocupado ? 'Creando...' : 'Crear cuenta'}
                </button>
              </div>
            </form>
          )}
        </div>
      )}

      {!isPending && !isError && dueno && (
        <div className="overflow-hidden rounded-xl border border-white/10 bg-sky-surface">
          {/* INFORMACIÓN PRINCIPAL */}
          <div className="flex flex-wrap items-center gap-3 p-4">
            <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-sky-primary/10 text-sky-primary">
              <FaUserShield size={19} />
            </div>

            <div className="min-w-0 flex-1">
              <h2 className="truncate font-heading text-base font-bold">
                {dueno.nombre || 'Dueño'}
              </h2>

              <p className="text-[11px] text-white/40">
                Cuenta comercial
              </p>
            </div>

            <span
              className={`rounded-md px-2 py-1 text-[10px] font-bold ${
                dueno.bloqueado
                  ? 'bg-sky-primary/10 text-sky-primary'
                  : 'bg-green-500/10 text-green-400'
              }`}
            >
              {dueno.bloqueado ? 'Bloqueada' : 'Habilitada'}
            </span>
          </div>

          {/* ACCIONES */}
          <div className="flex flex-wrap gap-2 border-t border-white/10 px-4 py-3">
            <button
              type="button"
              onClick={() => cambiarModo('nombre')}
              disabled={ocupado}
              className={boton}
            >
              <FaEdit size={11} />
              Editar nombre
            </button>

            <button
              type="button"
              onClick={() => cambiarModo('password')}
              disabled={ocupado}
              className={boton}
            >
              <FaKey size={11} />
              Contraseña
            </button>

            <button
              type="button"
              onClick={cambiarBloqueo}
              disabled={ocupado}
              className={boton}
            >
              {dueno.bloqueado
                ? <FaUnlock size={11} />
                : <FaLock size={11} />}

              {dueno.bloqueado ? 'Desbloquear' : 'Bloquear'}
            </button>
          </div>

          {/* EDITAR NOMBRE */}
          {modo === 'nombre' && (
            <form
              onSubmit={guardarNombre}
              className="flex flex-wrap gap-2 border-t border-white/10 bg-[#202020] p-3"
            >
              <input
                required
                minLength={2}
                maxLength={120}
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                aria-label="Nuevo nombre"
                className={`${campo} flex-1`}
              />

              <button
                type="submit"
                disabled={ocupado}
                className="inline-flex h-9 items-center gap-2 rounded-lg bg-sky-primary px-3 text-xs font-bold disabled:opacity-40"
              >
                <FaSave size={11} />
                Guardar
              </button>

              <button
                type="button"
                onClick={() => cambiarModo(null)}
                disabled={ocupado}
                className={boton}
              >
                Cancelar
              </button>
            </form>
          )}

          {/* CAMBIAR CONTRASEÑA */}
          {modo === 'password' && (
            <form
              onSubmit={guardarPassword}
              className="space-y-3 border-t border-white/10 bg-[#202020] p-3"
            >
              <div className="grid gap-2 sm:grid-cols-2">
                <CampoPassword
                  valor={password}
                  onChange={setPassword}
                  placeholder="Nueva contraseña (mín. 8)"
                />

                <CampoPassword
                  valor={confirmacion}
                  onChange={setConfirmacion}
                  placeholder="Confirmar contraseña"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => cambiarModo(null)}
                  disabled={ocupado}
                  className={boton}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={ocupado}
                  className="inline-flex h-9 items-center gap-2 rounded-lg bg-sky-primary px-3 text-xs font-bold disabled:opacity-40"
                >
                  <FaSave size={11} />
                  {ocupado ? 'Guardando...' : 'Actualizar contraseña'}
                </button>
              </div>
            </form>
          )}

          {/* ZONA DE ELIMINACIÓN */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 px-4 py-3">
            <p className="text-[11px] text-white/40">
              Eliminar la cuenta de acceso del dueño.
            </p>

            <button
              type="button"
              disabled={ocupado}
              onClick={confirmarEliminacion}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-sky-primary/25 px-3 text-xs font-semibold text-sky-primary transition hover:bg-sky-primary/10 disabled:opacity-40"
            >
              <FaTrash size={11} />
              Eliminar cuenta
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
