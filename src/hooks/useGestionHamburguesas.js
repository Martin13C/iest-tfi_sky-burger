
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import {
  listarHamburguesasAdmin,
  guardarHamburguesa,
  borrarHamburguesa,
} from '../services/hamburguesasAdminService'

export function useGestionHamburguesas() {
  const queryClient = useQueryClient()

  const consulta = useQuery({
    queryKey: ['dashboard', 'hamburguesas'],
    queryFn: listarHamburguesasAdmin,
  })

  async function actualizarConsultas() {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ['dashboard', 'hamburguesas'],
      }),
      queryClient.invalidateQueries({
        queryKey: ['publico', 'hamburguesas'],
      }),
    ])
  }

  const guardar = useMutation({
    mutationFn: guardarHamburguesa,
    onSuccess: actualizarConsultas,
  })

  const eliminar = useMutation({
    mutationFn: borrarHamburguesa,
    onSuccess: actualizarConsultas,
  })

  return {
    hamburguesas: consulta.data ?? [],
    cargando: consulta.isPending,
    error: consulta.error,
    recargar: consulta.refetch,
    guardar,
    eliminar,
  }
}
