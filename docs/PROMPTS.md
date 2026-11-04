# Registro de prompts y errores IA — Sky Burger

> **Revisión posterior:** este archivo organiza ejemplos de prompts de trabajo y eventos técnicos conocidos. No atribuye las redacciones siguientes a prompts originales guardados; para la evidencia histórica del TP4, el estudiante debe adjuntar conversaciones, fechas, capturas/commits.

## Prompts sugeridos para OpenCode (no históricos)
1. **Spec:** «Leé AGENTS.md, CONSTITUCION.md y specs/001-catalogo/spec.md. Modo lectura. Detectá supuestos y proponé criterios EARS sin escribir código».
2. **Clarificación:** «Revisá casos límite de productos no disponibles y promociones fuera de fecha. Mostrá riesgo, decisión requerida y test sugerido».
3. **Implementación:** «Implementá exclusivamente la tarea TNN aprobada; mostrárme diff, tests y rollback. No tocar SQL, RLS ni funciones ajenas».
4. **Verificación:** «Para cada criterio de la spec clasificá cumple/no cumple/no comprobado; citá archivo/test/resultado; no inventes evidencia».

## Tres incidentes de asistencia IA conocidos por conversaciones de desarrollo
| Caso | Error técnico | Detección | Corrección comprobada / estado | Evidencia a adjuntar |
|---|---|---|---|---|
| IA-01 | Consulta directa a `perfiles.rol_codigo`, columna inexistente | Log Edge Function código PostgreSQL `42703` | Adaptación a `perfiles.rol_id`; usuario confirmó funcionamiento | Captura log/commit/versionado |
| IA-02 | Propuesta RPC `ver_dueno()` que no existía | Respuesta HTTP 404 al invocarla | Acción `ver_dueno` por función `gestionar-dueno`; usuario confirmó resolución final del flujo | Network y código de función |
| IA-03 | Desajuste del secreto CORS: `FRONTEND_ORIGIN` vs `FRONTEND_ORIGINS` | OPTIONS 403; el usuario confirmó secreto plural | Código adaptado a `FRONTEND_ORIGINS`; CORS dejó de ser el fallo antes del 500 de columna | Captura configuración sin mostrar valores + logs |

**Regla ética:** narrar que estos casos se documentaron posteriormente; no fabricar capturas históricas, prompts exactos ni commits faltantes. Los resultados de pruebas actuales deben verificarse otra vez.

## Registro nuevo (completar al usar OpenCode)
| Fecha | Tarea/RF | Prompt exacto | Modelo/plan | Archivos | Revisión y prueba | Commit |
|---|---|---|---|---|---|---|
| Pendiente | — | — | — | — | — | — |
