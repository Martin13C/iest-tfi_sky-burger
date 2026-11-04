import { useQuery } from '@tanstack/react-query'

import {
  consultarPublicacion,
  consultarEstadoLocal,
  consultarDatosLocal,
  consultarHamburguesas,
  consultarPromociones,
  consultarGaleria,
  consultarResumenEstadisticas,
} from '../services/catalogoService'

export function usePublicacion() {
  return useQuery({
    queryKey: ['publico', 'publicacion'],
    queryFn: consultarPublicacion,
    refetchInterval: 15_000,
  })
}

export function useEstadoLocal() {
  return useQuery({
    queryKey: ['publico', 'estado-local'],
    queryFn: consultarEstadoLocal,
    refetchInterval: 30_000,
  })
}

export function useDatosLocal() {
  return useQuery({
    queryKey: ['publico', 'datos-local'],
    queryFn: consultarDatosLocal,
  })
}

export function useHamburguesas() {
  return useQuery({
    queryKey: ['publico', 'hamburguesas'],
    queryFn: consultarHamburguesas,
  })
}

export function usePromociones() {
  return useQuery({
    queryKey: ['publico', 'promociones'],
    queryFn: consultarPromociones,
  })
}

export function useGaleria() {
  return useQuery({
    queryKey: ['publico', 'galeria'],
    queryFn: consultarGaleria,
  })
}

export function useEstadisticas(habilitado = true) {
  return useQuery({
    queryKey: ['privado', 'estadisticas'],
    queryFn: consultarResumenEstadisticas,
    enabled: habilitado,
  })
}