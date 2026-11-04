import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

if (!url || !key) {
  throw new Error(
    'Faltan VITE_SUPABASE_URL y VITE_SUPABASE_PUBLISHABLE_KEY'
  )
}

export const supabase = createClient(url, key, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

export function obtenerUrlImagen(ruta) {
  if (!ruta) return null

  return supabase.storage
    .from('catalogo')
    .getPublicUrl(ruta).data.publicUrl
}