
import { supabase } from '../config/supabaseClient'
import {
  subirImagen,
  eliminarImagen,
} from './imagenesService'

const CONFIG = {
  promociones: {
    tabla: 'promociones',
    carpeta: 'promociones',
    columnas: [
      'id', 'titulo', 'descripcion', 'precio',
      'moneda', 'imagen_ruta', 'activa',
      'disponible', 'inicio', 'fin', 'orden',
      'creado_en', 'actualizado_en',
    ].join(','),
  },
  galeria: {
    tabla: 'galeria',
    carpeta: 'galeria',
    columnas: [
      'id', 'titulo', 'descripcion', 'imagen_ruta',
      'activo', 'orden', 'creado_en', 'actualizado_en',
    ].join(','),
  },
}

function obtenerConfig(tipo) {
  const config = CONFIG[tipo]
  if (!config) throw new Error('Tipo de contenido inválido')
  return config
}

function prepararDatos(tipo, datos) {
  if (tipo === 'promociones') {
    return {
      titulo: datos.titulo.trim(),
      descripcion: datos.descripcion.trim(),
      precio: datos.precio,
      moneda: 'ARS',
      activa: datos.activa,
      disponible: datos.disponible,
      inicio: datos.inicio
        ? new Date(datos.inicio).toISOString()
        : null,
      fin: datos.fin
        ? new Date(datos.fin).toISOString()
        : null,
      orden: datos.orden,
    }
  }

  return {
    titulo: datos.titulo.trim(),
    descripcion: datos.descripcion.trim(),
    activo: datos.activo,
    orden: datos.orden,
  }
}

export async function listarContenido(tipo) {
  const config = obtenerConfig(tipo)

  const { data, error } = await supabase
    .from(config.tabla)
    .select(config.columnas)
    .order('orden', { ascending: true })
    .order('creado_en', { ascending: false })

  if (error) throw error
  return data ?? []
}

export async function guardarContenido({
  tipo,
  id,
  datos,
  imagen,
  imagenAnterior,
}) {
  const config = obtenerConfig(tipo)

  if (tipo === 'galeria' && !id && !imagen) {
    throw new Error('Seleccioná una imagen para la galería')
  }

  const payload = prepararDatos(tipo, datos)
  let imagenNueva = null

  if (imagen) {
    imagenNueva = await subirImagen(
      imagen,
      config.carpeta
    )
    payload.imagen_ruta = imagenNueva
  }

  try {
    let consulta

    if (id) {
      consulta = supabase
        .from(config.tabla)
        .update(payload)
        .eq('id', id)
    } else {
      consulta = supabase
        .from(config.tabla)
        .insert(payload)
    }

    const { data, error } = await consulta
      .select('id')
      .single()

    if (error) throw error
    if (!data) throw new Error('No se guardó el registro')
  } catch (error) {
    if (imagenNueva) {
      try {
        await eliminarImagen(
          imagenNueva,
          config.carpeta
        )
      } catch (limpiezaError) {
        console.warn(
          'No se pudo limpiar la imagen nueva:',
          limpiezaError
        )
      }
    }
    throw error
  }

  let advertencia = null

  if (
    imagenNueva &&
    imagenAnterior &&
    imagenNueva !== imagenAnterior
  ) {
    try {
      await eliminarImagen(
        imagenAnterior,
        config.carpeta
      )
    } catch (error) {
      advertencia =
        'Se guardaron los cambios, pero no se pudo borrar la imagen anterior.'
      console.warn(advertencia, error)
    }
  }

  return { ok: true, advertencia }
}

export async function eliminarContenido({
  tipo,
  registro,
}) {
  const config = obtenerConfig(tipo)

  const { data, error } = await supabase
    .from(config.tabla)
    .delete()
    .eq('id', registro.id)
    .select('id')
    .single()

  if (error) throw error
  if (!data) {
    throw new Error('No se pudo eliminar el registro')
  }

  let advertencia = null

  if (registro.imagen_ruta) {
    try {
      await eliminarImagen(
        registro.imagen_ruta,
        config.carpeta
      )
    } catch (error) {
      advertencia =
        'Se eliminó el registro, pero no se pudo borrar su imagen.'
      console.warn(advertencia, error)
    }
  }

  return { ok: true, advertencia }
}
