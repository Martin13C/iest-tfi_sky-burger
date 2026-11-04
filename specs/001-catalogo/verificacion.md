# Verificación de criterios — Catálogo público y gestión de productos

**Estado:** documento inicial. Sin ejecución automatizada registrada a la fecha de creación del kit; no marcar «cumple» por inspección parcial.

| RF | Criterio verificable | Evidencia requerida | Estado | Tipo de falla/nota |
|---|---|---|---|---|
| RF01 | Consulta pública de activos | Resultado del test + captura con elementos activos e inactivos | Prueba manual pendiente | No determinado |
| RF02 | Filtros y promociones vigentes | Prueba con fechas borde/selección de categorías | Prueba manual pendiente | No determinado |
| RF07 | CRUD de dueño y restricción de permisos | Prueba con rol dueño y anon, diff/RLS verificado | Prueba manual pendiente | No determinado |

## Pruebas planeadas
- [ ] Preparar tests automatizados principales.
- [ ] Ejecutar `npm test` **solo si el script fue creado**; registrar comando y salida.
- [ ] Ejecutar `npm run build`; registrar fecha/resultado real.
- [ ] Probar roles, errores de red y escenarios adversos.
- [ ] Control mobile 360px, accesibilidad y regresión.

## Registro de ejecución (completar)
| Fecha | Comando/acción | Resultado real | Evidencia/commit | Evaluación |
|---|---|---|---|---|
| Pendiente | — | No ejecutado en esta documentación | — | — |

## Diagnóstico
Ante un incumplimiento determinar **error de código**, **especificación incompleta** o **ambiente/datos insuficientes**, con plan de solución y prueba posterior.
