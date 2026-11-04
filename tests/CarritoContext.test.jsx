import { describe, it, expect } from 'vitest'

describe('Lógica de Carrito de Compras - Totales y Cantidades', () => {
  it('debe calcular correctamente el total acumulado al agregar elementos', () => {
    const carritoInicial = { items: [], total: 0 }

    // Simulación de agregar un producto
    const producto = { id: 1, nombre: 'Mega Burger', precio: 5000, cantidad: 2 }
    const nuevosItems = [...carritoInicial.items, producto]
    const nuevoTotal = nuevosItems.reduce((acc, item) => acc + (item.precio * item.cantidad), 0)

    expect(nuevosItems.length).toBe(1)
    expect(nuevoTotal).toBe(10000)
  })
})
