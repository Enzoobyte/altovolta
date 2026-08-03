import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { formatPrice, firstOrNull } from '@/lib/utils'
import { ProductViewer } from '@/components/store/product-viewer'
import { ShareButtons } from '@/components/store/share-buttons'
import { WhatsAppIcon } from '@/components/store/icons'
import { getSiteSettings } from '@/lib/site'

const SITE_URL = 'https://altovolta.vercel.app'

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await props.params
  const supabase = await createClient()
  const { data: product } = await supabase
    .from('products')
    .select('name, description, images:product_images(url)')
    .eq('slug', slug)
    .eq('active', true)
    .maybeSingle()

  if (!product) return { title: 'Producto no encontrado' }
  const image = product.images?.[0]?.url ?? null
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      type: 'website',
      url: `${SITE_URL}/producto/${slug}`,
      images: image ? [{ url: image, width: 800, height: 1000, alt: product.name }] : undefined,
    },
  }
}

export default async function ProductPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select(
      'id, name, slug, description, price, old_price, category:categories(name), created_at, updated_at'
    )
    .eq('slug', slug)
    .eq('active', true)
    .maybeSingle()

  if (!product) notFound()

  const category = firstOrNull(product.category)
  const price = Number(product.price)
  const oldPrice = product.old_price != null ? Number(product.old_price) : null
  const discount = oldPrice && oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0

  const [{ data: variants }, { data: images }, settings] = await Promise.all([
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
    getSiteSettings(),
  ])

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: images?.map((i) => i.url) ?? [],
    brand: { '@type': 'Brand', name: 'Altovolta' },
    offers: {
      '@type': 'Offer',
      price: price.toFixed(2),
      priceCurrency: 'ARS',
      availability: 'https://schema.org/InStock',
      url: `${SITE_URL}/producto/${slug}`,
    },
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-10 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductViewer
        product={{
          id: product.id,
          slug: product.slug,
          name: product.name,
          price: price,
        }}
        variants={variants ?? []}
        images={images ?? []}
        oldPrice={oldPrice}
      >
        {category && (
          <p className="text-xs font-semibold uppercase tracking-widest text-red-500">
            {category.name}
          </p>
        )}
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-white">{product.name}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <p className="text-2xl font-semibold text-red-500">{formatPrice(price)}</p>
          {discount > 0 && (
            <>
              <p className="text-lg text-zinc-500 line-through">{formatPrice(oldPrice!)}</p>
              <span className="rounded-full bg-red-600 px-2.5 py-1 text-xs font-bold text-white">
                -{discount}%
              </span>
            </>
          )}
        </div>

        <div className="mt-4">
          <ShareButtons
            name={product.name}
            image={images?.[0]?.url ?? null}
            whatsappNumber={settings.whatsapp_number}
          />
        </div>

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
