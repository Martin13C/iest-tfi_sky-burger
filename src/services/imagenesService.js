
import { supabase } from '../config/supabaseClient'

const BUCKET = 'catalogo'
const TAMANO_MAXIMO = 5 * 1024 * 1024

const TIPOS = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/avif': 'avif',
}

const CARPETAS = [
  'hamburguesas',
  'promociones',
  'galeria',
]

export function validarImagen(archivo) {
  if (!archivo) return

  if (!Object.hasOwn(TIPOS, archivo.type)) {
    throw new Error(
      'Formato no permitido. Usá JPG, PNG, WebP o AVIF.'
    )
  }

  if (archivo.size > TAMANO_MAXIMO) {
    throw new Error(
      'La imagen no puede superar los 5 MB.'
    )
  }

  if (archivo.size === 0) {
    throw new Error('La imagen está vacía.')
  }
}

export async function subirImagen(archivo, carpeta) {
  validarImagen(archivo)

  if (!CARPETAS.includes(carpeta)) {
    throw new Error('Carpeta de imágenes no permitida.')
  }

  const extension = TIPOS[archivo.type]

  const ruta = `${carpeta}/${crypto.randomUUID()}.${extension}`

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(ruta, archivo, {
      contentType: archivo.type,
      cacheControl: '3600',
      upsert: false,
    })

  if (error) throw error

  return ruta
}

export async function eliminarImagen(ruta, carpeta) {
  if (!ruta) return

  if (!CARPETAS.includes(carpeta)) {
    throw new Error('Carpeta no permitida.')
  }

  if (
    typeof ruta !== 'string' ||
    !ruta.startsWith(`${carpeta}/`) ||
    ruta.includes('..')
  ) {
    throw new Error('Ruta de imagen inválida.')
  }

  const { error } = await supabase.storage
    .from(BUCKET)
    .remove([ruta])

  if (error) throw error
}
