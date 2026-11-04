# Arnés operativo de OpenCode — Sky Burger

## Finalidad
Prevenir que la IA altere código, permisos, base de datos o entregables sin control. **No es sandbox ni ACL:** debe acompañarse de permisos efectivos de OpenCode, aislamiento de secretos, backups y revisión humana.

## Flujo de aprobación
1. **Lectura:** identificar RF y spec activa, inspeccionar únicamente archivos relevantes, informar supuestos.
2. **Propuesta:** plan con archivos exactos, riesgo, tests y rollback. Pedir autorización de edición.
3. **Implementación controlada:** un archivo o una tarea a la vez, sin operaciones externas implícitas.
4. **Verificación:** comparar diff, tests aplicables, build, checklist de rol/accesibilidad y regresión; registrar fallos.
5. **Cierre:** decisión del estudiante, commit realizado por estudiante/agente con permiso separado y memoria actualizada solo tras comprobar.

## Matriz de permisos sugerida para configurar en OpenCode
| Acción | Estado de partida | Necesidad |
|---|---|---|
| Leer código y Markdown sin secretos | Permitido | Menor riesgo |
| Escribir Markdown de specs/docs | Preguntar | Revisión del estudiante |
| Editar `src/` | Preguntar | Diff y pruebas |
| Instalar/actualizar dependencias | Preguntar | Reproducibilidad y licencias |
| Ejecutar tests/build | Preguntar | Puede alterar artefactos locales |
| Ejecutar shell, git commit | Preguntar | Alcance explícito |
| `git push`, despliegues | Denegar por defecto | Acción externa |
| Migraciones/SQL escrituras/Edge Functions | Denegar por defecto | Riesgo de datos/privilegios |
| Borrar datos, reset duro, exponer secretos | Denegar | Irreversible o sensible |

## Verificaciones automáticas/semiautomáticas
- Comprobar `git diff --check`, `git status --short` y alcance de archivos editados.
- Si existe script `test`, correr pruebas adecuadas; si no existe, reportar **sin pruebas configuradas**, no fabricarlas.
- `npm run build` previa autorización; guardar salida real, no presumir éxito.
- Revisar que no se agreguen `.env*`, credenciales, JWT, `service_role`, datos personales, ni URLs privadas.
- Revisar que `configuracion_sitio`, funciones RPC y Edge Functions no cambien salvo autorización explícita.
- Revisar que los textos y assets sigan cumpliendo docs de marca y accesibilidad.

## Prompt de arranque sugerido al agente
> Leé AGENTS.md, docs/CONSTITUCION.md, memory.md y la spec activa. Entrá en modo solo lectura. Identificá archivos afectados, riesgos y pruebas; NO ejecutes comandos ni edites código hasta que apruebe el plan. Implementá de a una tarea y mostrámela con diff.

## Interacción de comandos
`/spec` produce o revisa spec; `/clarificar` evalúa casos ambiguos; `/verificar` constata evidencias; `/cambio` prepara una modificación trazable. No deben afirmar que un trabajo histórico sucedió si solo se reconstruyó.
