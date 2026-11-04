
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import {
  listarContenido,
  guardarContenido,
  eliminarContenido,
} from '../services/contenidoAdminService'

export function useGestionContenido(tipo) {
  const queryClient = useQueryClient()

  const consulta = useQuery({
    queryKey: ['dashboard', tipo],
    queryFn: () => listarContenido(tipo),
  })

  async function invalidar() {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ['dashboard', tipo],
      }),
      queryClient.invalidateQueries({
        queryKey: ['publico', tipo],
      }),
    ])
  }

  const guardar = useMutation({
    mutationFn: (datos) =>
      guardarContenido({ tipo, ...datos }),
    onSuccess: invalidar,
  })

  const eliminar = useMutation({
    mutationFn: (registro) =>
      eliminarContenido({ tipo, registro }),
    onSuccess: invalidar,
  })

  return {
    registros: consulta.data ?? [],
    cargando: consulta.isPending,
    error: consulta.error,
    recargar: consulta.refetch,
    guardar,
    eliminar,
  }
}
