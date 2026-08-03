-- La tabla products en la DB real quedó con un esquema draft (columnas legacy:
-- sizes[], colors[], stock, images[], featured) y sin updated_at, porque el
-- `create table if not exists` de 0001 la saltó por existir.
-- Alineamos la tabla al esquema actual y aseguramos el trigger de updated_at.

alter table products add column if not exists updated_at timestamptz not null default now();

-- Columnas legacy del draft, ya sin uso (el código usa product_variants y product_images)
alter table products drop column if exists sizes;
alter table products drop column if exists colors;
alter table products drop column if exists stock;
alter table products drop column if exists images;
alter table products drop column if exists featured;

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_updated_at on products;
create trigger products_updated_at
  before update on products
  for each row execute function set_updated_at();
