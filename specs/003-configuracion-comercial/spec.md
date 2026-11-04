# Spec — Configuración del negocio y control operativo

**Identificador:** 003-configuracion-comercial  
**Requisitos asociados:** RF05, RF06, RF08, RF09  
**Tipo:** reconstrucción documental del alcance del producto Sky Burger; no afirmar que precedió cronológicamente al código sin evidencia.

## Contexto
Como dueño quiero modificar información comercial, horarios y estado operativo con una interfaz clara; como administrador quiero aplicar restricciones sensibles.

## Historias de usuario
Como dueño quiero modificar información comercial, horarios y estado operativo con una interfaz clara; como administrador quiero aplicar restricciones sensibles.

## Requisitos verificables en formato EARS
- **003-E1 (EARS):** Cuando un dueño autenticado envíe datos comerciales válidos, el sistema DEBERÁ validar la entrada y solicitar persistencia mediante RPC autorizada.
- **003-E2 (EARS):** Cuando el dato sea inválido, el sistema DEBERÁ mostrar error junto al campo y NO persistir el formulario.
- **003-E3 (EARS):** Cuando se editen horarios, el sistema DEBERÁ rechazar intervalos incorrectos y solapamientos; el estado de atención utilizará la lógica pública del servidor.
- **003-E4 (EARS):** Si un visitante sin autorización intenta cambiar configuración, el servidor DEBERÁ denegar la operación aunque el frontend sea manipulado.
- **003-E5 (EARS):** Cuando cambien cierre manual o recepción de pedidos, el sistema DEBERÁ solicitar confirmación y consultar el estado resultante.
- **003-E6 (EARS):** Cuando una red esté configurada con URL válida, la web pública DEBERÁ mostrar su enlace; si está vacía, DEBERÁ ocultarla.
- **003-E7 (EARS):** Si se incorpora Facebook, el sistema DEBERÁ incluirlo en validación, RPC de escritura, función de lectura y vista pública; solo se considerará completo tras comprobar los cuatro puntos.

## Casos límite
- Horario con cierre anterior a apertura
- Turnos superpuestos
- WhatsApp inválido
- Facebook en esquema Zod pero ausente en SQL/RPC
- Cuenta bloqueada
- Se pierde foco del navegador con formulario sin guardar
- Origen CORS incorrecto
- Cambio de zona horaria y horario público

## Fuera de alcance
- Cambiar RLS sin auditoría
- Crear cuentas adicionales de dueño
- Integrar Umami API
- Pagos en línea

## Criterios de finalización (Definition of Done)
- Cada EARS tiene caso de prueba o revisión manual explícita.
- Se comprueba con datos reales o fixtures identificados; no se inventan resultados.
- No se alteran permisos/BD salvo plan y aprobación del estudiante.
- Tests principales y build pasan realmente, o se registra el bloqueo.
- UI revisada en 360px, teclado, cargas, errores y texto alternativo.
- Cambios de especificación registrados antes de implementación de cambios futuros.
