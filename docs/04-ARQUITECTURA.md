# 04 — Arquitectura real y prevista

## Capas existentes
- `src/pages/public/`: Inicio, Hamburguesas, Promociones, Galería, Nosotros, Contacto y armado personalizado.
- `src/pages/dashboard/`: gestión comercial compartida.
- `src/pages/admin/` y `src/pages/dueno/`: paneles según rol.
- `src/components/`: carrito, catálogo, formularios, componentes comunes.
- `src/context/`: AuthContext y CarritoContext.
- `src/hooks/`: hooks de consulta y mutación.
- `src/services/`: contratos Supabase, no colocar secretos aquí.
- `src/schemas/`: esquemas Zod.
- `src/routes/AppRoutes.jsx`: enrutamiento, guardas UI (sin reemplazar políticas servidor).
- `src/config/supabaseClient.js`: inicialización con claves públicas.
- `src/index.css`: tokens de marca.

## Árbol documental sugerido (complementa al código existente)
```text
iest-tfi_sky-burger/
├── AGENTS.md                    # reglas OpenCode
├── memory.md
├── README.md
├── .gitignore                   # contenido entregado aparte
├── docs/                        # TP3 actualizado + TP4
├── specs/
│   ├── 001-catalogo/
│   ├── 002-carrito-whatsapp/
│   └── 003-configuracion-comercial/
├── .opencode/commands/
├── .agents/skills/
├── src/                         # código React actual
├── public/marca/                # logo, hero y assets estáticos
├── public/media/                # opcionales, imágenes editoriales
├── multimedia/                  # entregables y fichas IA
└── tests/                       # a crear con OpenCode y supervisión
```

## Flujo funcional
Visitante → React/UI → hooks → servicios → Supabase/PostgreSQL o Storage. Dueño/admin → Supabase Auth → comprobación de rol en servidor mediante RPC/RLS/Edge Functions → operaciones permitidas. Carrito usa estado local y `localStorage`; WhatsApp es enlace externo, no registro de venta.

## Pendientes
Verificar assets de `public/marca/`, comprobar RPC live sin publicar secretos, registrar Edge Functions reales fuera del frontend cuando el alumno las exporte/autoricе. Documentación no debe suponer que el ZIP contiene backend desplegado.
