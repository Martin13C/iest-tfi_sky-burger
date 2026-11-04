# Constitución del proyecto — Sky Burger

1. **Stack comprobable.** Se conserva React + Vite + Supabase; cualquier dependencia nueva requiere justificación y autorización, y el cambio respecto de Next.js del TP3 se explica en `03-TECNOLOGIAS.md`.
2. **Identidad consistente.** Componentes, textos y medios respetan `IDENTIDAD-MARCA.md`, tokens CSS y español argentino; no cambiar marca o paleta sin decisión documentada.
3. **Capas separadas.** Páginas/componentes muestran UI; hooks coordinan estado; servicios consumen Supabase; permisos efectivos se resuelven en RLS/RPC/Edge Functions, no solo en el navegador.
4. **Requisitos verificables.** Toda funcionalidad nueva tiene RF, spec EARS, criterios de aceptación, tests previstos y validación real documentada.
5. **Protección de información.** Claves sensibles nunca en repositorio ni frontend; autorización por rol, validaciones en cliente y servidor y mínimo privilegio.
6. **Calidad inclusiva.** Interfaz usable desde 360px, navegación por teclado, contraste, etiquetas de formulario, `alt` adecuado y estados de carga/error no destructivos.
7. **Supervisión y ética de IA.** El estudiante valida diffs, herramientas y licencias; ningún agente ejecuta modificaciones de alto riesgo sin aprobación explícita, ni inventa evidencias, datos o prompts históricos.
8. **Cambios acotados y reversibles.** Una tarea por vez, antes pruebas o criterios, después revisión; preservar configuración existente y proponer rollback para operaciones sensibles.

## Aplicación
Vinculante para `AGENTS.md`, los comandos OpenCode, las dos skills y cada spec. Si un criterio falla, detenerse y reportarlo antes de declarar el trabajo terminado.
