import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

const CarritoContext = createContext(null)
const CLAVE = 'skyburger_carrito_v1'

function leerCarrito() {
  try {
    const guardado = JSON.parse(
      window.localStorage.getItem(CLAVE) || '[]'
    )

    if (!Array.isArray(guardado)) return []

    return guardado.filter(
      (item) =>
        typeof item.id === 'string' &&
        typeof item.nombre === 'string' &&
        ['hamburguesa', 'promocion'].includes(item.tipo) &&
        Number.isInteger(item.cantidad) &&
        item.cantidad > 0
    )
  } catch {
    return []
  }
}

export function CarritoProvider({ children }) {
  const [items, setItems] = useState(leerCarrito)
  const [abierto, setAbierto] = useState(false)

  useEffect(() => {
    localStorage.setItem(CLAVE, JSON.stringify(items))
  }, [items])

  function agregar(producto, tipo = 'hamburguesa') {
    if (
      !producto?.id ||
      !producto?.nombre ||
      !['hamburguesa', 'promocion'].includes(tipo)
    ) {
      return
    }

    setItems((actuales) => {
      const existe = actuales.find(
        (item) => item.id === producto.id && item.tipo === tipo
      )

      if (existe) {
        return actuales.map((item) =>
          item.id === producto.id && item.tipo === tipo
            ? { ...item, cantidad: Math.min(item.cantidad + 1, 99) }
            : item
        )
      }

      return [
        ...actuales,
        {
          id: producto.id,
          nombre: producto.nombre,
          tipo,
          cantidad: 1,
        },
      ]
    })

    setAbierto(true)
  }

  function cambiarCantidad(id, tipo, nuevaCantidad) {
    const cantidad = Number(nuevaCantidad)

    if (!Number.isInteger(cantidad)) return

    setItems((actuales) =>
      actuales
        .map((item) =>
          item.id === id && item.tipo === tipo
            ? { ...item, cantidad: Math.min(cantidad, 99) }
            : item
        )
        .filter((item) => item.cantidad > 0)
    )
  }

  function quitar(id, tipo) {
    setItems((actuales) =>
      actuales.filter(
        (item) => !(item.id === id && item.tipo === tipo)
      )
    )
  }

  function vaciar() {
    setItems([])
  }

  const cantidadTotal = useMemo(
    () => items.reduce((total, item) => total + item.cantidad, 0),
    [items]
  )

  return (
    <CarritoContext.Provider
      value={{
        items,
        abierto,
        setAbierto,
        agregar,
        cambiarCantidad,
        quitar,
        vaciar,
        cantidadTotal,
      }}
    >
      {children}
    </CarritoContext.Provider>
  )
}

export function useCarrito() {
  const contexto = useContext(CarritoContext)

  if (!contexto) {
    throw new Error('useCarrito necesita CarritoProvider')
  }

  return contexto
}