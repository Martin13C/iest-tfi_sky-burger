
import { supabase } from '../config/supabaseClient'

async function invocarFuncion(nombre, body) {
  const { data, error } = await supabase.functions.invoke(
    nombre,
    { body },
  )

  if (error) {
    let mensaje = error.message || 'No se pudo completar la operación'

    try {
      const respuesta = error.context

      if (respuesta instanceof Response) {
        const contenido = await respuesta.clone().text()

        if (contenido) {
          try {
            const json = JSON.parse(contenido)

            mensaje =
              json.error ||
              json.message ||
              json.mensaje ||
              mensaje
          } catch {
            mensaje = contenido
          }
        }
      }
    } catch {
      // Conservar mensaje original.
    }

    throw new Error(mensaje)
  }

  if (data?.error) {
    throw new Error(data.error)
  }

  return data
}

export async function consultarDueno() {
  const resultado = await invocarFuncion('gestionar-dueno', {
    accion: 'ver_dueno',
  })

  return resultado?.dueno ?? null
}

export async function crearDueno({
  nombre,
  email,
  password,
}) {
  return invocarFuncion('crear-dueno', {
    nombre: nombre.trim(),
    email: email.trim().toLowerCase(),
    password,
  })
}

export async function editarNombreDueno(nombre) {
  return invocarFuncion('gestionar-dueno', {
    accion: 'editar_nombre',
    nombre: nombre.trim(),
  })
}

export async function cambiarBloqueoDueno(bloqueado) {
  return invocarFuncion('gestionar-dueno', {
    accion: 'bloquear',
    bloqueado: Boolean(bloqueado),
  })
}

export async function cambiarPasswordDueno(password) {
  return invocarFuncion('gestionar-dueno', {
    accion: 'cambiar_password',
    password,
  })
}

export async function eliminarDueno(id) {
  if (!id) {
    throw new Error('No se identificó la cuenta del dueño')
  }

  return invocarFuncion('gestionar-dueno', {
    accion: 'eliminar_dueno',
    dueno_id: id,
    confirmacion: 'ELIMINAR',
  })
}
