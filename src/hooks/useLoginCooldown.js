
import { useEffect, useState } from 'react'

const MAX_INTENTOS = 3
const ESPERA_MS = 30_000
const CLAVE = 'skyburger-login-espera-v1'

function leerEstado() {
  try {
    const guardado = JSON.parse(
      localStorage.getItem(CLAVE) || '{}'
    )

    return guardado &&
      typeof guardado === 'object' &&
      !Array.isArray(guardado)
      ? guardado
      : {}
  } catch {
    return {}
  }
}

function guardarEstado(estado) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(estado))
  } catch {
    // La pausa sigue funcionando durante esta sesión.
  }
}

export default function useLoginCooldown(email) {
  const [registros, setRegistros] = useState(leerEstado)
  const [ahora, setAhora] = useState(Date.now())

  const clave = email.trim().toLowerCase()

  const registro = registros[clave] || {
    intentos: 0,
    hasta: 0,
  }

  const segundosRestantes = Math.max(
    0,
    Math.ceil((registro.hasta - ahora) / 1000)
  )

  const bloqueadoTemporalmente = segundosRestantes > 0

  useEffect(() => {
    if (!bloqueadoTemporalmente) return

    const intervalo = setInterval(() => {
      setAhora(Date.now())
    }, 250)

    return () => clearInterval(intervalo)
  }, [bloqueadoTemporalmente])

  useEffect(() => {
    if (
      registro.hasta > 0 &&
      registro.hasta <= ahora
    ) {
      setRegistros((actual) => {
        const anterior = actual[clave]

        if (
          !anterior ||
          anterior.hasta === 0 ||
          anterior.hasta > Date.now()
        ) {
          return actual
        }

        const siguiente = {
          ...actual,
          [clave]: { intentos: 0, hasta: 0 },
        }

        guardarEstado(siguiente)
        return siguiente
      })
    }
  }, [ahora, clave, registro.hasta])

  function registrarError(correo) {
    const identificador = correo.trim().toLowerCase()
    if (!identificador) return

    const actual = leerEstado()
    const previo = actual[identificador] || {
      intentos: 0,
      hasta: 0,
    }

    const intentos = (
      previo.hasta && previo.hasta <= Date.now()
        ? 0
        : previo.intentos
    ) + 1

    const siguienteRegistro =
      intentos >= MAX_INTENTOS
        ? {
            intentos,
            hasta: Date.now() + ESPERA_MS,
          }
        : {
            intentos,
            hasta: 0,
          }

    const siguiente = {
      ...actual,
      [identificador]: siguienteRegistro,
    }

    guardarEstado(siguiente)
    setRegistros(siguiente)
    setAhora(Date.now())

    return siguienteRegistro
  }

  function reiniciar(correo) {
    const identificador = correo.trim().toLowerCase()
    const actual = leerEstado()

    const siguiente = { ...actual }
    delete siguiente[identificador]

    guardarEstado(siguiente)
    setRegistros(siguiente)
    setAhora(Date.now())
  }

  function puedeIntentar(correo) {
    const identificador = correo.trim().toLowerCase()
    const actual = leerEstado()
    const hasta = actual[identificador]?.hasta || 0

    return hasta <= Date.now()
  }

  return {
    intentos: bloqueadoTemporalmente
      ? MAX_INTENTOS
      : registro.intentos || 0,
    restantes: segundosRestantes,
    bloqueadoTemporalmente,
    registrarError,
    reiniciar,
    puedeIntentar,
    maxIntentos: MAX_INTENTOS,
  }
}
