
import { Link } from 'react-router-dom'
import { FaArrowRight, FaImages, FaExpand } from 'react-icons/fa'

import {
  LightGallery,
  LightGalleryItem,
} from '@lightgallery/react'

import Zoom from '@lightgallery/react/plugins/zoom'
import Thumbnail from '@lightgallery/react/plugins/thumbnail'

import 'lightgallery/css/lightgallery.css'
import 'lightgallery/css/lg-zoom.css'
import 'lightgallery/css/lg-thumbnail.css'

import { useGaleria } from '../../hooks/useCatalogo'
import { obtenerUrlImagen } from '../../config/supabaseClient'

export default function Galeria() {
  const {
    data: imagenes = [],
    isPending,
    isError,
    error,
  } = useGaleria()

  const fotos = imagenes
    .filter((item) => item.imagen_ruta)
    .map((item) => ({
      ...item,
      url: obtenerUrlImagen(item.imagen_ruta),
    }))
    .filter((item) => Boolean(item.url))

  return (
    <>
      {/* ENCABEZADO */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="pointer-events-none absolute -right-16 top-0 h-80 w-80 rounded-full bg-sky-primary/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-primary/25 bg-sky-primary/10 px-4 py-2 text-xs font-bold uppercase tracking-widest text-sky-primary">
              <FaImages aria-hidden="true" />
              Galería Sky Burger
            </div>

            <h1 className="mt-6 font-heading text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              El sabor también
              <span className="block text-sky-primary">
                entra por los ojos.
              </span>
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/65 sm:text-lg">
              Un recorrido visual por nuestras hamburguesas,
              ingredientes y momentos. Cada fotografía cuenta
              una parte de nuestra historia.
            </p>
          </div>
        </div>
      </section>

      {/* GALERÍA ARTÍSTICA */}
      <section className="px-5 py-14 sm:px-8 sm:py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-sky-primary">
                Nuestro universo
              </p>

              <h2 className="mt-3 font-heading text-3xl font-bold sm:text-4xl">
                Momentos Sky Burger
              </h2>
            </div>

            {!isPending && !isError && fotos.length > 0 && (
              <p className="flex items-center gap-2 text-sm text-white/50">
                <FaExpand aria-hidden="true" />
                Tocá una imagen para ampliarla
              </p>
            )}
          </div>

          {isPending && (
            <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((item) => (
                <div
                  key={item}
                  className="aspect-square animate-pulse rounded-2xl bg-sky-surface"
                />
              ))}
            </div>
          )}

          {isError && (
            <div
              role="alert"
              className="rounded-2xl border border-sky-primary/30 bg-sky-primary/10 p-6"
            >
              <h3 className="font-bold">
                No pudimos cargar la galería.
              </h3>

              <p className="mt-2 text-sm text-white/60">
                {error?.message}
              </p>
            </div>
          )}

          {!isPending && !isError && (
            <>
              {fotos.length > 0 ? (
                <LightGallery
                  plugins={[Zoom, Thumbnail]}
                  speed={450}
                  zoom={{ scale: 1.5 }}
                >
                  <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
                    {fotos.map((foto, indice) => (
                      <LightGalleryItem
                        key={foto.id}
                        item={{
                          src: foto.url,
                          thumb: foto.url,
                          alt: foto.titulo || 'Fotografía de Sky Burger',
                          caption: foto.titulo || 'Sky Burger',
                        }}
                        href={foto.url}
                      >
                        <a
                          href={foto.url}
                          aria-label={`Ampliar ${foto.titulo || `fotografía ${indice + 1}`}`}
                          className={`group relative block overflow-hidden rounded-2xl bg-sky-surface ${
                            indice % 7 === 0
                              ? 'col-span-2 row-span-2'
                              : ''
                          }`}
                        >
                          <div
                            className={
                              indice % 7 === 0
                                ? 'aspect-square h-full w-full'
                                : 'aspect-square'
                            }
                          >
                            <img
                              src={foto.url}
                              alt={foto.titulo || `Sky Burger ${indice + 1}`}
                              loading={indice < 3 ? 'eager' : 'lazy'}
                              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                          </div>

                          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-100" />

                          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-6">
                            <div className="min-w-0">
                              {foto.titulo && (
                                <h3 className="line-clamp-2 font-heading text-sm font-bold text-white sm:text-lg">
                                  {foto.titulo}
                                </h3>
                              )}

                              {foto.descripcion && (
                                <p className="mt-1 hidden line-clamp-2 text-xs text-white/75 sm:block">
                                  {foto.descripcion}
                                </p>
                              )}
                            </div>

                            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/30 bg-black/30 text-white backdrop-blur-sm">
                              <FaExpand
                                aria-hidden="true"
                                size={13}
                              />
                            </span>
                          </div>
                        </a>
                      </LightGalleryItem>
                    ))}
                  </div>
                </LightGallery>
              ) : (
                <div className="rounded-3xl border border-white/10 bg-sky-surface px-6 py-20 text-center">
                  <FaImages className="mx-auto text-4xl text-sky-primary" />

                  <h3 className="mt-5 font-heading text-2xl font-bold">
                    Estamos preparando nuestra galería.
                  </h3>

                  <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-white/60">
                    Muy pronto compartiremos más fotografías,
                    novedades y momentos de Sky Burger.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ENLACE AL MENÚ */}
      <section className="border-t border-white/10 bg-sky-surface px-5 py-14 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="font-heading text-2xl font-bold sm:text-3xl">
              ¿Te dio hambre?
            </h2>

            <p className="mt-3 text-sm text-white/65">
              Ahora que las viste, elegí cuál vas a probar.
            </p>
          </div>

          <Link
            to="/hamburguesas"
            className="inline-flex min-h-12 items-center gap-3 rounded-xl bg-sky-primary px-6 font-bold text-white transition hover:brightness-110"
          >
            Ver hamburguesas
            <FaArrowRight aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  )
}
