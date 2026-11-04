# 09 — SEO y metadatos

## Páginas y textos sugeridos (revisar antes de publicar)
| Ruta | Title | Meta descripción orientativa |
|---|---|---|
| `/` | Sky Burger | Hamburguesas artesanales, promociones y pedidos por WhatsApp. |
| `/hamburguesas` | Hamburguesas — Sky Burger | Conocé las hamburguesas y opciones disponibles. |
| `/promociones` | Promociones — Sky Burger | Explorá las promociones vigentes. |
| `/nosotros` | Nosotros — Sky Burger | Nuestra propuesta y pasión por las hamburguesas artesanales. |
| `/contacto` | Contacto — Sky Burger | Encontrá horarios, dirección y redes sociales. |

## Medidas
- `<html lang="es">`, títulos jerárquicos únicos, metadatos y og:image verificados en build.
- `alt` descriptivo en imágenes de comida; elementos puramente decorativos con `alt=""`.
- URLs legibles, enlaces de navegación funcionales, estado de error 404.
- Favicons/logo/hero solo si hay archivos reales en `public/marca/`.
- Comprobar sitemap/robots y previsualización compartida tras publicar.
- **Limitación técnica:** SPA Vite no genera SSR; indexación, title/meta por ruta y Lighthouse SEO deben comprobarse, no asumirse.
- No inventar ubicación exacta de la tienda ni datos estructurados de comercio hasta tener confirmación.
