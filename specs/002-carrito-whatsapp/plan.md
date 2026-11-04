# Plan de implementación — Carrito local y finalización mediante WhatsApp

**Plan sin código**, condicionado a la revisión del estudiante, siguiendo la spec y los principios de la Constitución.

## Secuencia
1. **RF03:** Inspeccionar CarritoContext, persistencia local y CarritoFlotante; escribir tests de reducer/operaciones y errores de storage.
2. **RF04:** Revisar `enlaceWhatsApp`, estado operativo público, armado personalizado y formato de pedido; probar URL y codificación.

## Estrategia de calidad
1. Crear ejemplos y tests para criterios EARS antes de cambios funcionales.
2. Inspeccionar diffs mínimos y controles de acceso reales del lado servidor.
3. Comprobar estados de carga, mensajes de error y no regresión.
4. Ejecutar pruebas/build con permiso; anexar salida verificable.
5. Actualizar `verificacion.md` y realizar commit por tarea solo cuando el estudiante lo apruebe.

## Riesgos
Estado del frontend puede diferir de la BD de Supabase desplegada; la carpeta ZIP no exporta todas las funciones. No generar SQL ni cambiar RLS sin inspección/backup.

## Plan de reversión
Guardar cambios en Git; revertir únicamente los commits autorizados de la funcionalidad; para cambios servidor, recuperar copia anterior confirmada antes de publicar otra versión.
