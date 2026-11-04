# Verificación de criterios — Configuración del negocio y control operativo

**Estado:** documento inicial. Sin ejecución automatizada registrada a la fecha de creación del kit; no marcar «cumple» por inspección parcial.

| RF | Criterio verificable | Evidencia requerida | Estado | Tipo de falla/nota |
|---|---|---|---|---|
| RF05 | Guardar datos válidos y rechazar inválidos | Test RHF/Zod, RPC retorno, recarga | Prueba manual pendiente | No determinado |
| RF06 | Rechazo de rol sin permiso | Resultado servidor, no solo ruta React | Prueba manual pendiente | No determinado |
| RF08 | Horarios/estado/cierre | Casos de horarios y cambio operativo | Prueba manual pendiente | No determinado |
| RF09 | Contactos completos y seguros | URL mostrada/oculta + persistencia Facebook verificada | Prueba manual pendiente | No determinado |

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
