
import { useQuery } from '@tanstack/react-query'
import { supabase } from '../config/supabaseClient'

async function obtenerEstadisticas() {
  const [
    hamburguesas,
    activas,
    disponibles,
    promociones,
    galeria,
    estado,
  ] = await Promise.all([
    supabase
      .from('hamburguesas')
      .select('id', { count: 'exact', head: true }),

    supabase
      .from('hamburguesas')
      .select('id', { count: 'exact', head: true })
      .eq('activo', true),

    supabase
      .from('hamburguesas')
      .select('id', { count: 'exact', head: true })
      .eq('activo', true)
      .eq('disponible', true),

    supabase
      .from('promociones')
      .select('id', { count: 'exact', head: true }),

    supabase
      .from('galeria')
      .select('id', { count: 'exact', head: true }),

    supabase.rpc('estado_local_publico'),
  ])

  const resultados = [
    hamburguesas,
    activas,
    disponibles,
    promociones,
    galeria,
    estado,
  ]

  for (const resultado of resultados) {
    if (resultado.error) {
      throw resultado.error
    }
  }

  return {
    hamburguesas: {
      total: hamburguesas.count ?? 0,
      publicadas: activas.count ?? 0,
      disponibles: disponibles.count ?? 0,
    },
    promociones: promociones.count ?? 0,
    galeria: galeria.count ?? 0,
    estado: estado.data ?? null,
  }
}

export default function useEstadisticas() {
  return useQuery({
    queryKey: ['admin', 'estadisticas'],
    queryFn: obtenerEstadisticas,
    staleTime: 30_000,
    refetchInterval: 60_000,
  })
}
