
import { supabase } from '../config/supabaseClient'

import {
  subirImagen,
  eliminarImagen,
} from './imagenesService'

const TABLA = 'hamburguesas'
const CARPETA = 'hamburguesas'

const COLUMNAS = [
  'id',
  'nombre',
  'slug',
  'descripcion',
  'categoria',
  'precio',
  'moneda',
  'imagen_ruta',
  'activo',
  'disponible',
  'destacado',
  'orden',
  'creado_en',
  'actualizado_en',
].join(',')

function comprobar(error) {
  if (error) throw error
}

function mensajeError(error) {
  if (error?.code === '23505') {
    return new Error(
      'Ese slug ya está utilizado. Elegí otro.'
    )
  }

  return error
}

function prepararDatos(datos) {
  return {
    nombre: datos.nombre.trim(),
    slug: datos.slug.trim().toLowerCase(),
    descripcion: datos.descripcion.trim(),
    categoria: datos.categoria.trim(),
    precio: datos.precio,
    moneda: 'ARS',
    activo: datos.activo,
    disponible: datos.disponible,
    destacado: datos.destacado,
    orden: datos.orden,
  }
}

export async function listarHamburguesasAdmin() {
  const { data, error } = await supabase
    .from(TABLA)
    .select(COLUMNAS)
    .order('orden', { ascending: true })
    .order('creado_en', { ascending: false })

  comprobar(error)

  return data ?? []
}

export async function guardarHamburguesa({
  id,
  datos,
  imagen,
  imagenAnterior,
}) {
  const payload = prepararDatos(datos)

  let imagenNueva = null

  if (imagen) {
    imagenNueva = await subirImagen(imagen, CARPETA)
    payload.imagen_ruta = imagenNueva
  }

  try {
    if (id) {
      // Verificar la existencia evita informar éxito
      // si la operación no modificó ninguna fila.
      const { data, error } = await supabase
        .from(TABLA)
        .update(payload)
        .eq('id', id)
        .select('id')
        .single()

      comprobar(error)

      if (!data) {
        throw new Error(
          'No se pudo actualizar la hamburguesa.'
        )
      }
    } else {
      const { data, error } = await supabase
        .from(TABLA)
        .insert(payload)
        .select('id')
        .single()

      comprobar(error)

      if (!data) {
        throw new Error(
          'No se pudo crear la hamburguesa.'
        )
      }
    }
  } catch (error) {
    if (imagenNueva) {
      try {
        await eliminarImagen(imagenNueva, CARPETA)
      } catch (limpiezaError) {
        console.warn(
          'No se pudo limpiar la imagen nueva:',
          limpiezaError
        )
      }
    }

    throw mensajeError(error)
  }

  let advertencia = null

  if (
    imagenNueva &&
    imagenAnterior &&
    imagenAnterior !== imagenNueva
  ) {
    try {
      await eliminarImagen(imagenAnterior, CARPETA)
    } catch (error) {
      advertencia =
        'Se guardó la hamburguesa, pero no se pudo eliminar la imagen anterior.'

      console.warn(advertencia, error)
    }
  }

  return { ok: true, advertencia }
}

export async function borrarHamburguesa(producto) {
  const { data, error } = await supabase
    .from(TABLA)
    .delete()
    .eq('id', producto.id)
    .select('id')
    .single()

  comprobar(error)

  if (!data) {
    throw new Error('No se pudo eliminar la hamburguesa.')
  }

  let advertencia = null

  if (producto.imagen_ruta) {
    try {
      await eliminarImagen(producto.imagen_ruta, CARPETA)
    } catch (error) {
      advertencia =
        'La hamburguesa fue eliminada, pero no se pudo borrar su imagen.'

      console.warn(advertencia, error)
    }
  }

  return { ok: true, advertencia }
}
