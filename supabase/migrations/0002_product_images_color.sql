-- Fotos por color: cada imagen puede pertenecer a un color del producto.
-- color NULL = foto general (se muestra cuando no hay foto específica del color elegido).
alter table product_images add column if not exists color text;

create index if not exists product_images_color_idx on product_images (product_id, color);
