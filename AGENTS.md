# AGENTS.md — Arnés de agentes · Sky Burger

> Documento normativo del repositorio. OpenCode y cualquier otro agente deben leerlo **antes** de sugerir o editar código. Los archivos bajo `docs/` son el contrato del proyecto; nunca son permiso para ejecutar acciones destructivas.

## Propósito y orden de lectura
1. `docs/CONSTITUCION.md` (principios y límites).
2. `memory.md` (decisiones técnicas persistentes; no guarda secretos).
3. `docs/01-CONTEXTO.md`, `02-REQUERIMIENTOS.md`, `03-TECNOLOGIAS.md`, `04-ARQUITECTURA.md`, `05-DATOS.md`, `06-DISENO-UI.md`, `07-CONVENCIONES.md`, `08-TAREAS.md`, `09-SEO.md`, `10-SEGURIDAD.md`, `IDENTIDAD-MARCA.md`.
4. `specs/NNN-*/spec.md`, `clarificacion.md`, `plan.md`, `tasks.md`, `verificacion.md` **solo de la tarea activa**.
5. `docs/PROMPTS.md` y `docs/DECISIONES.md` cuando una decisión anterior afecte la tarea.

## Tecnologías
React 19, Vite 8, React Router 7, Tailwind 4, Supabase JS 2 (PostgreSQL, Auth, Storage y RPC/Edge Functions externas), TanStack Query 5, React Hook Form 7, Zod 4, React Icons, Framer Motion, Toastify, SweetAlert2 y lightbox.

## Contexto comprobado del repositorio
Sky Burger: web responsive de hamburguesas artesanales.
- **Frontend**: React 19 + Vite 8 + React Router 7 + Tailwind 4.
- **Backend**: Supabase JS 2 (Auth, PostgreSQL, Storage, Edge Functions).
- **Funcionalidades públicas**: Menú, promociones, galería, carrito local y pedido por WhatsApp.
- **Roles**: Administrador y dueño.
- **Limitaciones**: Sección Analítica web pospuesta. Evitar afirmaciones sobre ventas, pagos en línea, delivery propio o datos de visitas.

## Arquitectura y comandos clave
- **Estructura principal**: `src/`:
  - **Componentes**: `components/` (UI y funcionalidades públicas).
  - **Servicios**: `services/` (lógica de negocio y conexión a Supabase).
    - Ejemplo: `catalogoService.js` para manejo de hamburguesas.
  - **Hooks**: `hooks/` (gestión de datos con TanStack Query y operaciones CRUD).
    - Ejemplo: `useGestionHamburguesas.js` para CRUD de hamburguesas.
  - **Esquemas**: `schemas/` (validación con Zod).
  - **Configuración**: `config/supabaseClient.js` (cliente de Supabase).

- **Comandos clave**:
  - **Desarrollo**: `npm run dev` para iniciar el servidor de desarrollo.
  - **Compilación**: `npm run build` para generar el output para producción.
  - **Pruebas**: No implementadas aún; consultar `docs/08-TAREAS.md` para detalles.

- **Investigación de archivos no usados**:
  - Para verificar si un archivo no está siendo usado, busca en `src/` patrones como:
    - Importaciones sin uso (ej: `import { supabase } from '../config/supabaseClient'` en archivos sin referencia a `supabase`).
    - Funciones o componentes sin llamadas en el código principal (ej: `App.jsx`).
    - Archivos en `src/` que no estén vinculados a rutas o componentes activos.

- **Archivos no usados identificados**:
  - `src/utils/formato.js`: No se encuentra ninguna referencia a este archivo en el código principal.
  - `src/hooks/useLoginCooldown.js`: No se encuentra ninguna referencia a este hook en el código principal.
  - `src/hooks/useEstadisticas.js`: Aunque se usa `useQuery` en este hook, no se encuentra ninguna referencia a `useEstadisticas` en el código principal.

- **Recomendaciones para archivos no usados**:
  - Revisar manualmente los archivos identificados para confirmar su estado.
  - Considerar eliminar archivos no usados si no son necesarios para el proyecto actual.
  - Documentar cualquier archivo que se mantenga pero no se use actualmente.

## Protocolo seguro obligatorio («arnés»)
- **Modo inicial: SOLO LECTURA.** Antes de modificar: identificar requisito RF, inspeccionar archivos, resumir efecto y proponer plan/diff.
- **Permiso explícito del estudiante** para escribir archivos, instalar paquetes, generar migraciones, cambiar RLS/Auth/Storage, desplegar o eliminar cualquier cosa. No interpretar «seguí» como autorización para acciones destructivas.
- **Bloqueado por defecto:** `rm -rf`, borrados de BD, `DROP`, `TRUNCATE`, `DELETE` masivos, `git reset --hard`, `git push --force`, cambios de permisos de seguridad, `service_role` en frontend y ejecución de comandos descargados de Internet.
- **Regla de alcance:** tocar solo los archivos acordados; conservar rutas, nombres públicos, funcionalidades y apariencia no involucrada. Ante incoherencias entre docs y código real, **detener escritura y solicitar decisión**.
- **SDD:** especificación → clarificación → plan → tareas pequeñas → tests → código → verificación → revisión humana → commit. Para requisitos nuevos: actualizar primero spec.
- **TDD y evidencia:** proponer pruebas antes de implementar; correrlas solo con permiso y registrar comandos, resultados y limitaciones. Nunca declarar tests, deploys, Lighthouse, commits o decisiones del estudiante como realizados sin pruebas.
- **Seguridad:** no leer, registrar, pegar ni mostrar `.env*`, tokens JWT, API keys, contraseñas ni datos reales de terceros; variables VITE_ solo para valores públicos. El rol visual no reemplaza RLS y autorizaciones servidor.
- **Calidad:** accesibilidad desde 360px, etiquetas y `alt`, control por teclado, estados de error/carga, evitar pérdida de borradores; optimización sin introducir funcionalidades no solicitadas.
- **Multimedia/ética:** documentar generación IA, revisiones, licencia y uso; no inventar prompts originales ni reconstrucciones como si fuesen originales.

## Escalado de riesgo
- Bajo: leer archivos, revisar diff, redactar spec, proponer tests. Proceder sin escribir fuera de lo aprobado.
- Medio: editar JSX/CSS/docs o ejecutar `npm run build`/tests. Mostrar alcance; actuar solo cuando esté autorizado.
- Alto: SQL, Edge Functions, roles, Auth, Storage, secretos, eliminación, dependencias, publicación, cambios git remotos. Solicitar confirmación específica y explicar recuperación previa.

## Formato obligatorio de cada respuesta del agente
1. **Objetivo y RF/spec**.
2. **Archivos afectados**.
3. **Riesgos y protecciones**.
4. **Pasos propuestos**, sin ejecutar hasta autorización.
5. Después de ejecutar: **diff, pruebas reales, resultado, pendientes y acción humana requerida**.

## Comandos y skills
- `.opencode/commands/spec.md`, `clarificar.md`, `verificar.md`, `cambio.md`.
- `.agents/skills/verificar-criterios/SKILL.md` y `.agents/skills/auditar-cambios-seguros/SKILL.md`.
- Consultar `docs/HARNES.md` para lista de comprobaciones y alcance de cada acción.

> Un archivo Markdown es una instrucción de proceso, **no una barrera técnica infalible**. Usar además permisos y modo de aprobación de OpenCode; la supervisión humana sigue siendo obligatoria.
