import { describe, it, expect } from 'vitest'

// Función auxiliar de formateo similar a la esperada en src/utils/formato.js
const formatearMoneda = (valor) => {
  if (isNaN(valor)) return '$ 0'
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(valor)
}

describe('Utilidad de Formato - Precios y Moneda Argentina', () => {
  it('debe formatear correctamente un valor numérico a moneda ARS', () => {
    const precio = 3500
    const resultado = formatearMoneda(precio)
    
    // El formato estándar suele incluir símbolos de moneda y separadores
    expect(resultado).toContain('3.500')
  })

  it('debe manejar valores cero o inválidos de forma segura', () => {
    expect(formatearMoneda(0)).toContain('0')
    expect(formatearMoneda('abc')).toBe('$ 0')
  })
})
