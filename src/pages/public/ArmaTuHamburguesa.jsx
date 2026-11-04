
import { useMemo, useState } from 'react'
import {
  FaCheck,
  FaWhatsapp,
  FaUndo,
  FaHamburger,
} from 'react-icons/fa'

import { useDatosLocal } from '../../hooks/useCatalogo'
import { enlaceWhatsApp } from '../../utils/formato'

const PANES = [
  'Blanco',
  'Negro',
  'Blanco + Semillas',
  'Negro + Semillas',
]

const EXTRAS = [
  'Huevo',
  'Tomate',
  'Lechuga',
  'Cebolla caramelizada',
  'Cebolla morada',
  'Queso tybo',
  'Queso azul',
  'Cheddar',
  'Bacon',
  'Jamón',
  'Jamón crudo',
  'Rúcula',
  'Mayonesa',
  'Mostaza',
  'Kétchup',
  'Salsa SkyBurger',
  'Aceituna negra',
  'Aceituna verde',
]

const COLORES = {
  Huevo: '#f8e9d2',
  Tomate: '#e63946',
  Lechuga: '#76a859',
  'Cebolla caramelizada': '#aa713e',
  'Cebolla morada': '#98669c',
  'Queso tybo': '#f1d77d',
  'Queso azul': '#c5d3c0',
  Cheddar: '#f4a62d',
  Bacon: '#af5b42',
  Jamón: '#d99b99',
  'Jamón crudo': '#a94d46',
  Rúcula: '#43864d',
  Mayonesa: '#efe4cc',
  Mostaza: '#e6c631',
  Kétchup: '#cf343b',
  'Salsa SkyBurger': '#e58e56',
  'Aceituna negra': '#494044',
  'Aceituna verde': '#87994a',
}

