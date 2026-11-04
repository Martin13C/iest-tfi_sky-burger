
import { supabase } from '../config/supabaseClient'

async function ejecutarRPC(nombre, parametros) {
  const { data, error } = await supabase.rpc(
    nombre,
    parametros
  )

  if (error) throw error

  if (data?.ok === false) {
    throw new Error(
      data.mensaje || data.error ||
      'La operación fue rechazada'
    )
  }

  return data
}

export async function obtenerConfiguracionPrivada() {
  const data = await ejecutarRPC('configuracion_privada')

  // Admite tanto un objeto directo como un objeto
  // que contenga la propiedad "configuracion".
  const configuracion = data?.configuracion ?? data

  if (
    !configuracion ||
    typeof configuracion !== 'object' ||
    Array.isArray(configuracion)
  ) {
    throw new Error(
      'No se pudo interpretar la configuración del negocio'
    )
  }

  return configuracion
}

export async function guardarDatosComerciales(datos) {
  return ejecutarRPC('actualizar_datos_comerciales', {
    p_datos: datos,
  })
}

export async function guardarHorarios(horarios) {
  return guardarDatosComerciales({ horarios })
}

export async function modificarOperacion({
  pedidos_habilitados,
  cierre_manual,
}) {
  return ejecutarRPC('actualizar_operacion_local', {
    p_pedidos_habilitados: pedidos_habilitados,
    p_cierre_manual: cierre_manual,
  })
}

export async function modificarPublicacion(publicado) {
  return ejecutarRPC('cambiar_publicacion', {
    p_publicado: publicado,
  })
}

export async function obtenerEstadoPublicoLocal() {
  return ejecutarRPC('estado_local_publico')
}

export async function obtenerPublicacion() {
  return ejecutarRPC('estado_publicacion')
}
