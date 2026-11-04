# Spec — Catálogo público y gestión de productos

**Identificador:** 001-catalogo  
**Requisitos asociados:** RF01, RF02, RF07  
**Tipo:** reconstrucción documental del alcance del producto Sky Burger; no afirmar que precedió cronológicamente al código sin evidencia.

## Contexto
Como visitante quiero conocer hamburguesas, precios y promociones válidas para elegir sin información desactualizada. Como dueño quiero mantener esos datos.

## Historias de usuario
Como visitante quiero conocer hamburguesas, precios y promociones válidas para elegir sin información desactualizada. Como dueño quiero mantener esos datos.

## Requisitos verificables en formato EARS
- **001-E1 (EARS):** Cuando se consulte `/hamburguesas`, el sistema DEBERÁ mostrar exclusivamente hamburguesas con `activo = true`, conservando nombre, precio, disponibilidad y ruta de imagen.
- **001-E2 (EARS):** Cuando se seleccione una categoría existente, el sistema DEBERÁ filtrar las hamburguesas del listado sin alterar la base de datos.
- **001-E3 (EARS):** Cuando se consulte `/promociones`, el sistema DEBERÁ mostrar solamente promociones activas dentro de sus fechas de vigencia, si están definidas.
- **001-E4 (EARS):** Si una hamburguesa está no disponible, el sistema DEBERÁ indicarlo y bloquear la acción de agregado al carrito.
- **001-E5 (EARS):** Cuando el dueño autenticado guarde un producto válido, el sistema DEBERÁ persistirlo mediante el servicio autorizado y actualizar la consulta afectada.
- **001-E6 (EARS):** Si ocurre un error de red o no hay productos, el sistema DEBERÁ mostrar un estado claro sin presentar datos inventados.

## Casos límite
- Categoría vacía o desconocida
- Promoción sin inicio/fin o fuera de vigencia
- Imagen rota o no cargada
- Precio 0 o dato inválido
- Usuario no autorizado intenta gestionar catálogo
- Producto pasa a inactivo mientras figura en carrito

## Fuera de alcance
- Procesar pagos
- Confirmar ventas
- Generar recomendaciones IA
- Entrega y stock real por sucursal

## Criterios de finalización (Definition of Done)
- Cada EARS tiene caso de prueba o revisión manual explícita.
- Se comprueba con datos reales o fixtures identificados; no se inventan resultados.
- No se alteran permisos/BD salvo plan y aprobación del estudiante.
- Tests principales y build pasan realmente, o se registra el bloqueo.
- UI revisada en 360px, teclado, cargas, errores y texto alternativo.
- Cambios de especificación registrados antes de implementación de cambios futuros.
