# 06 — Diseño UI/UX de Sky Burger

## Identidad
- Paleta: rojo `#E63946`, oscuro `#1D1D1D`, blanco `#FFFFFF`, beige `#F8E9D2`; tokens principales en `src/index.css` (`sky-primary`, `sky-background`, `sky-surface`, `sky-beige`).
- Tipografías: Fredoka para títulos, Quicksand para cuerpo.
- Tono: español cercano, artesanal, sin atribuir propiedades no verificadas.

## Vistas y propósito
| Vista | Jerarquía/UI | Comportamiento |
|---|---|---|
| Inicio | Hero, marca, productos destacados y CTA | Menú/WhatsApp |
| Hamburguesas | Filtros, tarjetas, disponibilidad | Agregar al carrito |
| Promociones | Tarjetas, fechas y precio | Agregar/promocionar |
| Armá la tuya | Pasos de ingredientes | Crear mensaje al WhatsApp |
| Galería/Nosotros | Imágenes y relato de marca | Navegación |
| Contacto | Estado, dirección, mapa, redes | Enlaces validados |
| Admin | Resumen, gestión de dueño, configuración | Acceso por rol |
| Dueño | Resumen de negocio y CRUD | Actualización controlada |

## Criterios verificables
- 360px como ancho base; sin overflow horizontal; navbar y controles teclado.
- Formularios muestran validación y no pierden borradores al cambiar de foco/pestaña.
- Modales de acciones irreversibles solicitan confirmación clara.
- Fotos optimizadas, con `alt` informativo; no poner imagen de producto fija en repositorio si pertenece a catálogo modificable de Storage.
- Estado de pedidos, sitio y local nunca se deduce solo de frontend.

## Referencias
`docs/IDENTIDAD-MARCA.md`, `src/index.css`, páginas y componentes reales. Pendiente captura/medición de accesibilidad en producción.
