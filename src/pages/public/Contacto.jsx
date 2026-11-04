
import { Navigate, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'

import {
  FaWhatsapp,
  FaInstagram,
  FaFacebookF,
  FaMapMarkerAlt,
  FaClock,
  FaExternalLinkAlt,
} from 'react-icons/fa'

import { supabase } from '../../config/supabaseClient'

import {
  useDatosLocal,
  useEstadoLocal,
} from '../../hooks/useCatalogo'

import { enlaceWhatsApp } from '../../utils/formato'

// ======================================================
// GOOGLE MAPS
// ======================================================

async function consultarMapa() {
  const { data, error } = await supabase.rpc(
    'obtener_google_maps_url'
  )

  if (error) throw error

  return data ?? ''
}

function enlaceMapaSeguro(valor) {
  if (!valor) return null

  try {
    const url = new URL(valor)
    const dominio = url.hostname.toLowerCase()

    const enlaceCorto =
      dominio === 'maps.app.goo.gl' &&
      /^\/[a-zA-Z0-9_-]+\/?$/.test(url.pathname)

    const enlaceGoogle =
      [
        'google.com',
        'www.google.com',
        'maps.google.com',
      ].includes(dominio) &&
      (
        url.pathname === '/maps' ||
        url.pathname.startsWith('/maps/')
      )

    if (
      url.protocol !== 'https:' ||
      url.username ||
      url.password ||
      (!enlaceCorto && !enlaceGoogle)
    ) {
      return null
    }

    return url.toString()
  } catch {
    return null
  }
}

// ======================================================
// INSTAGRAM
// Permite:
// @skyburger
// skyburger
// https://www.instagram.com/skyburger/
// ======================================================

function enlaceInstagramSeguro(valor) {
  if (typeof valor !== 'string') return null

  const texto = valor.trim()

  if (!texto) return null

  let usuario = texto

  if (/^https?:\/\//i.test(texto)) {
    try {
      const url = new URL(texto)
      const dominio = url.hostname.toLowerCase()

      if (
        url.protocol !== 'https:' ||
        url.username ||
        url.password ||
        ![
          'instagram.com',
          'www.instagram.com',
        ].includes(dominio)
      ) {
        return null
      }

      const partes = url.pathname
        .split('/')
        .filter(Boolean)

      if (partes.length !== 1) return null

      usuario = partes[0]
    } catch {
      return null
    }
  }

  usuario = usuario.replace(/^@/, '')

  if (!/^[a-zA-Z0-9._]{1,30}$/.test(usuario)) {
    return null
  }

  return `https://www.instagram.com/${usuario}/`
}

// ======================================================
// FACEBOOK
// Permite:
// https://www.facebook.com/skyburger
// https://facebook.com/skyburger
// https://www.facebook.com/profile.php?id=123...
// ======================================================

function enlaceFacebookSeguro(valor) {
  if (typeof valor !== 'string') return null

  const texto = valor.trim()

  if (!texto) return null

  let url

  try {
    // Si el dueño escribe solo el nombre de la página,
    // construimos su URL.
    const enlace = /^https?:\/\//i.test(texto)
      ? texto
      : `https://www.facebook.com/${texto.replace(/^@/, '')}`

    url = new URL(enlace)
  } catch {
    return null
  }

  const dominio = url.hostname.toLowerCase()

  const dominiosPermitidos = [
    'facebook.com',
    'www.facebook.com',
    'm.facebook.com',
    'fb.com',
    'www.fb.com',
  ]

  if (
    url.protocol !== 'https:' ||
    url.username ||
    url.password ||
    !dominiosPermitidos.includes(dominio)
  ) {
    return null
  }

  // Evitamos URLs que apunten a otras funciones
  // de Facebook en vez de a una página o perfil.
  const partes = url.pathname.split('/').filter(Boolean)

  const esPerfilId =
    partes.length === 1 &&
    partes[0] === 'profile.php' &&
    /^\d+$/.test(url.searchParams.get('id') ?? '')

  const esPagina =
    partes.length === 1 &&
    /^[a-zA-Z0-9._-]+$/.test(partes[0]) &&
    partes[0] !== 'profile.php'

  if (!esPerfilId && !esPagina) return null

  // Solo conservamos el parámetro id para URLs de perfil.
  if (!esPerfilId) {
    url.search = ''
  }

  url.hash = ''

  return url.toString()
}

// ======================================================
// TARJETA DE RED SOCIAL
// ======================================================

function TarjetaContacto({
  href,
  Icono,
  titulo,
  descripcion,
  claseIcono,
  claseHover,
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group flex min-h-20 items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/[0.06] ${claseHover}`}
    >
      <span
        className={`grid h-11 w-11 shrink-0 place-items-center rounded-xl ${claseIcono}`}
      >
        <Icono size={20} aria-hidden="true" />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold text-white">
          {titulo}
        </span>

        <span className="mt-1 block text-xs text-white/45">
          {descripcion}
        </span>
      </span>

      <FaExternalLinkAlt
        size={11}
        aria-hidden="true"
        className="shrink-0 text-white/25 transition group-hover:text-white/70"
      />
    </a>
  )
}

// ======================================================
// CONTACTO
// ======================================================

export default function Contacto() {
  const location = useLocation()

  const {
    data: config,
    isPending,
    isError,
  } = useDatosLocal()

  const {
    data: estado,
    isPending: cargandoEstado,
  } = useEstadoLocal()

  const { data: mapaGuardado } = useQuery({
    queryKey: ['publico', 'google-maps'],
    queryFn: consultarMapa,
  })

  const mapsUrl = enlaceMapaSeguro(mapaGuardado)

  const whatsapp = enlaceWhatsApp(
    config?.whatsapp,
    '¡Hola Sky Burger! Quisiera hacer una consulta.'
  )

  const instagramUrl = enlaceInstagramSeguro(
    config?.instagram
  )

  const facebookUrl = enlaceFacebookSeguro(
    config?.facebook
  )

  const tieneRedes =
    Boolean(whatsapp) ||
    Boolean(instagramUrl) ||
    Boolean(facebookUrl)

  // Compatibilidad con enlaces anteriores.
  if (location.hash === '#arma-la-tuya') {
    return (
      <Navigate
        to="/hamburguesas#arma-la-tuya"
        replace
      />
    )
  }

  if (isPending) {
    return (
      <section className="px-5 py-20 text-center text-white/60">
        Cargando información del local...
      </section>
    )
  }

  if (isError || !config) {
    return (
      <section className="px-5 py-20 text-center text-sky-primary">
        No pudimos cargar los datos de contacto.
      </section>
    )
  }

  const abierto = estado?.local_abierto === true
  const puedePedir = estado?.puede_pedir === true

  return (
    <>
      {/* ENCABEZADO */}
      <section className="border-b border-white/10 px-5 py-16 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <p className="text-xs font-bold uppercase tracking-widest text-sky-primary">
            Contacto
          </p>

          <h1 className="mt-4 font-heading text-4xl font-bold sm:text-5xl lg:text-6xl">
            ¿Hablamos?
          </h1>

          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg">
            ¿Tenés alguna duda, consulta o querés saber
            dónde encontrarnos? Estamos para ayudarte.
          </p>
        </div>
      </section>

      {/* INFORMACIÓN */}
      <section className="px-5 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2">

          {/* HORARIOS Y ESTADO */}
          <article className="rounded-2xl border border-white/10 bg-sky-surface p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="rounded-xl bg-sky-primary/10 p-3 text-sky-primary">
                <FaClock aria-hidden="true" />
              </span>

              <h2 className="font-heading text-xl font-bold">
                Estado del local
              </h2>
            </div>

            {cargandoEstado ? (
              <p className="mt-6 text-sm text-white/60">
                Consultando horarios...
              </p>
            ) : (
              <>
                <p
                  className={`mt-7 font-heading text-2xl font-bold ${
                    abierto
                      ? 'text-green-400'
                      : 'text-sky-primary'
                  }`}
                >
                  {abierto
                    ? 'Estamos abiertos'
                    : 'Estamos cerrados'}
                </p>

                <p className="mt-3 text-sm leading-relaxed text-white/65">
                  {puedePedir
                    ? '¡Estamos recibiendo pedidos! Elegí tu hamburguesa favorita.'
                    : abierto
                      ? 'El local está abierto, pero la recepción de pedidos está pausada.'
                      : 'En este momento no estamos recibiendo pedidos.'}
                </p>
              </>
            )}
          </article>

          {/* DIRECCIÓN */}
          <article className="rounded-2xl border border-white/10 bg-sky-surface p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="rounded-xl bg-sky-primary/10 p-3 text-sky-primary">
                <FaMapMarkerAlt aria-hidden="true" />
              </span>

              <h2 className="font-heading text-xl font-bold">
                Nuestra ubicación
              </h2>
            </div>

            {config.direccion ? (
              <p className="mt-7 leading-relaxed text-white/75">
                {config.direccion}
              </p>
            ) : (
              <p className="mt-7 text-sm leading-relaxed text-white/60">
                Por el momento no tenemos una dirección
                de atención al público publicada.
              </p>
            )}

            {mapsUrl && (
              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex min-h-12 w-full items-center justify-center gap-3 rounded-xl bg-sky-primary px-6 font-bold text-white transition hover:brightness-110 sm:w-auto"
              >
                <FaExternalLinkAlt aria-hidden="true" />
                Cómo llegar
              </a>
            )}
          </article>

          {/* REDES SOCIALES Y CONTACTO */}
          <article className="rounded-2xl border border-white/10 bg-sky-surface p-6 md:col-span-2 sm:p-8">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-sky-primary">
                  Redes sociales
                </p>

                <h2 className="mt-2 font-heading text-2xl font-bold">
                  Seguimos en contacto
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-relaxed text-white/60">
                  Consultanos por nuestros productos,
                  hacé tu pedido o seguinos para conocer
                  las últimas novedades.
                </p>
              </div>
            </div>

            <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {whatsapp && (
                <TarjetaContacto
                  href={whatsapp}
                  Icono={FaWhatsapp}
                  titulo="WhatsApp"
                  descripcion="Consultas y pedidos"
                  claseIcono="bg-green-500/10 text-green-400"
                  claseHover="hover:border-green-500/35"
                />
              )}

              {instagramUrl && (
                <TarjetaContacto
                  href={instagramUrl}
                  Icono={FaInstagram}
                  titulo="Instagram"
                  descripcion="Fotos y novedades"
                  claseIcono="bg-pink-500/10 text-pink-400"
                  claseHover="hover:border-pink-500/35"
                />
              )}

              {facebookUrl && (
                <TarjetaContacto
                  href={facebookUrl}
                  Icono={FaFacebookF}
                  titulo="Facebook"
                  descripcion="Seguinos en Facebook"
                  claseIcono="bg-blue-500/10 text-blue-400"
                  claseHover="hover:border-blue-500/35"
                />
              )}

              {!tieneRedes && (
                <p className="text-sm text-white/55 sm:col-span-2 lg:col-span-3">
                  Próximamente publicaremos nuestros
                  medios de contacto.
                </p>
              )}
            </div>
          </article>
        </div>
      </section>
    </>
  )
}
