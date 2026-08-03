import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/server'
import { getCategories, getSiteSettings } from '@/lib/site'
import { ProductCard } from '@/components/store/product-card'
import { WhatsAppIcon } from '@/components/store/icons'
import { buildWhatsAppUrl } from '@/lib/whatsapp'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  title: 'Catálogo',
  description: 'Explorá el catálogo de Altovolta y pedí por WhatsApp.',
}

export default async function HomePage(props: { searchParams: Promise<{ cat?: string }> }) {
  const { cat } = await props.searchParams
  const supabase = await createClient()
  const [settings, categories] = await Promise.all([getSiteSettings(), getCategories()])

  const whatsappUrl =
    settings.whatsapp_number &&
    buildWhatsAppUrl(settings.whatsapp_number, '¡Hola Altovolta! 👋')

  let query = supabase
    .from('products')
    .select(
      'id, slug, name, price, category_id, category:categories(slug), images:product_images(url)',
      { count: 'exact' }
    )
    .eq('active', true)
    .order('created_at', { ascending: false })

  if (cat) {
    query = query.eq('category.slug', cat)
  }

  const { data: products, count } = await query

  return (
    <main>
      {/* HERO */}
      <section className="relative overflow-hidden bg-black">
        {settings.banner_url ? (
          <Image
            src={settings.banner_url}
            alt=""
            fill
            priority
            className="object-cover opacity-50"
            sizes="100vw"
          />
        ) : null}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[480px] w-[480px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/20 blur-[140px]"
        />
        <div className="relative mx-auto flex max-w-6xl flex-col items-center px-4 py-28 text-center lg:px-8">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-red-500">
            Nueva temporada
          </p>
          <h1 className="max-w-2xl text-4xl font-extrabold uppercase tracking-tight text-white sm:text-6xl">
            alt0<span className="text-red-600">volta</span>
          </h1>
          <p className="mt-4 max-w-xl text-zinc-300">
            {settings.about_text || 'Ropa con actitud. Elegí tus prendas y pedí directo por WhatsApp.'}
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#tienda"
              className="rounded-full bg-red-600 px-8 py-3 text-sm font-bold uppercase tracking-wide text-white transition hover:bg-red-500"
            >
              Ver catálogo
            </a>
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-full border border-[#25D366]/50 px-6 py-3 text-sm font-bold uppercase tracking-wide text-[#25D366] transition hover:bg-[#25D366] hover:text-black"
              >
                <WhatsAppIcon className="h-4 w-4" />
                WhatsApp
              </a>
            )}
          </div>
        </div>
      </section>

      {/* FILTRO POR CATEGORÍA + GRID */}
      <section id="tienda" className="mx-auto max-w-6xl px-4 py-12 lg:px-8">
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/"
            className={cn(
              'rounded-full border px-4 py-1.5 text-sm font-medium transition',
              !cat
                ? 'border-red-600 bg-red-600 text-white'
                : 'border-zinc-700 text-zinc-300 hover:border-red-600 hover:text-white'
            )}
          >
            Todos
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/?cat=${c.slug}`}
              className={cn(
                'rounded-full border px-4 py-1.5 text-sm font-medium transition',
                cat === c.slug
                  ? 'border-red-600 bg-red-600 text-white'
                  : 'border-zinc-700 text-zinc-300 hover:border-red-600 hover:text-white'
              )}
            >
              {c.name}
            </Link>
          ))}
        </div>

        {!products || products.length === 0 ? (
          <div className="py-24 text-center">
            <p className="text-lg font-semibold text-white">Sin productos por ahora</p>
            <p className="mt-1 text-sm text-zinc-400">
              {cat ? 'No hay prendas en esta categoría todavía.' : 'El catálogo se está cargando. ¡Volvé pronto!'}
            </p>
          </div>
        ) : (
          <>
            <p className="mt-6 text-sm text-zinc-400">
              {count} {count === 1 ? 'prenda' : 'prendas'}
            </p>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((p) => (
                <ProductCard
                  key={p.id}
                  product={{
                    slug: p.slug,
                    name: p.name,
                    price: Number(p.price),
                    image: p.images?.[0]?.url ?? null,
                  }}
                />
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  )
}
