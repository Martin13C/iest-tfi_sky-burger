# 03 — Tecnologías y justificación del stack

## Cambio respecto del TP3
El TP3 declaraba **React + Next.js** como estrategia de frontend. El código final usa **React + Vite**, por decisión práctica: interfaz de cliente ligera, compilación directa y menos superficie de servidor. Este cambio debe justificarse también en el informe del TP4. Una SPA no ofrece las ventajas SEO de SSR automáticamente; se compensa parcialmente con metadatos, contenido visible y mediciones reales (pendientes).

| Capa | Tecnología observada / plan | Motivo |
|---|---|---|
| UI | JavaScript, React 19, React DOM | Componentes y estado |
| Dev/build | Vite 8, `@vitejs/plugin-react` | Desarrollo y build estático |
| Rutas | React Router DOM 7 | Público y paneles por rol |
| Estilos | Tailwind CSS 4 + CSS tokens | Sistema responsive e identidad |
| Backend | Supabase PostgreSQL + Auth + Storage | Datos, usuarios, medios |
| Lógica privilegiada | RPC PostgreSQL y Edge Functions Deno/TypeScript | Validación/acciones servidor |
| Datos remotos | Supabase JS 2; TanStack Query 5 | Consultas, caché, invalidación |
| Formularios | React Hook Form 7, Zod 4, resolvers 7 | Entrada validada |
| UI auxiliar | React Icons, Lucide React, Framer Motion, React Toastify, SweetAlert2, Yet Another React Lightbox, LightGallery | Iconos, UX, galería |
| Repositorio | Git/GitHub | Historial y revisión |
| Deploy previsto | Vercel | Hosting SPA, reglas rewrite |
| Agente | OpenCode CLI | SDD, revisión guiada y cambios aprobados |
| IA apoyo | ChatGPT y herramientas declaradas por estudiante | Especificaciones, asistencia técnica y multimedia |

## Lo que no está instalado/comprobado
`package.json` del ZIP tiene `dev`, `build` y `preview`, **no script `test`**. No se encontraron herramientas de test configuradas en el ZIP. No declarar TDD o pruebas verdes sin implementarlas y ejecutarlas. No se incluyen en el ZIP las Edge Functions desplegadas o migraciones completas.

## Seguridad de despliegue
`VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY` son valores cliente; `SUPABASE_SERVICE_ROLE_KEY` y secretos privados **nunca** se exponen en Vite. Las URLs y secretos de producción se configuran en las plataformas, no en Git.
