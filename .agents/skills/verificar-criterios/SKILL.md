---
name: verificar-criterios
description: Auditoría de criterios EARS y evidencia real por requisito funcional de Sky Burger.
---
# Skill propia — Verificar criterios

## Objetivo
Confrontar una spec TP4 contra el código y evidencia comprobable sin modificar el proyecto.

## Activación
Cuando el estudiante pida «/verificar», «validar requisito», «¿cumple la spec?» o cierre de tarea.

## Entradas obligatorias
`AGENTS.md`, `docs/CONSTITUCION.md`, `docs/02-REQUERIMIENTOS.md`, `specs/NNN-*/spec.md`, `tasks.md`, `verificacion.md` y fuente pertinente.

## Procedimiento
1. Identificar requisitos EARS, RF y decisiones de clarificación.
2. Localizar archivos concretos que implementan cada criterio.
3. Distinguir inspección de código, test automatizado ejecutado y prueba manual documentada.
4. Para cada criterio marcar **CUMPLE / NO CUMPLE / NO COMPROBADO** (no inferir «cumple» de la existencia de archivo).
5. Registrar evidencia (ruta/línea, comando, resultado literal y fecha), caso límite y tipo de brecha (código/spec/entorno).
6. Proponer tests y regresiones; pedir autorización antes de ejecutar comandos o escribir `verificacion.md`.
7. Resumir qué puede defender el estudiante y qué queda pendiente.

## Salida estructurada
| RF/EARS | Criterio | Evidencia | Estado | Brecha / próxima prueba |
|---|---|---|---|---|

## Restricciones
No SQL de escritura, no cambios de backend, no despliegues, no logs secretos, no afirmaciones inventadas. Reportar si `package.json` carece de script `test` y no suponer pruebas verdes.
