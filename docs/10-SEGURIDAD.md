# 10 — Seguridad del proyecto

## Autenticación y autorización
- Supabase Auth gestiona credenciales; `perfiles.rol_id` referencia roles. Admin `1`, dueño `2` en la BD consultada durante desarrollo.
- Rutas protegidas React sirven a UX: **RLS, RPC y Edge Functions deben aplicar permisos reales**.
- No usar `rol_codigo` en `perfiles` (no existe); comprobar esquema antes de escribir consultas.
- Acciones administrativas críticas (dueño: contraseña/eliminación/bloqueo) solo por servidor con JWT verificado y rol comprobado.

## Secretos y frontend
- Usar `VITE_SUPABASE_URL` y `VITE_SUPABASE_PUBLISHABLE_KEY` para cliente.
- No poner `SERVICE_ROLE_KEY`, API keys privadas o secretos de Edge Functions en variables `VITE_`, Git o prompts.
- Mantener `.env*` fuera de control de versiones y agregar `.env.example` sin valores reales solo si se autoriza.
- Validar `FRONTEND_ORIGINS` para CORS en Edge Functions; CORS **no reemplaza** autenticación ni RLS.

## Datos, archivos y riesgos
- Entradas validadas con Zod y servidor; enlaces externos de Maps/redes deben validarse para evitar redirecciones peligrosas.
- Storage: restricciones de MIME/tamaño, rutas e identidad; no confundir URL pública de imagen con permiso de escritura.
- Antes de migración: backup, inspección de esquema, plan de rollback y aprobación humana.
- No borrar cuentas reales durante pruebas; usar entornos o usuarios de prueba y documentar límites.
- Contenido del carrito en `localStorage`: no almacenar PII ni métodos de pago.

## Comprobaciones pendientes
Pruebas negativas de RLS/roles, revisión del flujo de eliminación de dueño y sesiones existentes, auditoría de dependencias, escaneo de secretos y verificación de configuración Vercel.
