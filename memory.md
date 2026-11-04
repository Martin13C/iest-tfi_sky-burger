# memory.md — Memoria persistente de proyecto (sin secretos)

## Identidad y alcance
- Marca: Sky Burger; lema «Cada bocado cuenta una historia»; mascota/gato Sky. Paleta rojo `#E63946`, carbón `#1D1D1D`, blanco, beige `#F8E9D2`. Fredoka / Quicksand.
- Web de carta digital con promociones, galería, armado personalizado, carrito en navegador y comunicación vía WhatsApp. **No afirmar** cobro digital ni confirmación automática de pedidos.
- Roles autenticados: `administrador` y `dueno`; visitantes anónimos en público. Un único dueño según la regla de negocio.

## Arquitectura observada en el ZIP entregado
- React 19, Vite 8, React Router DOM 7, Tailwind CSS 4.
- Supabase JS 2; funciones RPC: `mi_perfil`, `estado_publicacion`, `estado_local_publico`, `datos_local_publicos`, `configuracion_privada`, `actualizar_datos_comerciales`, entre otras (ver código).
- Formularios React Hook Form 7 + Zod 4; React Query 5; React Toastify/SweetAlert2; galería y animaciones.
- Roles de BD confirmados durante el desarrollo: `roles.id = 1` administrador, `roles.id = 2` dueño; `perfiles.rol_id`, nunca `perfiles.rol_codigo`.
- Edge Functions desplegadas en Supabase pueden **no estar en este ZIP**; obtener copia antes de modificarlas. Configuración de CORS usa secreto `FRONTEND_ORIGINS` (plural).

## Decisiones funcionales
- Para el TP4 usar al menos tres specs: catálogo, carrito/pedido por WhatsApp, configuración comercial y horarios.
- Umami y analítica de visitantes: fuera de versión por limitación del plan; no desplegar API privada.
- `public/marca/` existe, pero el ZIP de código no incluye necesariamente los archivos estáticos finales; auditar `logo.svg` y `hero.svg` antes de publicar.
- Las imágenes variables de productos y galería se guardan en Supabase Storage; los recursos de marca, hero estático, mockups y videos pueden ir en `public/`/`multimedia/`.
- Repositorio y YouTube informados por estudiante; **URLs concretas no verificadas** salvo https://youtu.be/MQ2xXXXPIrk. Vercel y video demo quedan a cargo del estudiante.

## Pendientes de verificación humana
- Confirmar persistencia y publicación de Facebook en RPC/BD (el formulario React no es suficiente).
- Validar integración real de Instagram, UX de auth sin pérdida de formularios.
- Revisar permisos/RLS con cuenta real y pruebas negativas; preservar secrecía de claves.
- Lighthouse, pruebas E2E, despliegue, licencias multimedia y prompts originales aún sin evidencia.

## Registro de Pruebas Automatizadas (Vitest)
- **Fecha**: 04/11/2026
- **Archivos creados en `tests/`**:
  - `tests/catalogoSchema.test.js` (RF: Gestión del catálogo / Validación de esquemas Zod).
  - `tests/CarritoContext.test.jsx` (RF: Carrito de compras y cálculo de totales).
  - `tests/formato.test.js` (RF: Formateo de precios y moneda local ARS).
- **Resultado de Ejecución (`npm run test`)**: 3 test files pasados con éxito, 5 tests totales aprobados.

## Regla de actualización
Actualizar al cerrar una tarea **solo con hechos contrastados**: fecha, decisión, archivo, resultado y enlace a commit si existe. No almacenar credenciales, datos personales ni supuestos como resultados.
