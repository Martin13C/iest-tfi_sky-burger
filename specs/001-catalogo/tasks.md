# Tareas atómicas — Catálogo público y gestión de productos

> Estimación objetivo: **menos de 30 minutos por tarea**; si supera, subdividir. Casillas **pendientes de verificación**, aunque exista implementación equivalente en el código.

- [ ] **T01** · Identificar contratos y datos de prueba de catálogo (≤ 30 min). **Listo cuando:** Matriz de nombres de campos y casos límite revisada.
- [ ] **T02** · Crear tests para filtros y visibilidad (≤ 30 min). **Listo cuando:** Tests escritos para activos/categorías/promociones.
- [ ] **T03** · Revisar estados vacío/error y disponibilidad (≤ 30 min). **Listo cuando:** UI de no disponible y vacíos comprobados.
- [ ] **T04** · Verificar gestión autenticada y rechazo anónimo (≤ 30 min). **Listo cuando:** Pruebas positivas y negativas documentadas.
- [ ] **T05** · Ejecutar test/build y revisar diff (≤ 30 min). **Listo cuando:** Resultados reales registrados en verificacion.md.

## Método
Una tarea por conversación/sesión de OpenCode; usar `/verificar` antes del commit, revisar diff y actualizar memoria solo con hechos comprobados. La ausencia de un script `npm test` en el ZIP debe registrarse, no ocultarse.
