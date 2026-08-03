import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { formatPrice, firstOrNull } from '@/lib/utils'
import { ProductViewer } from '@/components/store/product-viewer'
import { WhatsAppIcon } from '@/components/store/icons'

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
      .select('id, product_id, url, color, sort_order, created_at')
      .eq('product_id', product.id)
      .order('sort_order', { ascending: true }),
  ])

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
      <ProductViewer
        product={{
          id: product.id,
          slug: product.slug,
          name: product.name,
          price: Number(product.price),
        }}
        variants={variants ?? []}
        images={images ?? []}
      >
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

        <div className="mt-8 rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-sm text-zinc-400">
          <p className="font-semibold text-white">¿Cómo comprar?</p>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>Elegí color, talle y cantidad.</li>
            <li>Agregá al carrito lo que quieras.</li>
            <li>
              Cuando termines, enviá el pedido por{' '}
              <span className="inline-flex items-center gap-1 font-medium text-[#25D366]">
                <WhatsAppIcon className="h-3.5 w-3.5" />
                WhatsApp
              </span>{' '}
              y te respondemos la confirmación.
            </li>
          </ol>
        </div>
      </ProductViewer>
    </main>
  )
}
