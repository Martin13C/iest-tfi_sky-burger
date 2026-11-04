# 08 — Tareas y plan funcional (base para SDD)

> Casillas son **estado de validación del TP4**, no niegan que el código exista. No marcar como completado hasta contrastar test, diff o demostración.

## 001 — Catálogo y promociones (RF01, RF02, RF07)
- [ ] Revisar contratos de datos y visibilidad de elementos activos.
- [ ] Documentar casos límite: catálogo vacío, promoción vencida, falta de imagen, producto no disponible.
- [ ] Escribir tests unitarios y de flujos principales.
- [ ] Revisar integración pública/gestión por dueño y permisos.
- [ ] Ejecutar tests/build y documentar resultados reales.

## 002 — Carrito y WhatsApp (RF03, RF04)
- [ ] Verificar altas, cambios de cantidades y eliminación.
- [ ] Verificar persistencia en `localStorage` y recuperación de datos inválidos.
- [ ] Probar total calculado, disponibilidad y mensaje de WhatsApp.
- [ ] Testear armado personalizado sin simular venta confirmada.
- [ ] Documentar ejecución e incidencias.

## 003 — Configuración comercial (RF05, RF06, RF08, RF09)
- [ ] Comprobar lectura privada/publica y formulario validado.
- [ ] Verificar horarios, cierre manual y pedidos habilitados.
- [ ] Probar permisos dueño/admin, y rechazo de visitantes sin sesión.
- [ ] Verificar WhatsApp, Instagram, Facebook, mapa y dirección; para Facebook controlar RPC y tabla reales.
- [ ] Ejecutar tests y guardar evidencia.

## Publicación y calidad TP4
- [ ] Instalar/configurar framework de tests (con autorización).
- [ ] Reparar ruta SPA y cargar assets estáticos de marca faltantes.
- [ ] Validar variables env Vercel, Supabase Auth redirects y CORS.
- [ ] Ejecutar Lighthouse >80 en cada categoría; registrar cifras reales.
- [ ] Integrar 8 imágenes IA, 2 mockups, vídeo promocional y leyendas.
- [ ] Crear 3 gráficos con datos reales, infografía SDD, fichas IA.
- [ ] Documentar prompts/herramientas/errores reales, defensa e informe.

## Fuera de alcance v1
Analítica Umami en admin, pagos online, estadísticas de ventas no verificadas, delivery propio.
