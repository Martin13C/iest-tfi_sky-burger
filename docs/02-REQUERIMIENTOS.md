# 02 — Requerimientos de Sky Burger

## Requisitos funcionales
| ID | Requisito | Prioridad | Spec |
|---|---|---|---|
| RF01 | Mostrar hamburguesas activas y sus datos (nombre, precio, disponibilidad, imagen) | Alta | 001 |
| RF02 | Permitir explorar/filtrar catálogo por categoría y promociones vigentes | Alta | 001 |
| RF03 | Agregar/modificar/eliminar ítems del carrito, preservando estado en navegador | Alta | 002 |
| RF04 | Construir un pedido/consulta mediante WhatsApp con detalle entendible | Alta | 002 |
| RF05 | Permitir al dueño editar datos comerciales y horario, con validación y persistencia segura | Alta | 003 |
| RF06 | Restringir acciones administrativas al rol autorizado mediante mecanismos servidor | Alta | 003 |
| RF07 | Permitir al dueño gestionar hamburguesas, promociones y galería | Alta | 001 |
| RF08 | Mostrar estado de local, pedidos y sitio publicado con fuente confiable | Media | 003 |
| RF09 | Mostrar contacto con dirección, Instagram, WhatsApp y Facebook solo si están configurados y persistidos | Media | 003 |
| RF10 | Permitir al administrador gestionar la cuenta del dueño | Media | Complementaria, requiere evidencia separada |

## Requisitos no funcionales
- RNF01: diseño mobile-first a 360px, sin desplazamiento horizontal involuntario.
- RNF02: objetivos Lighthouse de al menos 80 en sus cuatro categorías, **pendiente de medición real**.
- RNF03: navegación por teclado, labels, contraste y texto alternativo contextual.
- RNF04: secrets solo en servidor, RLS/Auth y validaciones de entrada; ningún JWT de rol es autorización suficiente por sí solo.
- RNF05: consultas y transiciones sin desmontar innecesariamente formularios, manejo de errores.
- RNF06: componentes reutilizables, lógica separada, builds reproducibles y pruebas automáticas de requisitos principales.
- RNF07: imágenes optimizadas, lazy loading donde corresponda, SEO básico y política de caché coherente.

## Fuera de alcance
Cobro en línea, métricas Umami en panel, envío propio, métricas inventadas y persistencia de pedidos en BD. Cumplimiento real sujeto a verificación; este documento es una especificación, no certificación.
