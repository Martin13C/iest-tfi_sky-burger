# Guía operativa del repositorio — TP4 Sky Burger

1. Copiar archivos Markdown del ZIP **en sus rutas relativas** desde la raíz del proyecto Vite. No pegar los `.md` dentro de `src/`.
2. Dejar `AGENTS.md`, `memory.md`, `README.md` en la raíz; comandos bajo `.opencode/commands/`; skills propias bajo `.agents/skills/`; `specs/` por funcionalidad.
3. Copiar el contenido de `.gitignore` indicado en la respuesta; mantener `node_modules`, `dist`, `.env*` fuera de Git.
4. Abrir OpenCode en la raíz del repo; **antes de usar un comando, confirmar la ruta de comandos que detecta la versión instalada**. No asegurar que OpenCode leyó los docs si no se comprobó.
5. Iniciar cada funcionalidad con `/spec`, revisar `/clarificar`, aprobar un `plan.md` y `tasks.md`; después permitir ediciones de código y `/verificar`.
6. Usar Git como evidencia real: commits pequeños, capturas y tests ejecutados. Specs de este paquete son **reconstrucción documental del diseño**, no evidencia de pasos históricos efectivamente realizados.
7. El frontend ZIP no contiene tests configurados ni Edge Functions completas: integrar código servidor en el repo solo tras recuperarlo y revisarlo; evitar crear funciones ficticias.
8. Multimedia: videos, gráficos y fichas en `multimedia/`; imágenes que sirven al frontend en `public/`, imágenes configurables de productos/galería en Supabase Storage.
9. Publicación, video demo, Lighthouse e informe: tareas humanas pendientes.

## Criterio de cierre TP4
No afirmar entrega completa hasta contar con 3 specs, tests y commits reales, 8 imágenes y fichas, spot 45–90 s, demo 2–3 min, infografía SDD, 3 gráficos verificables, declaración firmada, informe PDF y URL Vercel.
