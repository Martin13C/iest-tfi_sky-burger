
export default function PantallaCarga({
  mensaje = 'Cargando Sky Burger...',
}) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[60vh] flex-col items-center justify-center gap-5 px-5 py-12 text-center"
    >
      <div className="relative flex h-14 w-14 items-center justify-center">
        <div className="absolute inset-0 animate-spin rounded-full border-[3px] border-white/10 border-t-sky-primary motion-reduce:animate-none" />
        <span className="font-heading text-lg font-bold text-sky-primary">
          S
        </span>
      </div>

      <p className="max-w-md text-sm text-white/55">
        {mensaje}
      </p>

      <span className="sr-only">Procesando solicitud</span>
    </div>
  )
}
