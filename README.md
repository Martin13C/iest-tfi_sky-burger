# Sky Burger 🍔

Sitio web de hamburguesas artesanales y panel de gestión comercial desarrollado con **React + Vite + Supabase** como Trabajo Final Integrador de IA (TP4, 2026). Identidad visual original de Sky Burger: rojo, oscuro y beige, tipografías Fredoka/Quicksand.

## Funcionalidades
- Sitio público responsive con catálogo de hamburguesas, promociones, galería, nosotros y contacto.
- Armado de hamburguesa personalizada, carrito de navegador y acceso a WhatsApp (la compra no se registra automáticamente).
- Panel del **dueño** para catálogo, galería, configuración, horarios y operación.
- Panel de **administrador** con control de acceso y gestión del dueño.
- Google Maps y redes cuando sus datos están disponibles.
- Estadísticas web de visitas: **pospuestas**, la sección muestra estado futuro.

## Tecnologías
React 19, Vite 8, React Router 7, Tailwind 4, Supabase JS 2 (PostgreSQL, Auth, Storage y RPC/Edge Functions externas), TanStack Query 5, React Hook Form 7, Zod 4, React Icons, Framer Motion, Toastify, SweetAlert2 y lightbox.

## Requisitos
Node.js compatible con Vite 8 (comprobar versión exigida en documentación del proyecto), npm, proyecto Supabase configurado y claves públicas autorizadas. Los servicios y tablas deben existir previamente: **el ZIP de frontend no despliega backend ni migraciones**.

## Instalación local
```bash
npm install
```
Crear `.env.local` **sin subirlo a Git**, con:
```dotenv
VITE_SUPABASE_URL=https://TU_PROYECTO.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=TU_CLAVE_PUBLICA
```
Ejecutar:
```bash
npm run dev
npm run build
npm run preview
```

**Tests:** el package.json recibido no incluye aún `npm test`; ver `docs/08-TAREAS.md` para incorporación supervisada de tests. No se declara ninguna prueba ejecutada en este README.

## Publicación en Vercel
- Framework: Vite; build `npm run build`; output `dist`.
- Configurar variables `VITE_SUPABASE_URL`, `VITE_SUPABASE_PUBLISHABLE_KEY` en Vercel y volver a desplegar.
- `vercel.json` contiene configuración de rutas SPA (revisarla antes de publicar).
- Agregar URL definitiva a Redirect URLs de Supabase Auth y a los orígenes permitidos que correspondan a Edge Functions (`FRONTEND_ORIGINS`).
- **URL pública:** [PENDIENTE — incorporar al desplegar].

## Recursos y seguridad
Las imágenes configurables se alojan en Supabase Storage; los assets fijos en `public/marca`/`public/media`. No publicar secretos de servidor, claves privadas, datos personales ni archivos `.env*`. Los permisos efectivos requieren RLS/RPC/Edge Functions; la UI de rol no es una barrera suficiente.

## Especificación y trabajo con agentes
- `AGENTS.md`: arnés de ejecución con permisos explícitos.
- `memory.md`: decisiones estables y pendientes.
- `docs/`: kit TP3 actualizado, constitución, prompts y ética.
- `specs/001-catalogo`, `002-carrito-whatsapp`, `003-configuracion-comercial`: specs EARS, clarificación, planes, tareas y verificaciones.
- `.opencode/commands`: `/spec`, `/clarificar`, `/verificar`, `/cambio`.
- `.agents/skills`: dos skills propias de revisión y seguridad.

El proyecto se continúa con **OpenCode CLI bajo supervisión humana**, sin autorizar acciones destructivas por defecto. La documentación SDD presente es una **reconstrucción de intención y alcance**, no un historial falso de ejecuciones. Los tests/commits se registran cuando realmente ocurren.

## Multimedia e IA
Material de imágenes y video elaborado con ayuda de IA, con fichas, revisión de calidad y licencias a completar en `multimedia/FICHAS-IA.md`. Video promocional informado: https://youtu.be/MQ2xXXXPIrk (contenido y herramientas por verificar). Video demo y publicación Vercel a cargo del estudiante.

## Proyecto académico
Instituto de Estudios Superiores de Tinogasta · Tecnicatura en Desarrollo de Software · Inteligencia Artificial · TP4 2026. Documentación preparada para revisión y defensa; no representa declaración de aprobación ni tests que no se han ejecutado.