function VistaPrevia({ pan, medallones, extras }) {
  const oscuro = pan.startsWith('Negro')
  const semillas = pan.includes('Semillas')

  const colorPan = oscuro ? '#3e342f' : '#dca563'
  const colorBase = oscuro ? '#302721' : '#c18a4d'

  const capas = useMemo(() => {
    const resultado = Array.from(
      { length: medallones },
      (_, i) => ({
        id: `carne-${i}`,
        color: '#78472b',
        alto: 18,
      })
    )

    extras.forEach((nombre) => {
      resultado.push({
        id: nombre,
        color: COLORES[nombre] || '#f8e9d2',
        alto: 8,
      })
    })

    return resultado
  }, [medallones, extras])

  return (
    <div className="flex min-h-[230px] flex-col items-center justify-center gap-5 overflow-hidden rounded-2xl bg-[#202020] p-5">
      <div className="flex w-full max-w-[190px] flex-col items-center">
        <div
          className="relative h-14 w-[91%] rounded-t-[100px] rounded-b-xl border-b-4"
          style={{
            backgroundColor: colorPan,
            borderBottomColor: colorBase,
          }}
        >
          {semillas && (
            <div className="absolute inset-0">
              {[
                [27, 32],
                [22, 55],
                [45, 22],
                [48, 69],
                [63, 45],
                [30, 77],
              ].map(([top, left], indice) => (
                <span
                  key={indice}
                  className="absolute h-1 w-2 rotate-[-20deg] rounded-full bg-[#f8e9d2]"
                  style={{
                    top: `${top}%`,
                    left: `${left}%`,
                  }}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex w-full flex-col items-center gap-[2px] py-1">
          {capas
            .slice()
            .reverse()
            .map((capa) => (
              <div
                key={capa.id}
                className="w-[88%] rounded-[40%] border border-black/15 transition-all duration-200"
                style={{
                  height: capa.alto,
                  backgroundColor: capa.color,
                }}
              />
            ))}
        </div>

        <div
          className="h-7 w-[89%] rounded-b-[40px] rounded-t-lg"
          style={{ backgroundColor: colorBase }}
        />
      </div>

      <p className="text-center text-[11px] text-white/40">
        Vista previa ilustrativa
      </p>
    </div>
  )
}

export default function ArmaTuHamburguesa() {
  const [pan, setPan] = useState('Blanco')
  const [medallones, setMedallones] = useState(1)
  const [extras, setExtras] = useState([])
  const [observaciones, setObservaciones] = useState('')

  const { data: config } = useDatosLocal()

  function alternarExtra(nombre) {
    setExtras((actual) =>
      actual.includes(nombre)
        ? actual.filter((item) => item !== nombre)
        : [...actual, nombre]
    )
  }

  function reiniciar() {
    setPan('Blanco')
    setMedallones(1)
    setExtras([])
    setObservaciones('')
  }

  const mensaje = [
    '¡Hola Sky Burger! 🍔',
    'Quisiera consultar por una hamburguesa personalizada.',
    '',
    `Pan Brioche: ${pan}`,
    `Medallones de carne: ${medallones}`,
    '',
    'Extras:',
    ...(extras.length
      ? extras.map((nombre) => `• ${nombre}`)
      : ['• Sin extras']),
    '',
    `Aclaraciones: ${observaciones.trim() || 'Ninguna'}`,
    '',
    '¿Me confirman el precio y la disponibilidad?',
  ].join('\n')

  const whatsapp = enlaceWhatsApp(config?.whatsapp, mensaje)

  const boton =
    'min-h-11 rounded-xl border px-3 py-2.5 text-sm ' +
    'font-semibold transition-colors'

  return (
    <section
      id="arma-la-tuya"
      className="scroll-mt-24 border-t border-white/10 bg-[#191919] px-5 py-14 sm:px-8 sm:py-20"
    >
      <div className="mx-auto max-w-6xl">
        {/* ENCABEZADO */}
        <div className="mb-9 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-widest text-sky-primary">
            A tu gusto
          </p>

          <h2 className="mt-3 font-heading text-3xl font-bold sm:text-4xl">
            Armá la tuya.
          </h2>

          <p className="mt-3 leading-relaxed text-white/60">
            Elegí tu combinación favorita y consultanos
            su precio por WhatsApp.
          </p>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* OPCIONES */}
          <div className="space-y-7 rounded-2xl border border-white/10 bg-sky-surface p-5 sm:p-7">
            {/* PAN */}
            <fieldset>
              <legend className="font-heading text-lg font-bold">
                Pan Brioche
              </legend>

              <div className="mt-4 grid grid-cols-2 gap-2">
                {PANES.map((opcion) => (
                  <button
                    key={opcion}
                    type="button"
                    aria-pressed={pan === opcion}
                    onClick={() => setPan(opcion)}
                    className={`${boton} ${
                      pan === opcion
                        ? 'border-sky-primary bg-sky-primary text-white'
                        : 'border-white/10 bg-sky-background text-white/65 hover:border-white/30'
                    }`}
                  >
                    {opcion}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="border-t border-white/10" />

            {/* MEDALLONES */}
            <fieldset>
              <legend className="font-heading text-lg font-bold">
                Medallones de carne
              </legend>

              <div className="mt-4 grid grid-cols-3 gap-2">
                {[1, 2, 3].map((cantidad) => (
                  <button
                    key={cantidad}
                    type="button"
                    aria-pressed={medallones === cantidad}
                    onClick={() => setMedallones(cantidad)}
                    className={`${boton} ${
                      medallones === cantidad
                        ? 'border-sky-primary bg-sky-primary text-white'
                        : 'border-white/10 bg-sky-background text-white/65 hover:border-white/30'
                    }`}
                  >
                    {cantidad}
                  </button>
                ))}
              </div>
            </fieldset>

            <div className="border-t border-white/10" />

            {/* EXTRAS */}
            <fieldset>
              <legend className="font-heading text-lg font-bold">
                Extras
                <span className="ml-2 text-sm font-normal text-white/40">
                  · {extras.length} seleccionados
                </span>
              </legend>

              <p className="mt-1 text-xs text-white/45">
                Podés elegir todos los que quieras.
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
                {EXTRAS.map((nombre) => {
                  const activo = extras.includes(nombre)

                  return (
                    <button
                      key={nombre}
                      type="button"
                      aria-pressed={activo}
                      onClick={() => alternarExtra(nombre)}
                      className={`flex min-h-11 items-center justify-between gap-2 rounded-lg border px-3 py-2 text-left text-xs font-semibold transition-colors sm:text-sm ${
                        activo
                          ? 'border-sky-primary bg-sky-primary/15 text-white'
                          : 'border-white/10 bg-sky-background text-white/65 hover:border-white/30'
                      }`}
                    >
                      <span>{nombre}</span>

                      {activo && (
                        <FaCheck
                          aria-hidden="true"
                          className="shrink-0 text-sky-primary"
                          size={12}
                        />
                      )}
                    </button>
                  )
                })}
              </div>
            </fieldset>

            <div className="border-t border-white/10" />

            {/* NOTA OPCIONAL */}
            <div>
              <label
                htmlFor="arma-observaciones"
                className="font-heading text-lg font-bold"
              >
                Aclaraciones
                <span className="ml-2 text-sm font-normal text-white/40">
                  (opcional)
                </span>
              </label>

              <textarea
                id="arma-observaciones"
                rows={2}
                maxLength={500}
                value={observaciones}
                onChange={(evento) =>
                  setObservaciones(evento.target.value)
                }
                placeholder="¿Algún detalle especial?"
                className="mt-3 min-h-20 w-full resize-y rounded-xl border border-white/10 bg-sky-background px-4 py-3 text-sm text-white outline-none focus:border-sky-primary"
              />
            </div>
          </div>

          {/* RESUMEN */}
          <aside className="space-y-4 rounded-2xl border border-white/10 bg-sky-surface p-4 sm:p-5 lg:sticky lg:top-28">
            <VistaPrevia
              pan={pan}
              medallones={medallones}
              extras={extras}
            />

            <div className="space-y-3 px-1">
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-heading text-lg font-bold">
                  Tu combinación
                </h3>

                <button
                  type="button"
                  onClick={reiniciar}
                  aria-label="Reiniciar configuración"
                  title="Reiniciar"
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-white/40 hover:bg-white/5 hover:text-white"
                >
                  <FaUndo size={13} aria-hidden="true" />
                </button>
              </div>

              <p className="text-sm leading-relaxed text-white/65">
                {pan} · {medallones}{' '}
                {medallones === 1 ? 'medallón' : 'medallones'}
              </p>

              {extras.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {extras.map((nombre) => (
                    <span
                      key={nombre}
                      className="rounded-md bg-white/5 px-2 py-1 text-[11px] text-sky-beige"
                    >
                      {nombre}
                    </span>
                  ))}
                </div>
              )}

              <p className="text-xs leading-relaxed text-white/40">
                El local confirma precio y disponibilidad.
              </p>
            </div>

            {whatsapp ? (
              <a
                href={whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-12 items-center justify-center gap-2 rounded-xl bg-sky-primary px-4 text-sm font-bold text-white transition hover:brightness-110"
              >
                <FaWhatsapp aria-hidden="true" />
                Consultar por WhatsApp
              </a>
            ) : (
              <div className="rounded-xl bg-sky-background p-3 text-center text-xs text-white/55">
                WhatsApp no configurado.
              </div>
            )}
          </aside>
        </div>
      </div>
    </section>
  )
}
