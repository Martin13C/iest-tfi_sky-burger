# Plan de implementación — Configuración del negocio y control operativo

**Plan sin código**, condicionado a la revisión del estudiante, siguiendo la spec y los principios de la Constitución.

## Secuencia
1. **RF05:** Revisar `FormularioDatosLocal`, esquema Zod, useGestionConfiguracion y contrato `actualizar_datos_comerciales`.
2. **RF06:** Verificar `mi_perfil`, RLS y autorización real en RPC; rutas UI solo apoyan experiencia, no seguridad.
3. **RF08:** Verificar `estado_local_publico`, cambios en pedido/cierre y la función de publicación.
4. **RF09:** Revisar Contacto/PublicLayout, normalización de Instagram/Facebook/Maps y persistencia concreta en backend antes de tocar SQL.

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
