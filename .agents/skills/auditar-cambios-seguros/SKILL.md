---
name: auditar-cambios-seguros
description: Revisión previa y posterior de acciones del agente para no romper Sky Burger ni exponer secretos.
---
# Skill propia — Auditar cambios seguros

## Cuándo usar
Antes de permitir a OpenCode editar JS/JSX/CSS, instalar paquetes, invocar comandos Git o proponer cambios de Supabase.

## Entradas
`AGENTS.md`, `docs/HARNES.md`, `docs/10-SEGURIDAD.md`, `memory.md`, archivo y objetivo RF, `git status`/diff si el estudiante autoriza su lectura.

## Checklist previo
- ¿Hay spec/requisito y alcance de archivos explícito?
- ¿La tarea requiere datos reales o una operación privilegiada?
- ¿Es bajo/medio/alto riesgo? Mostrar consecuencias y plan de reversión.
- ¿Podría sobrescribir cambios locales o secretos? No tocar sin confirmación.
- ¿Hay alternativas de solo lectura, tests o cambios mínimos?

## Checklist posterior
- Lista exacta de archivos modificados y por qué.
- Verificar que ningún archivo extra fue alterado; comparar diffs y `git diff --check` **si está autorizado**.
- Buscar posibles secretos sin imprimir sus valores; proteger `.env*`.
- Ejecutar **solo con permiso** pruebas/build; adjuntar salida real y regresiones pendientes.
- Registrar conclusión HONESTA: listo, parcial o bloqueado.

## Bloqueos innegociables sin aprobación específica
`DROP`, `TRUNCATE`, `DELETE` masivos, `git reset --hard`, push forzado, eliminación de usuarios reales, cambios RLS/políticas, publicación, secrets, dependencias.

## Resultado
Plan de cambio + nivel de riesgo + tests + recuperación + solicitud de confirmación. **Un Markdown no controla las herramientas por sí solo**: configurar controles nativos de OpenCode para requerir autorización.
