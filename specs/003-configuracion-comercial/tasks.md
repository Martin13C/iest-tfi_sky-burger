# Tareas atómicas — Configuración del negocio y control operativo

> Estimación objetivo: **menos de 30 minutos por tarea**; si supera, subdividir. Casillas **pendientes de verificación**, aunque exista implementación equivalente en el código.

- [ ] **T01** · Documentar payload y schema de formulario (≤ 30 min). **Listo cuando:** Lista validada de campos y límites.
- [ ] **T02** · Preparar pruebas de horarios y validación (≤ 30 min). **Listo cuando:** Casos inválidos rechazados con mensajes.
- [ ] **T03** · Auditar acceso por rol en RPC/Edge Functions (≤ 30 min). **Listo cuando:** Pruebas negativas con usuario sin permisos.
- [ ] **T04** · Comprobar estados y publicación (≤ 30 min). **Listo cuando:** Vista pública coincide con resultado servidor.
- [ ] **T05** · Validar Instagram/Facebook/Maps (≤ 30 min). **Listo cuando:** Lectura/escritura comprobada o pendiente reportado.
- [ ] **T06** · Ejecutar tests/build y revisar diffs (≤ 30 min). **Listo cuando:** Resultados reales documentados.

## Método
Una tarea por conversación/sesión de OpenCode; usar `/verificar` antes del commit, revisar diff y actualizar memoria solo con hechos comprobados. La ausencia de un script `npm test` en el ZIP debe registrarse, no ocultarse.
