export function precioARS(valor) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 2,
  }).format(Number(valor) || 0)
}

export function numeroWhatsApp(valor) {
  if (!valor) return ''

  return String(valor).replace(/\D/g, '')
}

export function enlaceWhatsApp(numero, mensaje) {
  const telefono = numeroWhatsApp(numero)

  if (!telefono) return null

  return (
    `https://wa.me/${telefono}?text=` +
    encodeURIComponent(mensaje)
  )
}