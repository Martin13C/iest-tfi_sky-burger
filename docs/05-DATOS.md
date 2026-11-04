# 05 — Modelo de datos y flujos

> Inventario basado en el frontend enviado; nombres/campos definitivos de BD deben contrastarse con SQL de solo lectura antes de generar migraciones.

| Recurso | Campos usados por frontend | Uso |
|---|---|---|
| `hamburguesas` | id UUID, nombre, slug, descripcion, categoria, precio, moneda, imagen_ruta, activo, disponible, destacado, orden | Catálogo |
| `promociones` | id, titulo, descripcion, precio, moneda, imagen_ruta, activa, disponible, inicio, fin, orden | Ofertas con fechas |
| `galeria` | id, titulo, descripcion, imagen_ruta, activo, orden | Imágenes públicas |
| `perfiles` | id, rol_id, nombre, bloqueado, creado_en, actualizado_en | Perfiles de usuarios Auth |
| `roles` | id, codigo, nombre, descripcion | Administrador (1), dueño (2) |
| `configuracion_sitio` | datos comerciales, operación, horarios, entre otros (estructura exacta debe verificarse) | Estado del negocio |

## Interfaces RPC que consume la aplicación
- `datos_local_publicos()` entrega información visible del comercio.
- `estado_publicacion()`, `estado_local_publico()` controlan visualización/estado.
- `mi_perfil()`, `configuracion_privada()`, `actualizar_datos_comerciales(p_datos)` y otras funciones restringidas sirven al panel.
- `obtener_google_maps_url()` y `actualizar_google_maps_url(p_url)` vinculan el mapa.

## Protección
Usuarios y contraseñas en Supabase Auth; UI no guarda passwords en tabla de perfiles; permisos operativos dependen de RLS/RPC/función y rol validado del lado servidor. No cambiar el esquema con IA sin revisión y backup.

## Carrito y pedidos
`skyburger_carrito_v1` en `localStorage`; no constituye tabla de ventas. El enlace WhatsApp precompleta un mensaje que el cliente todavía puede modificar o no enviar.

## Facebook
Campo incorporado a vistas/forms durante el desarrollo, pero persistencia en `configuracion_sitio`/RPC debe **verificarse**: no presentar como hecho hasta obtener definición SQL y test de lectura/escritura.
