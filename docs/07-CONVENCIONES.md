# 07 — Convenciones y estilo de desarrollo

- React: **componentes y archivos JSX en PascalCase** (`TarjetaCatalogo.jsx`, `GestionConfiguracion.jsx`), como el código real.
- Hooks: `useCamelCase.js`; servicios/utilitarios JavaScript: `camelCase.js` según convención observada. No renombrar masivamente archivos existentes por una regla antigua de TP3.
- Variables/funciones: camelCase; constantes: UPPER_SNAKE_CASE cuando son invariantes.
- Identificadores de base de datos: snake_case (ej. `rol_id`); nombres de funciones RPC deben respetarse exactamente.
- Textos para usuario, documentación y mensajes: español argentino. APIs externas y librerías conservan sus nombres originales.
- Cada componente con responsabilidad clara; datos remotos en hooks/servicios, seguridad servidor, validación Zod.
- No introducir dependencias nuevas para resolver cuestiones simples sin justificar.
- CSS: respetar tokens de marca; evitar colores hex repetidos nuevos.
- Usar `.env.local` para configuración local (no subir); prefijo `VITE_` solo para datos públicos.
- Commits pequeños y descriptivos: `feat: ...`, `fix: ...`, `docs: ...`, `test: ...`, `refactor: ...`, `chore: ...`.
- **Antes de commit:** revisar `git diff`, ejecutar pruebas definidas (si existen), `npm run build` y registrar evidencia real. El agente solicita permiso antes de actuar.
- No reformatear archivos ajenos al cambio ni alterar código aprobado sin motivo.
