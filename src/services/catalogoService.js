import { supabase } from '../config/supabaseClient'

function comprobar(resultado, descripcion) {
  if (resultado.error) {
    throw new Error(
      `No se pudo cargar ${descripcion}: ${resultado.error.message}`
    )
  }

  return resultado.data
}

export async function consultarPublicacion() {
  const resultado = await supabase.rpc('estado_publicacion')
  return comprobar(resultado, 'el estado del sitio') === true
}

export async function consultarEstadoLocal() {
  return comprobar(
    await supabase.rpc('estado_local_publico'),
    'el estado del local'
  )
}

export async function consultarDatosLocal() {
  return comprobar(
    await supabase.rpc('datos_local_publicos'),
    'los datos del local'
  )
}

export async function consultarHamburguesas() {
  return (
    comprobar(
      await supabase
        .from('hamburguesas')
        .select(
          'id,nombre,slug,descripcion,categoria,precio,moneda,imagen_ruta,activo,disponible,destacado,orden'
        )
        .eq('activo', true)
        .order('orden', { ascending: true }),
      'las hamburguesas'
    ) ?? []
  )
}

export async function consultarPromociones() {
  const ahora = new Date().toISOString()

  return (
    comprobar(
      await supabase
        .from('promociones')
        .select(
          'id,titulo,descripcion,precio,moneda,imagen_ruta,activa,disponible,inicio,fin,orden'
        )
        .eq('activa', true)
        .or(`inicio.is.null,inicio.lte.${ahora}`)
        .or(`fin.is.null,fin.gte.${ahora}`)
        .order('orden', { ascending: true }),
      'las promociones'
    ) ?? []
  )
}

export async function consultarGaleria() {
  return (
    comprobar(
      await supabase
        .from('galeria')
        .select('id,titulo,descripcion,imagen_ruta,orden')
        .eq('activo', true)
        .order('orden', { ascending: true }),
      'la galería'
    ) ?? []
  )
}

export async function consultarResumenEstadisticas() {
  return comprobar(
    await supabase.rpc('resumen_estadisticas'),
    'las estadísticas'
  )
}