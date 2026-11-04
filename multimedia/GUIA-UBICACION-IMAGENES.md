# Guía de colocación de imágenes (sin alterar Storage)

## Imágenes estáticas de marca/editorial → `public/`
- `public/marca/logo.svg`: el código de Nosotros/otros componentes ya referencia esta ruta. **El ZIP frontend tiene `public/marca/` sin recursos; el archivo debe crearse/conservarse o cambiar la ruta de forma consciente.**
- `public/marca/hero.svg`: Inicio lo referencia; se puede reemplazar por imagen optimizada (`hero.webp`) **cambiando la referencia en código**.
- `public/marca/logo-horizontal.webp`: opción para navbar/footer solo si el diseño lo requiere y se ajustan componentes.
- `public/media/local.webp`: fotografía editorial del ambiente, solo si existe pieza válida.
- `public/media/spot-poster.webp`: imagen previa para el video de YouTube si se integra.
- `public/media/mockup-notebook.webp` y `mockup-celular.webp`: útil en página «Cómo se hizo»/entregable; no necesariamente en home.
- Patrones de `imagenes/fondos/`: seleccionar **uno**, optimizado, `public/media/patron-fondo.webp`, si aporta legibilidad; evitar copiar todos.

## Imágenes dinámicas → Supabase Storage
- `imagenes/Menu/*.webp` → productos/hamburguesas en tabla `hamburguesas` y columna `imagen_ruta`, dentro del bucket configurado.
- `imagenes/Galeria/*.webp` → galería administrable, con rutas en tabla `galeria`.
- Promociones variables → Storage y tabla `promociones`.
- No duplicar en `public` y Storage por defecto. No subir masivamente sin backup, orden, licencia y aprobación.

## Otras piezas
- `imagenes/ingre/*.webp`: pueden ir a `public/media/ingredientes/` **solo si** el constructor de hamburguesas realmente las referencia después de adaptar código; hoy el constructor usa composición CSS.
- `multimedia/imagenes/`: originales, variantes, prompts, mockups y evolución para TP4; no se cargan automáticamente en el sitio.
- `multimedia/video/`: guiones, proyectos editables, capturas y enlaces, no subir videos pesados al bundle de React si YouTube basta.

## Control previo a publicación
Licencia y transparencia IA; formato WebP/JPG/AVIF; tamaños responsive; dimensiones; `alt`; si la imagen viene de Storage, el botón/consulta la muestra. No afirmar «8 imágenes integradas» solo por tener un ZIP con imágenes.
