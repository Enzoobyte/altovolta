import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { formatPrice, firstOrNull } from '@/lib/utils'
import { ProductBuyer } from '@/components/store/product-buyer'

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await props.params
  const supabase = await createClient()
  const { data: product } = await supabase
    .from('products')
    .select('name, description')
    .eq('slug', slug)
    .eq('active', true)
    .maybeSingle()

  if (!product) return { title: 'Producto no encontrado' }
  return { title: product.name, description: product.description }
}

export default async function ProductPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select(
      'id, name, slug, description, price, category:categories(name), created_at, updated_at'
    )
    .eq('slug', slug)
    .eq('active', true)
    .maybeSingle()

  if (!product) notFound()

  const category = firstOrNull(product.category)

  const [{ data: variants }, { data: images }] = await Promise.all([
    supabase
      .from('product_variants')
      .select('id, product_id, color, color_hex, size, stock')
      .eq('product_id', product.id)
      .order('color', { ascending: true }),
    supabase
      .from('product_images')
      .select('id, product_id, url, sort_order, created_at')
      .eq('product_id', product.id)
      .order('sort_order', { ascending: true }),
  ])

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
      <div className="grid gap-10 lg:grid-cols-2">
        {/* GALERÍA */}
        <div className="space-y-4">
          {images && images.length > 0 ? (
            images.map((img, i) => (
              <Image
                key={img.id}
                src={img.url}
                alt={`${product.name} ${i + 1}`}
                width={800}
                height={1000}
                priority={i === 0}
                className="aspect-[4/5] w-full rounded-2xl border border-zinc-800 object-cover"
              />
            ))
          ) : (
            <div className="flex aspect-[4/5] w-full items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 text-4xl text-zinc-700">
              ◇
            </div>
          )}
        </div>

        {/* INFO + COMPRA */}
        <div>
          {category && (
            <p className="text-xs font-semibold uppercase tracking-widest text-red-500">
              {category.name}
            </p>
          )}
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">{product.name}</h1>
          <p className="mt-3 text-2xl font-semibold text-red-500">
            {formatPrice(Number(product.price))}
          </p>

          {product.description && (
            <p className="mt-6 whitespace-pre-line text-sm leading-relaxed text-zinc-400">
              {product.description}
            </p>
          )}

          <ProductBuyer
            product={{
              id: product.id,
              slug: product.slug,
              name: product.name,
              price: Number(product.price),
            }}
            variants={variants ?? []}
            images={images ?? []}
          />

          <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-sm text-zinc-400">
            <p className="font-semibold text-white">¿Cómo comprar?</p>
            <ol className="mt-2 list-decimal space-y-1 pl-5">
              <li>Elegí color, talle y cantidad.</li>
              <li>Agregá al carrito lo que quieras.</li>
              <li>Cuando termines, enviá el pedido por WhatsApp y te respondemos la confirmación.</li>
            </ol>
          </div>
        </div>
      </div>
    </main>
  )
}
