import type { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'
import { getCategories } from '@/lib/site'

const SITE_URL = 'https://altovolta.vercel.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()
  const [categories, products] = await Promise.all([
    getCategories(),
    supabase.from('products').select('slug, updated_at').eq('active', true),
  ])

  const entries: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/carrito`, changeFrequency: 'weekly', priority: 0.4 },
    { url: `${SITE_URL}/como-comprar`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/contacto`, changeFrequency: 'monthly', priority: 0.5 },
  ]

  for (const cat of categories) {
    entries.push({
      url: `${SITE_URL}/?cat=${cat.slug}`,
      changeFrequency: 'weekly',
      priority: 0.7,
    })
  }

  for (const p of products.data ?? []) {
    entries.push({
      url: `${SITE_URL}/producto/${p.slug}`,
      changeFrequency: 'weekly',
      priority: 0.8,
      lastModified: p.updated_at,
    })
  }

  return entries
}
