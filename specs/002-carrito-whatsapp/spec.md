# Spec — Carrito local y finalización mediante WhatsApp

**Identificador:** 002-carrito-whatsapp  
**Requisitos asociados:** RF03, RF04  
**Tipo:** reconstrucción documental del alcance del producto Sky Burger; no afirmar que precedió cronológicamente al código sin evidencia.

## Contexto
Como cliente quiero armar una selección, corregir cantidades y solicitar el pedido por WhatsApp sin tener que pagar en la página.

## Historias de usuario
Como cliente quiero armar una selección, corregir cantidades y solicitar el pedido por WhatsApp sin tener que pagar en la página.

## Requisitos verificables en formato EARS
- **002-E1 (EARS):** Cuando el visitante agregue un producto disponible, el sistema DEBERÁ incorporarlo al carrito sin duplicar ítems equivalentes innecesariamente.
- **002-E2 (EARS):** Cuando el visitante cambie cantidades o quite un ítem, el sistema DEBERÁ recalcular el total y reflejarlo en pantalla.
- **002-E3 (EARS):** Mientras el navegador conserve su almacenamiento local, el sistema DEBERÁ recuperar los ítems del carrito tras recargar la página.
- **002-E4 (EARS):** Si el almacenamiento contiene JSON corrupto o datos incoherentes, el sistema DEBERÁ recuperarse sin bloquear el sitio ni mostrar totales `NaN`.
- **002-E5 (EARS):** Cuando el visitante decida continuar por WhatsApp, el sistema DEBERÁ construir un enlace con mensaje legible y respetar el número comercial configurado.
- **002-E6 (EARS):** Si falta WhatsApp o no se reciben pedidos, el sistema DEBERÁ evitar prometer un pedido confirmado y mostrar comportamiento apropiado.

## Casos límite
- Repetir producto varias veces
- Cantidad 0, negativa, inválida o excesiva
- localStorage deshabilitado
- Cambiar de pestaña mientras se edita
- Producto ya no disponible
- WhatsApp vacío o inválido
- Carrito sin ítems
- Texto con tildes y caracteres especiales

## Fuera de alcance
- Cobro online
- Creación automática de órdenes en Supabase
- Confirmación de entrega
- Garantía de recepción de mensaje en WhatsApp

## Criterios de finalización (Definition of Done)
- Cada EARS tiene caso de prueba o revisión manual explícita.
- Se comprueba con datos reales o fixtures identificados; no se inventan resultados.
- No se alteran permisos/BD salvo plan y aprobación del estudiante.
- Tests principales y build pasan realmente, o se registra el bloqueo.
- UI revisada en 360px, teclado, cargas, errores y texto alternativo.
- Cambios de especificación registrados antes de implementación de cambios futuros.
