-- Ofertas y destacados
alter table products add column if not exists old_price numeric;
alter table products add column if not exists featured boolean not null default false;
