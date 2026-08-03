# Altovolta — Tienda de ropa con pedidos por WhatsApp

E-commerce de catálogo para un local de ropa. Los pedidos no se pagan online: el carrito genera
un mensaje detallado y lo envía por **WhatsApp** (`wa.me`) al número del local.

## Stack

- **Next.js 16** (App Router) + TypeScript + Tailwind CSS
- **Supabase** (PostgreSQL + Auth + Storage) para base de datos, login del admin y fotos
- **Zustand** con persistencia en `localStorage` para el carrito
- Server Actions para todo el CRUD del panel de administración

## Estructura

```
supabase/migrations/0001_init.sql   # Esquema: tablas, RLS y buckets de storage
scripts/seed.ts                     # Crea admin + datos de ejemplo (opcional)
src/
├── proxy.ts                        # Renovación de sesión + protección de /admin (Next 16)
├── app/
│   ├── (tienda)/                   # Catálogo público: home, producto/[slug], contacto, carrito
│   ├── admin/                      # Panel: login, resumen, productos, categorías, configuración
│   └── layout.tsx                  # Layout raíz
├── components/                     # store/ (público) y admin/
├── lib/                            # supabase clients, auth, utils, whatsapp, site
└── stores/cart.ts                  # Carrito Zustand
```

## Base de datos

- `categories` — categorías del catálogo
- `products` — prendas (precio, descripción, activo)
- `product_variants` — **stock por color × talle** (una fila por combinación, `UNIQUE(product_id, color, size)`)
- `product_images` — fotos subidas a Storage
- `site_settings` — logo, banner, WhatsApp, redes, contacto
- Buckets públicos: `productos` (fotos) y `sitio` (logo/banner)

RLS: lectura pública del catálogo; escritura solo para usuarios autenticados (admin).

## Puesta en marcha

1. Creá un proyecto en [Supabase](https://supabase.com).
2. Ejecutá el contenido de `supabase/migrations/0001_init.sql` en **SQL Editor**.
3. Creá el usuario admin: **Authentication → Users → Add user** (email + contraseña).
4. Copiá `.env.local.example` a `.env.local` y completá la URL y la anon key
   (Supabase → Project Settings → API).
5. Instalá y levantá:

```bash
npm install
npm run dev
```

- Tienda: http://localhost:3000
- Panel admin: http://localhost:3000/admin (protegido por login)

### Datos de ejemplo (opcional)

```bash
set SUPABASE_SERVICE_ROLE_KEY=TU_SERVICE_ROLE_KEY   # solo en local, nunca en producción
npm run seed
```

### Configurar el número de WhatsApp

Entrá a `/admin/configuracion` y completá **WhatsApp (número)** en formato internacional
sin `+`, p. ej. `5491123456789`. Sin este número, el botón del carrito avisa que falta configurar.

## Cómo funciona el checkout

1. El cliente elige **color, talle y cantidad** (obligatorio) y agrega al carrito.
2. En `/carrito` se arma el mensaje: nombre de cada prenda, talle exacto, color exacto,
   cantidad por ítem y **total** de la compra.
3. "Enviar pedido por WhatsApp" abre `https://wa.me/<número>?text=<mensaje codificado>`.
4. El local confirma el pedido, el pago y el envío directamente en el chat.

## Deploy

Proyecto compatible con Vercel (una variable: la URL y la anon key son públicas por diseño;
las políticas RLS protegen los datos).
