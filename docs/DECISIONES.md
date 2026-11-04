# Registro de decisiones técnicas (ADR resumido)

| ID | Decisión | Fundamento | Impacto / verificación |
|---|---|---|---|
| ADR-001 | Vite en lugar de Next.js | Sitio React SPA con backend Supabase existente | Documentar tradeoff SEO/SSR y justificar ante TP4 |
| ADR-002 | Supabase en vez de backend MongoDB original | Backend gestionado y permisos de BD | Mantener controles RLS/RPC y secretos en servidor |
| ADR-003 | Carrito en localStorage, pedido por WhatsApp | Sin sistema de cobro/pedidos persistidos | No afirmar ventas confirmadas ni facturación |
| ADR-004 | OpenCode con arnés de aprobaciones | Control humano de acciones IA | Documentar diffs, permisos y tests reales |
| ADR-005 | Umami fuera de v1 | Plan gratuito no aportó API Key para dashboard embebido | Estadísticas como futuro; no mostrar datos ficticios |
| ADR-006 | Archivos multimedia de marca separados de Storage | Recursos fijos versionados; catálogo variable en Storage | Comprobar licencias, peso y rutas |
| ADR-007 | Facebook pendiente de capa servidor | Formulario/Zod sin RPC/columna confirmada no persiste | Auditar esquema antes de modificar |

## Decisiones pendientes del estudiante
Hosting/domain definitivo, contenido editorial de piezas multimedia, framework de pruebas, validación del flujo de borrado de cuentas, licencia final de video/voz/música.
