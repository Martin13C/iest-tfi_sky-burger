
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'

import {
  obtenerConfiguracionPrivada,
  guardarDatosComerciales,
  guardarHorarios,
  modificarOperacion,
  modificarPublicacion,
  obtenerEstadoPublicoLocal,
  obtenerPublicacion,
} from '../services/configuracionAdminService'

export function useGestionConfiguracion() {
  const queryClient = useQueryClient()

  const configuracion = useQuery({
    queryKey: ['dashboard', 'configuracion'],
    queryFn: obtenerConfiguracionPrivada,
  })

  const estadoLocal = useQuery({
    queryKey: ['dashboard', 'estado-local'],
    queryFn: obtenerEstadoPublicoLocal,
    refetchInterval: 30_000,
  })

  const publicacion = useQuery({
    queryKey: ['dashboard', 'publicacion'],
    queryFn: obtenerPublicacion,
    refetchInterval: 30_000,
  })

  async function refrescarTodo() {
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: ['dashboard', 'configuracion'],
      }),
      queryClient.invalidateQueries({
        queryKey: ['dashboard', 'estado-local'],
      }),
      queryClient.invalidateQueries({
        queryKey: ['dashboard', 'publicacion'],
      }),
      queryClient.invalidateQueries({
        queryKey: ['publico'],
      }),
    ])
  }

  const guardarDatos = useMutation({
    mutationFn: guardarDatosComerciales,
    onSuccess: refrescarTodo,
  })

  const guardarAgenda = useMutation({
    mutationFn: guardarHorarios,
    onSuccess: refrescarTodo,
  })

  const guardarOperacion = useMutation({
    mutationFn: modificarOperacion,
    onSuccess: refrescarTodo,
  })

  const cambiarPublicacion = useMutation({
    mutationFn: modificarPublicacion,
    onSuccess: refrescarTodo,
  })

  return {
    configuracion,
    estadoLocal,
    publicacion,
    guardarDatos,
    guardarAgenda,
    guardarOperacion,
    cambiarPublicacion,
  }
}
