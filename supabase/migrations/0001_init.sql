-- ============================================================
-- ALT0VOLTA — Migración inicial
-- Ejecutar en Supabase: SQL Editor (o `supabase db push`)
-- ============================================================

-- ---------- CATEGORÍAS ----------
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

-- ---------- PRODUCTOS ----------
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text not null default '',
  price numeric(12,2) not null default 0,
  category_id uuid references categories(id) on delete set null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- VARIANTES: stock por color × talle ----------
-- Una fila por combinación. La constraint UNIQUE evita duplicados.
create table if not exists product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  color text not null,
  color_hex text not null default '#000000',
  size text not null,
  stock int not null default 0 check (stock >= 0),
  unique (product_id, color, size)
);
create index if not exists product_variants_product_idx on product_variants (product_id);

-- ---------- IMÁGENES DE PRODUCTO ----------
create table if not exists product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references products(id) on delete cascade,
  url text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists product_images_product_idx on product_images (product_id);

-- ---------- CONFIGURACIÓN DEL SITIO (logo, banner, redes, WhatsApp) ----------
create table if not exists site_settings (
  key text primary key,
  value text not null default ''
);

insert into site_settings (key, value) values
  ('site_name', 'Altovolta'),
  ('whatsapp_number', ''),
  ('instagram_url', ''),
  ('facebook_url', ''),
  ('tiktok_url', ''),
  ('email', ''),
  ('address', ''),
  ('about_text', ''),
  ('logo_url', ''),
  ('banner_url', '')
on conflict (key) do nothing;

-- ============================================================
-- ROW LEVEL SECURITY
--   anon  → solo lectura del catálogo
--   auth  → administración completa
-- ============================================================
alter table categories enable row level security;
alter table products enable row level security;
alter table product_variants enable row level security;
alter table product_images enable row level security;
alter table site_settings enable row level security;

-- Lectura pública (catálogo)
create policy "Public read categories" on categories for select using (true);
create policy "Public read products"   on products   for select using (true);
create policy "Public read variants"   on product_variants for select using (true);
create policy "Public read images"     on product_images  for select using (true);
create policy "Public read settings"   on site_settings   for select using (true);

-- Escritura solo para usuarios autenticados (admin)
create policy "Admin write categories" on categories
  for all to authenticated using (true) with check (true);
create policy "Admin write products" on products
  for all to authenticated using (true) with check (true);
create policy "Admin write variants" on product_variants
  for all to authenticated using (true) with check (true);
create policy "Admin write images" on product_images
  for all to authenticated using (true) with check (true);
create policy "Admin write settings" on site_settings
  for all to authenticated using (true) with check (true);

-- ============================================================
-- STORAGE BUCKETS
--   productos → fotos de prendas (público)
--   sitio     → logo y banners (público)
-- ============================================================
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('productos', 'productos', true, 5242880, array['image/jpeg','image/png','image/webp','image/avif']),
  ('sitio', 'sitio', true, 5242880, array['image/jpeg','image/png','image/webp','image/svg+xml'])
on conflict (id) do nothing;

-- Lectura pública de ambos buckets
create policy "Public read productos" on storage.objects
  for select using (bucket_id = 'productos');
create policy "Public read sitio" on storage.objects
  for select using (bucket_id = 'sitio');

-- Escritura solo para usuarios autenticados
create policy "Admin upload productos" on storage.objects
  for insert to authenticated with check (bucket_id = 'productos');
create policy "Admin update productos" on storage.objects
  for update to authenticated using (bucket_id = 'productos');
create policy "Admin delete productos" on storage.objects
  for delete to authenticated using (bucket_id = 'productos');
create policy "Admin upload sitio" on storage.objects
  for insert to authenticated with check (bucket_id = 'sitio');
create policy "Admin update sitio" on storage.objects
  for update to authenticated using (bucket_id = 'sitio');
create policy "Admin delete sitio" on storage.objects
  for delete to authenticated using (bucket_id = 'sitio');

-- ============================================================
-- TRIGGER: updated_at automático
-- ============================================================
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_updated_at on products;
create trigger products_updated_at
  before update on products
  for each row execute function set_updated_at();
